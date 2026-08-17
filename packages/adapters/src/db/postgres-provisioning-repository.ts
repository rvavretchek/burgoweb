import { randomUUID } from 'node:crypto';
import type { Pool, PoolClient } from 'pg';
import { IdempotencyClaimConflict, type AuditPort, type ProvisioningRepository, type PublicProvisioningResult, type StoredProvisioning } from '@burgoweb/application';
import { insertVerification } from './postgres-verification-repository.js';

const OPERATION = 'create-condominium';

async function transaction<T>(pool: Pool, work: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try { await client.query('BEGIN'); const value = await work(client); await client.query('COMMIT'); return value; }
  catch (error) { await client.query('ROLLBACK'); throw error; }
  finally { client.release(); }
}

export class PostgresProvisioningRepository implements ProvisioningRepository {
  constructor(private readonly pool: Pool, private readonly failpoint?: (stage: string) => void) {}

  async findByIdempotencyKey(key: string): Promise<StoredProvisioning | undefined> {
    const found = await this.pool.query(`SELECT ir.request_hash, ir.response_json, pr.id AS request_id, pr.state FROM burgoweb_global.idempotency_records ir JOIN burgoweb_global.provisioning_requests pr ON pr.id=ir.request_id WHERE ir.operation=$1 AND ir.idempotency_key=$2`, [OPERATION, key]);
    if (!found.rowCount) return undefined;
    const row = found.rows[0];
    const state = row.state === 'pending_verification' ? 'pending-email-verification' : String(row.state).replaceAll('_', '-');
    return { requestId: row.request_id, idempotencyKey: key, requestHash: row.request_hash.trim(), state: state as StoredProvisioning['state'], result: row.response_json as PublicProvisioningResult | undefined };
  }

  async begin(record: StoredProvisioning): Promise<void> {
    try {
      await transaction(this.pool, async client => {
        await client.query(`INSERT INTO burgoweb_global.provisioning_requests(id,state,correlation_id,created_at,updated_at) VALUES ($1,'processing',$1,now(),now())`, [record.requestId]);
        await client.query(`INSERT INTO burgoweb_global.idempotency_records(operation,idempotency_key,request_hash,request_id) VALUES ($1,$2,$3,$4)`, [OPERATION, record.idempotencyKey, record.requestHash, record.requestId]);
      });
    } catch (error) {
      if ((error as { code?: string }).code === '23505') throw new IdempotencyClaimConflict();
      throw error;
    }
  }

  async accountExists(email: string): Promise<boolean> {
    return Boolean((await this.pool.query(`SELECT 1 FROM burgoweb_global.accounts WHERE email_normalized=$1`, [email])).rowCount);
  }

  async persistGlobal(input: Parameters<ProvisioningRepository['persistGlobal']>[0]): ReturnType<ProvisioningRepository['persistGlobal']> {
    const email = input.command.account.email.trim().toLowerCase();
    if (await this.accountExists(email)) return { existingAccount: true };
    const ids = { account: randomUUID(), tenant: randomUUID(), declaration: randomUUID(), authority: randomUUID(), person: randomUUID() };
    try {
      return await transaction(this.pool, async client => {
        await client.query(`INSERT INTO burgoweb_global.accounts(id,email_normalized,state,created_at) VALUES ($1,$2,'pending_verification',$3)`, [ids.account, email, input.acceptedAt]);
        this.failpoint?.('global.after-account');
        await client.query(`INSERT INTO burgoweb_global.credentials(account_id,encoded_hash,pepper_version,created_at) VALUES ($1,$2,$3,$4)`, [ids.account, input.passwordHash.encodedHash, input.passwordHash.pepperVersion, input.acceptedAt]);
        this.failpoint?.('global.after-credential');
        await client.query(`INSERT INTO burgoweb_global.tenant_registry(id,public_id,schema_name,display_name,state,migration_version,created_at) VALUES ($1,$2,$3,$4,'provisioning',0,$5)`, [ids.tenant, input.publicCondominiumId, input.schemaName, input.command.condominium.displayName.trim(), input.acceptedAt]);
        this.failpoint?.('global.after-tenant');
        await client.query(`UPDATE burgoweb_global.provisioning_requests SET account_id=$2,tenant_id=$3,updated_at=$4 WHERE id=$1`, [input.requestId, ids.account, ids.tenant, input.acceptedAt]);
        await client.query(`INSERT INTO burgoweb_global.authority_declarations(id,request_id,account_id,tenant_id,declarant_name,declaration_text,declaration_version,accepted_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`, [ids.declaration, input.requestId, ids.account, ids.tenant, input.command.person.fullName.trim(), input.declarationText, input.declarationVersion, input.acceptedAt]);
        this.failpoint?.('global.after-declaration');
        await client.query(`INSERT INTO burgoweb_global.pending_authorities(id,request_id,tenant_id,account_id,state) VALUES ($1,$2,$3,$4,'pending_verification')`, [ids.authority, input.requestId, ids.tenant, ids.account]);
        this.failpoint?.('global.after-authority');
        return { existingAccount: false, accountId: ids.account, seed: { personId: ids.person, authorityId: ids.authority, fullName: input.command.person.fullName.trim(), acceptedAt: input.acceptedAt } };
      });
    } catch (error) {
      if ((error as { code?: string }).code === '23505' && await this.accountExists(email)) return { existingAccount: true };
      throw error;
    }
  }

