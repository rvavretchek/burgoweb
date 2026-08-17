import { createHash, randomUUID } from 'node:crypto';
import { Kysely, PostgresDialect, sql, type Transaction } from 'kysely';
import type { Pool, PoolClient, QueryResult } from 'pg';
import {
  InstitucionalConflict,
  InstitutionalAccessDenied,
  InstitutionalNotFound,
  InstitutionalValidation,
  MANAGE_INSTITUTIONAL_RECORDS,
  normalizeUnitIdentifier,
  type CreatePersonCommand,
  type CreateRelationshipCommand,
  type CreateUnitCommand,
  type EndRelationshipCommand,
  type Page,
  type PeopleUnitsRepository,
  type PersonRecord,
  type RelationshipRecord,
  type TenantContext,
  type UnitRecord,
  type UpdatePersonCommand,
  type UpdateRelationshipCommand,
  type UpdateUnitCommand,
} from '@burgoweb/application';

const SAFE_SCHEMA = /^tenant_[a-f0-9]{32}$/;
type Db = Record<string, never>;
type Tx = Transaction<Db>;

type AuthorizationSourceQuery = Pick<PoolClient, 'query'>;
export interface AuthorizationSourceLink {
  readonly schemaName: string;
  readonly tenantId: string;
  readonly relationshipId?: string;
  readonly relationshipPublicId?: string;
  readonly expectedPersonId?: string;
  readonly authorityId: string;
  readonly membershipId: string;
}

export async function linkAuthorizationSourceInTransaction(
  client: AuthorizationSourceQuery,
  link: AuthorizationSourceLink,
): Promise<void> {
  if (!SAFE_SCHEMA.test(link.schemaName) || (link.relationshipId === undefined) === (link.relationshipPublicId === undefined)) {
    throw new InstitutionalAccessDenied();
  }
  const source = await client.query(
    `SELECT r.id,r.person_id,r.state,p.state AS person_state
       FROM ${link.schemaName}.person_unit_relationship r
       JOIN ${link.schemaName}.person p ON p.id=r.person_id
      WHERE ${link.relationshipId ? 'r.id=$1' : 'r.public_id=$1'}
      FOR UPDATE OF r,p`,
    [link.relationshipId ?? link.relationshipPublicId],
  ) as QueryResult<any>;
  const relationship = source.rows[0];
  if (!relationship) throw new InstitutionalNotFound();
  if (relationship.state !== 'active' || relationship.person_state !== 'active') {
    throw new InstitucionalConflict('O Vínculo foi encerrado.');
  }
  if (link.expectedPersonId && relationship.person_id !== link.expectedPersonId) {
    throw new InstitutionalNotFound();
  }
  const authority = await client.query(
    `UPDATE ${link.schemaName}.authority_assignment
        SET source_relationship_id=$1
      WHERE id=$2 AND person_id=$3 AND state='active' AND source_relationship_id IS NULL
      RETURNING id`,
    [relationship.id, link.authorityId, relationship.person_id],
  ) as QueryResult<any>;
  if (!authority.rows[0]) throw new InstitutionalNotFound();
  const membership = await client.query(
    `UPDATE burgoweb_global.account_tenant_memberships
        SET source_relationship_id=$1
      WHERE id=$2 AND tenant_id=$3 AND authority_id=$4 AND person_id=$5
        AND state='active' AND source_relationship_id IS NULL
      RETURNING id`,
    [relationship.id, link.membershipId, link.tenantId, link.authorityId, relationship.person_id],
  ) as QueryResult<any>;
  if (!membership.rows[0]) throw new InstitutionalNotFound();
}

