import type { Pool, PoolClient } from 'pg';
import { randomUUID } from 'node:crypto';
import type { ConfirmEmailResult, PendingVerificationRecord, VerificationRepository } from '@burgoweb/application';

async function insertVerification(client: PoolClient, record: PendingVerificationRecord): Promise<void> {
  await client.query(`INSERT INTO burgoweb_global.verification_tokens(id,outbox_id,account_id,request_id,purpose,key_version,token_hash,issued_at,expires_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`, [record.verificationId, record.outboxId, record.accountId, record.requestId, record.purpose, record.keyVersion, record.tokenHash, record.issuedAt, record.expiresAt]);
  await client.query(`INSERT INTO burgoweb_global.email_outbox(id,verification_id,event_type,status,available_at,correlation_id,created_at,updated_at) VALUES ($1,$2,'email-verification.requested.v1','pending',$3,$4,$3,$3)`, [record.outboxId, record.verificationId, record.issuedAt, record.requestId]);
}

export { insertVerification };

export class PostgresVerificationRepository implements VerificationRepository {
  constructor(private readonly pool: Pool, private readonly failpoint?: (stage: string) => void) {}
  async reissue(command: Parameters<VerificationRepository['reissue']>[0], issue: Parameters<VerificationRepository['reissue']>[1]): Promise<boolean> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const target = await client.query(`SELECT pr.id AS request_id,pr.account_id FROM burgoweb_global.provisioning_requests pr JOIN burgoweb_global.accounts a ON a.id=pr.account_id JOIN burgoweb_global.tenant_registry tr ON tr.id=pr.tenant_id WHERE pr.id=$1 AND a.email_normalized=$2 AND pr.state='pending_verification' AND tr.state='pending_verification' FOR UPDATE OF pr,a,tr`, [command.requestId, command.email]);
      if (!target.rowCount) {
        // Non-eligible targets must not be measurably faster to answer than eligible ones
        // (non-enumeration, AC 8/9): run the same predicates as the real writes below with a
        // self-assigning SET, so the planner can't constant-fold this into a zero-cost no-op.
        await client.query(`UPDATE burgoweb_global.verification_tokens SET cancelled_at=cancelled_at WHERE request_id=$1 AND purpose='email-verification' AND used_at IS NULL AND cancelled_at IS NULL`, [command.requestId]);
        await client.query(`UPDATE burgoweb_global.email_outbox eo SET status=eo.status FROM burgoweb_global.verification_tokens vt WHERE eo.verification_id=vt.id AND vt.request_id=$1 AND eo.status IN ('pending','leased')`, [command.requestId]);
        await client.query('ROLLBACK');
        return false;
      }
      const record = issue({ accountId: target.rows[0].account_id, requestId: target.rows[0].request_id });
      await client.query(`UPDATE burgoweb_global.verification_tokens SET cancelled_at=$2 WHERE request_id=$1 AND purpose='email-verification' AND used_at IS NULL AND cancelled_at IS NULL`, [record.requestId, record.issuedAt]);
      await client.query(`UPDATE burgoweb_global.email_outbox eo SET status='dead',last_error_code='superseded',updated_at=$2 FROM burgoweb_global.verification_tokens vt WHERE eo.verification_id=vt.id AND vt.request_id=$1 AND eo.status IN ('pending','leased')`, [record.requestId, record.issuedAt]);
      await insertVerification(client, record);
      await client.query('COMMIT'); return true;
    } catch (error) { await client.query('ROLLBACK'); throw error; }
    finally { client.release(); }
  }

  async confirm(tokenHash: string, now: Date): Promise<ConfirmEmailResult | undefined> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const found = await client.query(`SELECT vt.id,vt.request_id,vt.account_id,tr.id AS tenant_id,tr.schema_name,tr.migration_version,pa.id AS authority_id FROM burgoweb_global.verification_tokens vt JOIN burgoweb_global.provisioning_requests pr ON pr.id=vt.request_id AND pr.account_id=vt.account_id JOIN burgoweb_global.accounts a ON a.id=vt.account_id JOIN burgoweb_global.tenant_registry tr ON tr.id=pr.tenant_id JOIN burgoweb_global.pending_authorities pa ON pa.request_id=pr.id AND pa.account_id=a.id AND pa.tenant_id=tr.id WHERE vt.token_hash=$1 AND vt.purpose='email-verification' AND vt.used_at IS NULL AND vt.cancelled_at IS NULL AND vt.expires_at>$2 AND a.state='pending_verification' AND pr.state='pending_verification' AND tr.state='pending_verification' AND pa.state='pending_verification' FOR UPDATE OF vt,pr,a,tr,pa`, [tokenHash, now]);
      if (!found.rowCount) { await client.query('ROLLBACK'); return undefined; }
      const row = found.rows[0] as { id: string; request_id: string; account_id: string; tenant_id: string; schema_name: string; migration_version: number; authority_id: string };
      if (row.migration_version !== 8 || !/^tenant_[a-f0-9]{32}$/.test(row.schema_name)) { await client.query('ROLLBACK'); return undefined; }
      const version = await client.query(`SELECT 1 FROM ${row.schema_name}.schema_version WHERE version=8`);
      if (!version.rowCount) { await client.query('ROLLBACK'); return undefined; }
      await client.query(`UPDATE burgoweb_global.verification_tokens SET used_at=$2 WHERE id=$1 AND used_at IS NULL`, [row.id, now]);
      this.failpoint?.('activation.after-token');
      await client.query(`UPDATE burgoweb_global.accounts SET state='active',email_verified_at=$2 WHERE id=$1 AND state='pending_verification'`, [row.account_id, now]);
      await client.query(`UPDATE burgoweb_global.tenant_registry SET state='active' WHERE id=$1 AND state='pending_verification'`, [row.tenant_id]);
      this.failpoint?.('activation.after-global');
      await client.query(`UPDATE burgoweb_global.pending_authorities SET state='active',activated_at=$2 WHERE id=$1 AND state='pending_verification'`, [row.authority_id, now]);
      const authority = await client.query(`UPDATE ${row.schema_name}.authority_assignment SET state='active',activated_at=$2 WHERE id=$1 AND state='pending_verification' RETURNING person_id`, [row.authority_id, now]);
      if (authority.rowCount !== 1) throw new Error('Autoridade inicial correlacionada indisponÃ­vel.');
      await client.query(`UPDATE ${row.schema_name}.role_assignment SET state='active',valid_from=$2,updated_at=$2,version=version+1 WHERE id=$1 AND state='scheduled'`,[row.authority_id,now]);
      await client.query(`UPDATE ${row.schema_name}.role_authorization_projection SET state='active',valid_from=$2,version=version+1,projected_at=$2 WHERE assignment_id=$1`,[row.authority_id,now]);
      await client.query(`INSERT INTO burgoweb_global.account_tenant_memberships(id,account_id,tenant_id,person_id,authority_id,state,valid_from) VALUES ($1,$2,$3,$4,$1,'active',$5) ON CONFLICT(account_id,tenant_id,authority_id) DO NOTHING`, [row.authority_id, row.account_id, row.tenant_id, authority.rows[0].person_id, now]);
      this.failpoint?.('activation.after-tenant');
      await client.query(`INSERT INTO burgoweb_global.audit_events(id,request_id,event_type,metadata,occurred_at) VALUES ($1,$2,'email-verification.activated','{}'::jsonb,$3) ON CONFLICT DO NOTHING`, [randomUUID(), row.request_id, now]);
      await client.query('COMMIT');
      return { state: 'activated', message: 'E-mail confirmado. O controle deste canal foi comprovado.' };
    } catch (error) { await client.query('ROLLBACK'); throw error; }
    finally { client.release(); }
  }
}
