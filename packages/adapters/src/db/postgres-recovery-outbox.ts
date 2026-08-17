import { randomUUID } from 'node:crypto';
import type { Pool } from 'pg';
import type { ClaimedRecoveryEmail, EmailDeliveryResult, RecoveryOutboxRepository } from '@burgoweb/application';

export class PostgresRecoveryOutbox implements RecoveryOutboxRepository {
  constructor(private readonly pool: Pool) {}

  async claim(owner: string, now: Date, leaseSeconds: number): Promise<ClaimedRecoveryEmail | undefined> {
    return this.tx(async client => {
      const result = await client.query(`WITH candidate AS (
        SELECT o.id FROM burgoweb_global.recovery_email_outbox o
        JOIN burgoweb_global.password_recovery_tokens t ON t.id=o.recovery_id
        WHERE ((o.status='pending' AND o.available_at<=$1) OR (o.status='leased' AND o.leased_until<$1))
          AND t.used_at IS NULL AND t.cancelled_at IS NULL AND t.expires_at>$1
        ORDER BY o.available_at,o.created_at,o.id FOR UPDATE OF o SKIP LOCKED LIMIT 1
      ), claimed AS (
        UPDATE burgoweb_global.recovery_email_outbox o
        SET status='leased',lease_owner=$2,leased_until=$1+($3*interval '1 second'),attempt_count=attempt_count+1,updated_at=$1
        FROM candidate WHERE o.id=candidate.id RETURNING o.*
      )
      SELECT c.id AS outbox_id,c.attempt_count,c.lease_owner,c.recipient,t.id AS recovery_id,t.account_id,t.request_id,t.purpose,t.key_version,t.token_hash,t.issued_at,t.expires_at
      FROM claimed c JOIN burgoweb_global.password_recovery_tokens t ON t.id=c.recovery_id`, [now, owner, leaseSeconds]);
      if (!result.rowCount) return undefined;
      const row = result.rows[0];
      await this.audit(client, row.request_id, `password-recovery.email.claimed.${row.attempt_count}`, row.outbox_id, row.attempt_count, 'claimed', now);
      return { recoveryId: row.recovery_id, outboxId: row.outbox_id, accountId: row.account_id, requestId: row.request_id, purpose: row.purpose, keyVersion: row.key_version, tokenHash: row.token_hash.trim(), issuedAt: new Date(row.issued_at), expiresAt: new Date(row.expires_at), to: row.recipient, attemptNumber: row.attempt_count, leaseOwner: row.lease_owner };
    });
  }

  async renew(item: ClaimedRecoveryEmail, now: Date, leaseSeconds: number): Promise<boolean> {
    const result = await this.pool.query(`UPDATE burgoweb_global.recovery_email_outbox SET leased_until=$3+($4*interval '1 second'),updated_at=$3 WHERE id=$1 AND lease_owner=$2 AND status='leased'`, [item.outboxId, item.leaseOwner, now, leaseSeconds]);
    return Boolean(result.rowCount);
  }

  async finish(item: ClaimedRecoveryEmail, result: EmailDeliveryResult, now: Date, nextAttemptAt?: Date): Promise<boolean> {
    const status = result.kind === 'accepted' ? 'accepted' : result.kind === 'ambiguous' ? 'ambiguous' : nextAttemptAt ? 'pending' : 'dead';
    const reference = result.kind === 'accepted' ? result.providerReference : null;
    const code = result.kind === 'accepted' ? null : result.code.slice(0, 80);
    return this.tx(async client => {
      const changed = await client.query(`UPDATE burgoweb_global.recovery_email_outbox SET status=$4,available_at=COALESCE($5,available_at),leased_until=NULL,lease_owner=NULL,provider_reference=$6,last_error_code=$7,updated_at=$3 WHERE id=$1 AND lease_owner=$2 AND status='leased'`, [item.outboxId, item.leaseOwner, now, status, nextAttemptAt, reference, code]);
      if (!changed.rowCount) return false;
      const outcome = status === 'pending' ? 'retry' : status;
      await this.audit(client, item.requestId, `password-recovery.email.${outcome}.${item.attemptNumber}`, item.outboxId, item.attemptNumber, outcome, now);
      return true;
    });
  }

  private async audit(client: any, requestId: string, eventType: string, outboxId: string, attemptNumber: number, state: string, occurredAt: Date) {
    await client.query(`INSERT INTO burgoweb_global.audit_events(id,request_id,event_type,metadata,occurred_at) VALUES($1,$2,$3,$4::jsonb,$5) ON CONFLICT DO NOTHING`, [randomUUID(), requestId, eventType, JSON.stringify({ outboxId, attemptNumber, state }), occurredAt]);
  }

  private async tx<T>(work: (client: any) => Promise<T>) {
    const client = await this.pool.connect();
    try { await client.query('BEGIN'); const value = await work(client); await client.query('COMMIT'); return value; }
    catch (error) { await client.query('ROLLBACK'); throw error; }
    finally { client.release(); }
  }
}
