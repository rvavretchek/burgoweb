import { randomUUID } from 'node:crypto';
import type { Pool, PoolClient } from 'pg';
import type { AccountSessionRepository, PendingRecoveryRecord, RecoveryRepository } from '@burgoweb/application';

const SESSION_HISTORY_LIMIT = 100;

async function transaction<T>(pool: Pool, work: (client: PoolClient) => Promise<T>) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const value = await work(client);
    await client.query('COMMIT');
    return value;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export class PostgresRecoveryRepository implements RecoveryRepository, AccountSessionRepository {
  constructor(private readonly pool: Pool) {}

  async request(email: string, requestId: string, requestedAt: Date, issue: (target: { accountId: string }) => PendingRecoveryRecord) {
    return transaction(this.pool, async client => {
      const found = await client.query(
        `SELECT id FROM burgoweb_global.accounts
         WHERE email_normalized=$1 AND state='active' AND email_verified_at IS NOT NULL
         FOR UPDATE`,
        [email],
      );

      // Execute the same token-derivation callback even for an absent/ineligible account.
      // This keeps application-side work close without persisting a token for a fake subject.
      const record = issue({ accountId: found.rowCount ? found.rows[0].id : randomUUID() });
      if (found.rowCount) {
        await client.query('SET CONSTRAINTS ALL DEFERRED');
        await client.query(
          `INSERT INTO burgoweb_global.password_recovery_tokens
           (id,outbox_id,account_id,request_id,purpose,key_version,token_hash,issued_at,expires_at)
           VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
          [record.recoveryId, record.outboxId, record.accountId, record.requestId, record.purpose, record.keyVersion, record.tokenHash, record.issuedAt, record.expiresAt],
        );
        await client.query(
          `INSERT INTO burgoweb_global.recovery_email_outbox
           (id,recovery_id,status,available_at,correlation_id,created_at,updated_at,recipient)
           VALUES($1,$2,'pending',$3,$4,$3,$3,$5)`,
          [record.outboxId, record.recoveryId, record.issuedAt, record.requestId, record.email],
        );
      }
      await client.query(
        `INSERT INTO burgoweb_global.audit_events(id,request_id,event_type,metadata,occurred_at)
         VALUES($1,$2,'password-recovery.requested','{}',$3)`,
        [randomUUID(), requestId, requestedAt],
      );
      return Boolean(found.rowCount);
    });
  }

  async complete(input: Parameters<RecoveryRepository['complete']>[0]) {
    return transaction(this.pool, async client => {
      const found = await client.query(
        `SELECT t.id,t.account_id,t.issued_at
         FROM burgoweb_global.password_recovery_tokens t
         JOIN burgoweb_global.accounts a ON a.id=t.account_id
         WHERE t.token_hash=$1 AND t.purpose='password-recovery'
           AND t.used_at IS NULL AND t.cancelled_at IS NULL AND t.expires_at>$2
           AND a.state='active' AND a.email_verified_at IS NOT NULL
         FOR UPDATE OF t,a`,
        [input.recoveryTokenHash, input.createdAt],
      );
      if (!found.rowCount) return false;
      const row = found.rows[0];
      const credential = await client.query(
        `UPDATE burgoweb_global.credentials
         SET encoded_hash=$2,pepper_version=$3,created_at=$4 WHERE account_id=$1`,
        [row.account_id, input.password.encodedHash, input.password.pepperVersion, input.createdAt],
      );
      if (credential.rowCount !== 1) throw new Error('Recovery credential invariant violated.');
      await client.query(
        `UPDATE burgoweb_global.password_recovery_tokens
         SET used_at=CASE WHEN id=$2 THEN $3 ELSE used_at END,
             cancelled_at=CASE WHEN id<>$2 THEN $3 ELSE cancelled_at END
         WHERE account_id=$1 AND used_at IS NULL AND cancelled_at IS NULL
           AND (id=$2 OR issued_at<$4)`,
        [row.account_id, row.id, input.createdAt, row.issued_at],
      );
      if (input.revokeOtherSessions) {
        await client.query(
          `UPDATE burgoweb_global.sessions SET revoked_at=$2,revoked_reason='password-recovery'
           WHERE account_id=$1 AND revoked_at IS NULL`,
          [row.account_id, input.createdAt],
        );
      }
      await client.query(
        `INSERT INTO burgoweb_global.sessions
         (id,public_id,token_hash,csrf_hash,account_id,created_at,last_seen_at,absolute_expires_at,idle_ttl_seconds)
         VALUES($1,$2,$3,$4,$5,$6,$6,$7,$8)`,
        [randomUUID(), randomUUID(), input.sessionTokenHash, input.csrfHash, row.account_id, input.createdAt, input.absoluteExpiresAt, input.idleTtlSeconds],
      );
      await client.query(
        `INSERT INTO burgoweb_global.audit_events(id,request_id,event_type,metadata,occurred_at)
         VALUES($1,$2,'password-recovery.completed','{}',$3),($4,$2,'session.created','{}',$3)`,
        [randomUUID(), input.requestId, input.createdAt, randomUUID()],
      );
      return true;
    });
  }

  async listSessions(accountId: string, currentTokenHash: string, now: Date) {
    const result = await this.pool.query(
      `SELECT public_id,created_at,last_seen_at,revoked_at,absolute_expires_at,idle_ttl_seconds,token_hash
       FROM burgoweb_global.sessions WHERE account_id=$1
       ORDER BY created_at DESC,id DESC LIMIT $2`,
      [accountId, SESSION_HISTORY_LIMIT],
    );
    return result.rows.map(row => {
      const expired = new Date(row.absolute_expires_at) <= now || new Date(row.last_seen_at).getTime() + row.idle_ttl_seconds * 1000 <= now.getTime();
      return {
        publicId: row.public_id,
        createdAt: new Date(row.created_at),
        lastActivityAt: new Date(Math.floor(new Date(row.last_seen_at).getTime() / 300000) * 300000),
        state: row.revoked_at ? 'revoked' as const : expired ? 'expired' as const : 'active' as const,
        current: row.token_hash.trim() === currentTokenHash,
      };
    });
  }

  async revokeAccountSession(input: Parameters<AccountSessionRepository['revokeAccountSession']>[0]) {
    return transaction(this.pool, async client => {
      const found = await client.query(
        `SELECT target.id,target.token_hash,target.revoked_at
         FROM burgoweb_global.sessions target
         WHERE target.public_id=$1 AND target.account_id=$2
           AND EXISTS(SELECT 1 FROM burgoweb_global.sessions current
             WHERE current.account_id=$2 AND current.token_hash=$3 AND current.revoked_at IS NULL
               AND current.absolute_expires_at>$4
               AND current.last_seen_at+(current.idle_ttl_seconds*interval '1 second')>$4)
         FOR UPDATE OF target`,
        [input.sessionPublicId, input.accountId, input.currentTokenHash, input.now],
      );
      if (!found.rowCount) return { revoked: false, current: false };
      const row = found.rows[0];
      const current = row.token_hash.trim() === input.currentTokenHash;
      if (!row.revoked_at) {
        await client.query(`UPDATE burgoweb_global.sessions SET revoked_at=$2,revoked_reason='account-session-control' WHERE id=$1`, [row.id, input.now]);
        await client.query(`DELETE FROM burgoweb_global.session_csrf_tokens WHERE session_id=$1`, [row.id]);
        await client.query(
          `INSERT INTO burgoweb_global.audit_events(id,request_id,event_type,metadata,occurred_at)
           VALUES($1,$2,'session.revoked','{}',$3)`,
          [randomUUID(), input.requestId, input.now],
        );
      }
      return { revoked: !row.revoked_at, current };
    });
  }

  async revokeOtherSessions(input: Parameters<AccountSessionRepository['revokeOtherSessions']>[0]) {
    return transaction(this.pool, async client => {
      // FOR UPDATE conflicts with the FK key-share lock acquired by concurrent session inserts.
      await client.query(`SELECT id FROM burgoweb_global.accounts WHERE id=$1 FOR UPDATE`, [input.accountId]);
      const current = await client.query(
        `SELECT id FROM burgoweb_global.sessions
         WHERE account_id=$1 AND token_hash=$2 AND revoked_at IS NULL
           AND absolute_expires_at>$3
           AND last_seen_at+(idle_ttl_seconds*interval '1 second')>$3
         FOR UPDATE`,
        [input.accountId, input.currentTokenHash, input.now],
      );
      if (!current.rowCount) throw new Error('Current session guard rejected.');
      const changed = await client.query(
        `UPDATE burgoweb_global.sessions SET revoked_at=$3,revoked_reason='account-session-control'
         WHERE account_id=$1 AND token_hash<>$2 AND revoked_at IS NULL`,
        [input.accountId, input.currentTokenHash, input.now],
      );
      await client.query(
        `INSERT INTO burgoweb_global.audit_events(id,request_id,event_type,metadata,occurred_at)
         VALUES($1,$2,'sessions.others-revoked',$3::jsonb,$4)`,
        [randomUUID(), input.requestId, JSON.stringify({ count: changed.rowCount ?? 0 }), input.now],
      );
      return changed.rowCount ?? 0;
    });
  }
}
