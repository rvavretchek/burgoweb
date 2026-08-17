import { randomUUID } from 'node:crypto';
import type { Pool } from 'pg';
import type { ClaimedVerificationEmail, EmailDeliveryResult, VerificationOutboxRepository } from '@burgoweb/application';

export class PostgresVerificationOutbox implements VerificationOutboxRepository {
  constructor(private readonly pool: Pool) {}

  async claim(owner: string, now: Date, leaseSeconds: number): Promise<ClaimedVerificationEmail | undefined> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await client.query(`WITH candidate AS (SELECT eo.id FROM burgoweb_global.email_outbox eo JOIN burgoweb_global.verification_tokens vt ON vt.id=eo.verification_id WHERE ((eo.status='pending' AND eo.available_at<=$1) OR (eo.status='leased' AND eo.leased_until<$1)) AND vt.used_at IS NULL AND vt.cancelled_at IS NULL AND vt.expires_at>$1 ORDER BY eo.available_at,eo.created_at,eo.id FOR UPDATE OF eo SKIP LOCKED LIMIT 1), claimed AS (UPDATE burgoweb_global.email_outbox eo SET status='leased',lease_owner=$2,leased_until=$1+($3*interval '1 second'),attempt_count=attempt_count+1,updated_at=$1 FROM candidate WHERE eo.id=candidate.id RETURNING eo.*) SELECT c.id AS outbox_id,c.attempt_count,c.lease_owner,vt.id AS verification_id,vt.account_id,vt.request_id,vt.purpose,vt.key_version,vt.token_hash,vt.issued_at,vt.expires_at,a.email_normalized AS recipient FROM claimed c JOIN burgoweb_global.verification_tokens vt ON vt.id=c.verification_id JOIN burgoweb_global.accounts a ON a.id=vt.account_id`, [now, owner, leaseSeconds]);
      await client.query(`UPDATE burgoweb_global.email_outbox eo SET status='dead',last_error_code='token-unavailable',updated_at=$1 FROM burgoweb_global.verification_tokens vt WHERE eo.verification_id=vt.id AND eo.status IN ('pending','leased') AND ((eo.status='pending' AND eo.available_at<=$1) OR (eo.status='leased' AND eo.leased_until<$1)) AND (vt.used_at IS NOT NULL OR vt.cancelled_at IS NOT NULL OR vt.expires_at<=$1)`, [now]);
      if (!result.rowCount) { await client.query('COMMIT'); return undefined; }
      const row = result.rows[0];
      await client.query(`INSERT INTO burgoweb_global.email_delivery_attempts(id,outbox_id,attempt_number,provider,state,started_at) VALUES ($1,$2,$3,'email-port','started',$4)`, [randomUUID(), row.outbox_id, row.attempt_count, now]);
      await client.query('COMMIT');
      return { verificationId: row.verification_id, outboxId: row.outbox_id, accountId: row.account_id, requestId: row.request_id, purpose: row.purpose, keyVersion: row.key_version, tokenHash: row.token_hash.trim(), issuedAt: row.issued_at, expiresAt: row.expires_at, to: row.recipient, attemptNumber: row.attempt_count, leaseOwner: row.lease_owner };
    } catch (error) { await client.query('ROLLBACK'); throw error; }
    finally { client.release(); }
  }

  async renew(item: ClaimedVerificationEmail, now: Date, leaseSeconds: number): Promise<boolean> {
    const result = await this.pool.query(`UPDATE burgoweb_global.email_outbox SET leased_until=$3::timestamptz+($4*interval '1 second'),updated_at=$3 WHERE id=$1 AND lease_owner=$2 AND status='leased'`, [item.outboxId, item.leaseOwner, now, leaseSeconds]);
    return Boolean(result.rowCount);
  }

  async finish(item: ClaimedVerificationEmail, result: EmailDeliveryResult, now: Date, nextAttemptAt?: Date): Promise<void> {
    const state = result.kind === 'accepted' ? 'accepted' : result.kind === 'ambiguous' ? 'ambiguous' : 'failed';
    const status = result.kind === 'accepted' ? 'accepted' : result.kind === 'ambiguous' ? 'ambiguous' : nextAttemptAt ? 'pending' : 'dead';
    const reference = result.kind === 'accepted' ? result.providerReference : null;
    const code = result.kind === 'accepted' ? null : result.code.slice(0, 80);
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const changed = await client.query(`UPDATE burgoweb_global.email_outbox SET status=$4,available_at=COALESCE($5,available_at),leased_until=NULL,lease_owner=NULL,provider_reference=$6,last_error_code=$7,updated_at=$3 WHERE id=$1 AND lease_owner=$2 AND status='leased'`, [item.outboxId, item.leaseOwner, now, status, nextAttemptAt, reference, code]);
      if (changed.rowCount) await client.query(`UPDATE burgoweb_global.email_delivery_attempts SET state=$4,provider_reference=$5,error_code=$6,finished_at=$3 WHERE outbox_id=$1 AND attempt_number=$2 AND state='started'`, [item.outboxId, item.attemptNumber, now, state, reference, code]);
      await client.query('COMMIT');
    } catch (error) { await client.query('ROLLBACK'); throw error; }
    finally { client.release(); }
  }
}