const digest = (value: string) => createHash('sha256').update(value).digest('hex');
const canonicalPayload = (command: object) => {
  const payload = Object.fromEntries(Object.entries(command).filter(([key]) => key !== 'requestId' && key !== 'idempotencyKey'));
  return JSON.stringify(payload, Object.keys(payload).sort());
};
const table = (context: TenantContext, name: string) => sql.table(`${context.schemaName}.${name}`);
const civilDate = (value: unknown) => {
  if (value instanceof Date) {
    // pg's date parser constructs local-time Date objects; use local getters so the
    // returned civil date doesn't shift by a day under a positive UTC-offset server timezone.
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  return String(value).slice(0, 10);
};

function person(row: any): PersonRecord {
  return { publicId: row.public_id, fullName: row.full_name, email: row.email ?? undefined, state: row.state, version: Number(row.version) };
}
function unit(row: any): UnitRecord {
  return { publicId: row.public_id, identifier: row.identifier, state: row.state, version: Number(row.version) };
}
function relationship(row: any): RelationshipRecord {
  return {
    publicId: row.public_id,
    personPublicId: row.person_public_id,
    unitPublicId: row.unit_public_id,
    relationKind: row.relation_kind,
    startsOn: civilDate(row.starts_on) as RelationshipRecord['startsOn'],
    endsOn: row.ends_on ? civilDate(row.ends_on) as RelationshipRecord['endsOn'] : undefined,
    state: row.state,
    version: Number(row.version),
  };
}

export class PostgresPeopleUnitsRepository implements PeopleUnitsRepository {
  private readonly db: Kysely<Db>;

  constructor(private readonly pool: Pool, private readonly idempotencyRetentionHours = 24) {
    this.db = new Kysely({ dialect: new PostgresDialect({ pool }) });
  }

  private async authorized<T>(context: TenantContext, work: (trx: Tx) => Promise<T>, lockAuthorization = true): Promise<T> {
    if (!SAFE_SCHEMA.test(context.schemaName)) throw new InstitutionalAccessDenied();
    return this.db.transaction().execute(async trx => {
      const locking = lockAuthorization ? sql` FOR UPDATE OF m,a` : sql``;
      const result = await sql<any>`
        SELECT m.authorization_version,a.authorization_version AS authority_version
        FROM burgoweb_global.account_tenant_memberships m
        JOIN ${table(context, 'authority_assignment')} a ON a.id=m.authority_id
        WHERE m.id=${context.membershipId}::uuid
          AND m.account_id=${context.accountId}::uuid
          AND m.tenant_id=${context.tenantId}::uuid
          AND m.state='active'
          AND m.valid_from<=CURRENT_TIMESTAMP
          AND (m.valid_until IS NULL OR m.valid_until>CURRENT_TIMESTAMP)
          AND a.person_id=${context.personId}::uuid
          AND a.state='active'
          AND ${MANAGE_INSTITUTIONAL_RECORDS}=ANY(a.capabilities)${locking}`.execute(trx);
      const row = result.rows[0];
      if (!row || Number(row.authorization_version) !== context.authorizationVersion || Number(row.authority_version) !== context.authorizationVersion) {
        throw new InstitutionalAccessDenied();
      }
      return work(trx);
    });
  }

  private async create<T>(context: TenantContext, operation: string, command: { idempotencyKey: string; requestId: string }, work: (trx: Tx) => Promise<T>): Promise<T> {
    return this.authorized(context, async trx => {
      const key = digest(command.idempotencyKey);
      const requestHash = digest(canonicalPayload(command));
      await sql`DELETE FROM ${table(context, 'institutional_idempotency')}
        WHERE account_id=${context.accountId}::uuid AND operation=${operation}
          AND idempotency_key_hash=${key} AND expires_at<=CURRENT_TIMESTAMP`.execute(trx);
      await sql`INSERT INTO ${table(context, 'institutional_idempotency')}
        (account_id,operation,idempotency_key_hash,request_hash,created_at,expires_at)
        VALUES(${context.accountId}::uuid,${operation},${key},${requestHash},CURRENT_TIMESTAMP,
          CURRENT_TIMESTAMP+(${this.idempotencyRetentionHours}*interval '1 hour')) ON CONFLICT DO NOTHING`.execute(trx);
      const saved = await sql<any>`SELECT request_hash,response_body FROM ${table(context, 'institutional_idempotency')}
        WHERE account_id=${context.accountId}::uuid AND operation=${operation} AND idempotency_key_hash=${key} FOR UPDATE`.execute(trx);
      if (saved.rows[0].request_hash !== requestHash) throw new InstitucionalConflict('A chave de idempotência já foi usada com outro conteúdo.');
      if (saved.rows[0].response_body) return saved.rows[0].response_body as T;
      const result = await work(trx);
      await sql`UPDATE ${table(context, 'institutional_idempotency')} SET response_status=201,response_body=${JSON.stringify(result)}::jsonb
        WHERE account_id=${context.accountId}::uuid AND operation=${operation} AND idempotency_key_hash=${key}`.execute(trx);
      return result;
    });
  }

  private audit(trx: Tx, context: TenantContext, requestId: string, eventType: string, targetKind: string, targetId: string, before: unknown, after: unknown, reason?: string) {
    return sql`INSERT INTO ${table(context, 'institutional_audit_event')}
      (id,request_id,actor_person_id,event_type,target_kind,target_id,before_value,after_value,reason,occurred_at)
      VALUES(${randomUUID()}::uuid,${requestId},${context.personId}::uuid,${eventType},${targetKind},${targetId}::uuid,
        ${before ? JSON.stringify(before) : null}::jsonb,${after ? JSON.stringify(after) : null}::jsonb,${reason ?? null},CURRENT_TIMESTAMP)`.execute(trx);
  }

  createPerson(context: TenantContext, command: CreatePersonCommand) {
    return this.create(context, 'person.create', command, async trx => {
      const id = randomUUID(), publicId = randomUUID();
      const inserted = await sql<any>`INSERT INTO ${table(context, 'person')}
        (id,public_id,full_name,email,email_normalized,state,version,created_at,updated_at,updated_by)
        VALUES(${id}::uuid,${publicId}::uuid,${command.fullName},${command.email ?? null},${command.email ?? null},'active',1,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,${context.personId}::uuid)
        ON CONFLICT (email_normalized) WHERE email_normalized IS NOT NULL DO NOTHING RETURNING *`.execute(trx);
      if (!inserted.rows[0]) {
        const found = await sql<any>`SELECT public_id,full_name,email,state,version FROM ${table(context, 'person')}
          WHERE email_normalized=${command.email ?? null} LIMIT 1`.execute(trx);
        throw new InstitucionalConflict('Há uma possível duplicidade neste Condomínio.', found.rows[0] ? { candidate: person(found.rows[0]) } : undefined);
      }
      const record = person(inserted.rows[0]);
      await this.audit(trx, context, command.requestId, 'person.created', 'person', id, null, record);
      return record;
    });
  }

  createUnit(context: TenantContext, command: CreateUnitCommand) {
    return this.create(context, 'unit.create', command, async trx => {
      const id = randomUUID(), publicId = randomUUID();
      try {
        const result = await sql<any>`INSERT INTO ${table(context, 'unit')}
          (id,public_id,identifier,identifier_normalized,created_at,created_by)
          VALUES(${id}::uuid,${publicId}::uuid,${command.identifier},${normalizeUnitIdentifier(command.identifier)},CURRENT_TIMESTAMP,${context.personId}::uuid) RETURNING *`.execute(trx);
        const record = unit(result.rows[0]);
        await this.audit(trx, context, command.requestId, 'unit.created', 'unit', id, null, record);
        return record;
      } catch (error: any) {
        if (error?.code === '23505') throw new InstitucionalConflict('Já existe uma Unidade com essa identificação neste Condomínio.');
        throw error;
      }
    });
  }

  createRelationship(context: TenantContext, command: CreateRelationshipCommand) {
    return this.create(context, 'relationship.create', command, async trx => {
      const refs = await sql<any>`SELECT p.id AS person_id,u.id AS unit_id
        FROM ${table(context, 'person')} p CROSS JOIN ${table(context, 'unit')} u
        WHERE p.public_id=${command.personPublicId}::uuid AND p.state='active'
          AND u.public_id=${command.unitPublicId}::uuid AND u.state='active'`.execute(trx);
      if (!refs.rows[0]) throw new InstitutionalNotFound();
      const id = randomUUID(), publicId = randomUUID();
      const result = await sql<any>`INSERT INTO ${table(context, 'person_unit_relationship')}
        (id,public_id,person_id,unit_id,relation_kind,starts_on,ends_on,created_at,created_by)
        VALUES(${id}::uuid,${publicId}::uuid,${refs.rows[0].person_id}::uuid,${refs.rows[0].unit_id}::uuid,
          ${command.relationKind},${command.startsOn}::date,${command.endsOn ?? null}::date,CURRENT_TIMESTAMP,${context.personId}::uuid)
        RETURNING *,${command.personPublicId} AS person_public_id,${command.unitPublicId} AS unit_public_id`.execute(trx);
      const record = relationship(result.rows[0]);
      await this.audit(trx, context, command.requestId, 'relationship.created', 'relationship', id, null, record);
      return record;
    });
  }

  private async current(trx: Tx, context: TenantContext, kind: 'person' | 'unit', publicId: string, lock = false) {
    const locking = lock ? sql` FOR UPDATE` : sql``;
    const result = await sql<any>`SELECT * FROM ${table(context, kind)} WHERE public_id=${publicId}::uuid${locking}`.execute(trx);
    if (!result.rows[0]) throw new InstitutionalNotFound();
    return result.rows[0];
  }

  private async currentRelationship(trx: Tx, context: TenantContext, publicId: string, lock = false) {
    const locking = lock ? sql` FOR UPDATE OF r` : sql``;
    const result = await sql<any>`SELECT r.*,p.public_id AS person_public_id,u.public_id AS unit_public_id
      FROM ${table(context, 'person_unit_relationship')} r
      JOIN ${table(context, 'person')} p ON p.id=r.person_id
      JOIN ${table(context, 'unit')} u ON u.id=r.unit_id
      WHERE r.public_id=${publicId}::uuid${locking}`.execute(trx);
    if (!result.rows[0]) throw new InstitutionalNotFound();
    return result.rows[0];
  }

  updatePerson(context: TenantContext, command: UpdatePersonCommand) {
    return this.authorized(context, async trx => {
      const before = await this.current(trx, context, 'person', command.publicId, true);
      if (Number(before.version) !== command.expectedVersion) throw new InstitucionalConflict('O registro mudou.', person(before));
      let changed;
      await sql`SAVEPOINT update_person_record`.execute(trx);
      try {
        changed = await sql<any>`UPDATE ${table(context, 'person')} SET full_name=${command.fullName},email=${command.email ?? null},
          email_normalized=${command.email ?? null},version=version+1,updated_at=CURRENT_TIMESTAMP,updated_by=${context.personId}::uuid
          WHERE public_id=${command.publicId}::uuid AND version=${command.expectedVersion} RETURNING *`.execute(trx);
        await sql`RELEASE SAVEPOINT update_person_record`.execute(trx);
      } catch (error: any) {
        await sql`ROLLBACK TO SAVEPOINT update_person_record`.execute(trx);
        if (error?.code === '23505') {
          const conflict = await sql<any>`SELECT * FROM ${table(context, 'person')} WHERE email_normalized=${command.email ?? null} AND id<>${before.id}::uuid LIMIT 1`.execute(trx);
          throw new InstitucionalConflict('Há uma possível duplicidade neste Condomínio.', conflict.rows[0] ? person(conflict.rows[0]) : undefined);
        }
        throw error;
      }
      const record = person(changed.rows[0]);
      await this.audit(trx, context, command.requestId, 'person.updated', 'person', before.id, person(before), record, command.reason);
      return record;
    });
  }

  updateUnit(context: TenantContext, command: UpdateUnitCommand) {
    return this.authorized(context, async trx => {
      const before = await this.current(trx, context, 'unit', command.publicId, true);
      if (Number(before.version) !== command.expectedVersion) throw new InstitucionalConflict('O registro mudou.', unit(before));
      let changed;
      await sql`SAVEPOINT update_unit_record`.execute(trx);
      try {
        changed = await sql<any>`UPDATE ${table(context, 'unit')} SET identifier=${command.identifier},
          identifier_normalized=${normalizeUnitIdentifier(command.identifier)},version=version+1,updated_at=CURRENT_TIMESTAMP,updated_by=${context.personId}::uuid
          WHERE public_id=${command.publicId}::uuid AND version=${command.expectedVersion} RETURNING *`.execute(trx);
        await sql`RELEASE SAVEPOINT update_unit_record`.execute(trx);
      } catch (error: any) {
        await sql`ROLLBACK TO SAVEPOINT update_unit_record`.execute(trx);
        if (error?.code === '23505') {
          const conflict = await sql<any>`SELECT * FROM ${table(context, 'unit')} WHERE identifier_normalized=${normalizeUnitIdentifier(command.identifier)} AND id<>${before.id}::uuid LIMIT 1`.execute(trx);
          throw new InstitucionalConflict('Já existe uma Unidade com essa identificação neste Condomínio.', conflict.rows[0] ? unit(conflict.rows[0]) : undefined);
        }
        throw error;
      }
      const record = unit(changed.rows[0]);
      await this.audit(trx, context, command.requestId, 'unit.updated', 'unit', before.id, unit(before), record, command.reason);
      return record;
    });
  }

  updateRelationship(context: TenantContext, command: UpdateRelationshipCommand) {
    return this.authorized(context, async trx => {
      const before = await this.currentRelationship(trx, context, command.publicId, true);
      if (Number(before.version) !== command.expectedVersion || before.state !== 'active') throw new InstitucionalConflict('O registro mudou.', relationship(before));
      const changed = await sql<any>`UPDATE ${table(context, 'person_unit_relationship')} r
        SET relation_kind=${command.relationKind},starts_on=${command.startsOn}::date,ends_on=${command.endsOn ?? null}::date,
          version=version+1,updated_at=CURRENT_TIMESTAMP,updated_by=${context.personId}::uuid
        WHERE r.public_id=${command.publicId}::uuid AND r.version=${command.expectedVersion}
        RETURNING r.*,(SELECT public_id FROM ${table(context, 'person')} WHERE id=r.person_id) AS person_public_id,
          (SELECT public_id FROM ${table(context, 'unit')} WHERE id=r.unit_id) AS unit_public_id`.execute(trx);
      const record = relationship(changed.rows[0]);
      await this.audit(trx, context, command.requestId, 'relationship.updated', 'relationship', before.id, relationship(before), record, command.reason);
      return record;
    });
  }

  endRelationship(context: TenantContext, command: EndRelationshipCommand) {
    return this.authorized(context, async trx => {
      const before = await this.currentRelationship(trx, context, command.publicId, true);
      if (Number(before.version) !== command.expectedVersion || before.state !== 'active') {
        throw new InstitucionalConflict('O registro mudou.', relationship(before));
      }
      if (civilDate(before.starts_on) >= command.effectiveOn) {
        throw new InstitutionalValidation('A data efetiva deve ser posterior ao início do Vínculo.');
      }
      const changed = await sql<any>`UPDATE ${table(context, 'person_unit_relationship')} r
        SET ends_on=${command.effectiveOn}::date,state='ended',version=version+1,updated_at=CURRENT_TIMESTAMP,updated_by=${context.personId}::uuid
        WHERE r.public_id=${command.publicId}::uuid AND r.version=${command.expectedVersion}
        RETURNING r.*,(SELECT public_id FROM ${table(context, 'person')} WHERE id=r.person_id) AS person_public_id,
          (SELECT public_id FROM ${table(context, 'unit')} WHERE id=r.unit_id) AS unit_public_id`.execute(trx);
      const authorities = await sql<any>`UPDATE ${table(context, 'authority_assignment')}
        SET state='ended',authorization_version=authorization_version+1
        WHERE source_relationship_id=${before.id}::uuid AND state IN ('pending_verification','active') RETURNING id,authorization_version`.execute(trx);
      for (const authority of authorities.rows) {
        await sql`UPDATE burgoweb_global.account_tenant_memberships
          SET state='ended',valid_until=LEAST(COALESCE(valid_until,CURRENT_TIMESTAMP),CURRENT_TIMESTAMP),authorization_version=${authority.authorization_version}
          WHERE tenant_id=${context.tenantId}::uuid AND authority_id=${authority.id}::uuid AND source_relationship_id=${before.id}::uuid`.execute(trx);
      }
      const record = relationship(changed.rows[0]);
      await this.audit(trx, context, command.requestId, 'relationship.ended', 'relationship', before.id, relationship(before), record, command.reason);
      return record;
    });
  }

  async linkAuthorizationSource(context: TenantContext, relationshipPublicId: string, authorityId: string, membershipId: string): Promise<void> {
    if (!SAFE_SCHEMA.test(context.schemaName)) throw new InstitutionalAccessDenied();
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const authorized = await client.query(
        `SELECT m.authorization_version,a.authorization_version AS authority_version
           FROM burgoweb_global.account_tenant_memberships m
           JOIN ${context.schemaName}.authority_assignment a ON a.id=m.authority_id
          WHERE m.id=$1 AND m.account_id=$2 AND m.tenant_id=$3 AND m.state='active'
            AND m.valid_from<=CURRENT_TIMESTAMP AND (m.valid_until IS NULL OR m.valid_until>CURRENT_TIMESTAMP)
            AND a.person_id=$4 AND a.state='active' AND $5=ANY(a.capabilities)
          FOR UPDATE OF m,a`,
        [context.membershipId, context.accountId, context.tenantId, context.personId, MANAGE_INSTITUTIONAL_RECORDS],
      );
      const row = authorized.rows[0];
      if (!row || Number(row.authorization_version) !== context.authorizationVersion || Number(row.authority_version) !== context.authorizationVersion) {
        throw new InstitutionalAccessDenied();
      }
      await linkAuthorizationSourceInTransaction(client, {
        schemaName: context.schemaName,
        tenantId: context.tenantId,
        relationshipPublicId,
        authorityId,
        membershipId,
      });
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async listPeople(context: TenantContext, cursor?: string): Promise<Page<PersonRecord>> {
    return this.authorized(context, async trx => {
      const result = await sql<any>`SELECT * FROM ${table(context, 'person')}
        WHERE (${cursor ?? null}::uuid IS NULL OR public_id>${cursor ?? null}::uuid) ORDER BY public_id LIMIT 51`.execute(trx);
      return { items: result.rows.slice(0, 50).map(person), nextCursor: result.rows[50]?.public_id };
    }, false);
  }
  async listUnits(context: TenantContext, cursor?: string): Promise<Page<UnitRecord>> {
    return this.authorized(context, async trx => {
      const result = await sql<any>`SELECT * FROM ${table(context, 'unit')}
        WHERE (${cursor ?? null}::uuid IS NULL OR public_id>${cursor ?? null}::uuid) ORDER BY public_id LIMIT 51`.execute(trx);
      return { items: result.rows.slice(0, 50).map(unit), nextCursor: result.rows[50]?.public_id };
    }, false);
  }
  async listRelationships(context: TenantContext, cursor?: string): Promise<Page<RelationshipRecord>> {
    return this.authorized(context, async trx => {
      const result = await sql<any>`SELECT r.*,p.public_id AS person_public_id,u.public_id AS unit_public_id
        FROM ${table(context, 'person_unit_relationship')} r JOIN ${table(context, 'person')} p ON p.id=r.person_id
        JOIN ${table(context, 'unit')} u ON u.id=r.unit_id
        WHERE (${cursor ?? null}::uuid IS NULL OR r.public_id>${cursor ?? null}::uuid) ORDER BY r.public_id LIMIT 51`.execute(trx);
      return { items: result.rows.slice(0, 50).map(relationship), nextCursor: result.rows[50]?.public_id };
    }, false);
  }
}