  async markPending(key: string, result: PublicProvisioningResult, event: Parameters<ProvisioningRepository['markPending']>[2], verification?: Parameters<ProvisioningRepository['markPending']>[3]): Promise<void> {
    await transaction(this.pool, async client => {
      const request = await client.query(`SELECT pr.id,pr.tenant_id FROM burgoweb_global.provisioning_requests pr JOIN burgoweb_global.idempotency_records ir ON ir.request_id=pr.id WHERE ir.operation=$1 AND ir.idempotency_key=$2 FOR UPDATE`, [OPERATION, key]);
      if (!request.rowCount) throw new Error(`Registro de provisionamento não encontrado para a chave ${key}.`);
      await client.query(`UPDATE burgoweb_global.provisioning_requests SET state='pending_verification',updated_at=now() WHERE id=$1`, [request.rows[0].id]);
      if (request.rows[0].tenant_id) await client.query(`UPDATE burgoweb_global.tenant_registry SET state='pending_verification',migration_version=8 WHERE id=$1`, [request.rows[0].tenant_id]);
      await client.query(`UPDATE burgoweb_global.idempotency_records SET response_json=$3::jsonb WHERE operation=$1 AND idempotency_key=$2`, [OPERATION, key, JSON.stringify(result)]);
      await client.query(`INSERT INTO burgoweb_global.audit_events(id,request_id,event_type,metadata,occurred_at) VALUES ($1,$2,$3,$4::jsonb,$5)`, [randomUUID(), event.requestId, event.type, JSON.stringify(event.metadata), event.occurredAt]);
      if (verification) await insertVerification(client, verification);
      this.failpoint?.('global.before-pending-commit');
    });
  }

  async markFailure(key: string, state: 'compensated' | 'quarantined', correlationId: string): Promise<void> {
    await transaction(this.pool, async client => {
      const request = await client.query(`SELECT pr.id,pr.tenant_id FROM burgoweb_global.provisioning_requests pr JOIN burgoweb_global.idempotency_records ir ON ir.request_id=pr.id WHERE ir.operation=$1 AND ir.idempotency_key=$2 FOR UPDATE`, [OPERATION, key]);
      if (!request.rowCount) throw new Error(`Registro de provisionamento não encontrado para a chave ${key}.`);
      await client.query(`UPDATE burgoweb_global.provisioning_requests SET state=$2,diagnostic_code=$3,updated_at=now() WHERE id=$1`, [request.rows[0].id, state, correlationId]);
      if (request.rows[0].tenant_id) await client.query(`UPDATE burgoweb_global.tenant_registry SET state=$2 WHERE id=$1`, [request.rows[0].tenant_id, state]);
    });
  }
}

export class PostgresAuditPort implements AuditPort {
  constructor(private readonly pool: Pool) {}
  async record(event: Parameters<AuditPort['record']>[0]): Promise<void> {
    await this.pool.query(`INSERT INTO burgoweb_global.audit_events(id,request_id,event_type,metadata,occurred_at) VALUES ($1,$2,$3,$4::jsonb,$5)`, [randomUUID(), event.requestId, event.type, JSON.stringify(event.metadata), event.occurredAt]);
  }
}
