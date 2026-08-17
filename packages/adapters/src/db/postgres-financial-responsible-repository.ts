import { createHash, randomUUID } from "node:crypto";
import type { Pool, PoolClient } from "pg";
import {
  AuthorizationDenied,
  FinancialResponsibleConflict,
  MANAGE_FINANCIAL_RESPONSIBLES_CAPABILITY,
  ROLE_CATALOG,
  type FinancialResponsibleDraft,
  type FinancialResponsibleRecord,
  type FinancialResponsibleRepository,
  type InstitutionalRole,
  type TenantContext,
} from "@burgoweb/application";

const SAFE_SCHEMA = /^tenant_[a-f0-9]{32}$/;
const hash = (value: string) =>
  createHash("sha256").update(value).digest("hex");
const canonical = (value: unknown): string => {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object")
    return `{${Object.entries(value as Record<string, unknown>)
      .filter(([key]) => !["requestId", "idempotencyKey"].includes(key))
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, item]) => `${JSON.stringify(key)}:${canonical(item)}`)
      .join(",")}}`;
  return JSON.stringify(value);
};
const map = (row: any): FinancialResponsibleRecord => ({
  publicId: row.public_id,
  personPublicId: row.person_public_id,
  unitPublicId: row.unit_public_id,
  relationshipPublicId: row.relationship_public_id,
  validFrom: new Date(row.valid_from),
  validUntil: row.valid_until ? new Date(row.valid_until) : null,
  state: row.state,
  grantedBy: { publicId: row.granted_by_public_id },
  version: Number(row.version),
});

export class PostgresFinancialResponsibleRepository
  implements FinancialResponsibleRepository
{
  constructor(private pool: Pool) {}
  private async tx<T>(work: (client: PoolClient) => Promise<T>) {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      const result = await work(client);
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
  private async authorize(client: PoolClient, context: TenantContext) {
    if (!SAFE_SCHEMA.test(context.schemaName)) throw new AuthorizationDenied();
    const result = await client.query(
      `SELECT assignment.role_kind
         FROM burgoweb_global.account_tenant_memberships m
         JOIN ${context.schemaName}.authority_assignment authority ON authority.id=m.authority_id
         JOIN ${context.schemaName}.role_assignment assignment ON assignment.person_id=m.person_id
        WHERE m.id=$1 AND m.account_id=$2 AND m.tenant_id=$3 AND m.person_id=$4
          AND m.state='active' AND m.authorization_version=$5
          AND authority.authorization_version=m.authorization_version
          AND assignment.state='active' AND assignment.valid_from<=CURRENT_TIMESTAMP
          AND (assignment.valid_until IS NULL OR assignment.valid_until>CURRENT_TIMESTAMP)
        FOR UPDATE OF m,authority,assignment`,
      [
        context.membershipId,
        context.accountId,
        context.tenantId,
        context.personId,
        context.authorizationVersion,
      ],
    );
    const authorized = result.rows.some((row) =>
      (ROLE_CATALOG[row.role_kind as InstitutionalRole] as readonly string[]).includes(
        MANAGE_FINANCIAL_RESPONSIBLES_CAPABILITY,
      ),
    );
    if (authorized) return;
    const delegated = await client.query(
      `SELECT 1 FROM ${context.schemaName}.capability_grant grant_row
         JOIN ${context.schemaName}.role_assignment source ON source.person_id=grant_row.person_id
          AND source.role_kind='administrative-assistant' AND source.state='active'
          AND source.valid_from<=CURRENT_TIMESTAMP AND (source.valid_until IS NULL OR source.valid_until>CURRENT_TIMESTAMP)
        WHERE grant_row.person_id=$1 AND grant_row.capability_id=$2 AND grant_row.state='active'
          AND grant_row.valid_from<=CURRENT_TIMESTAMP AND (grant_row.valid_until IS NULL OR grant_row.valid_until>CURRENT_TIMESTAMP)
        FOR UPDATE OF grant_row`,
      [context.personId, MANAGE_FINANCIAL_RESPONSIBLES_CAPABILITY],
    );
    if (!delegated.rowCount) throw new AuthorizationDenied();
  }
  private select = `SELECT assignment.*,person.public_id person_public_id,unit.public_id unit_public_id,relationship.public_id relationship_public_id,actor.public_id granted_by_public_id FROM financial_responsible_assignment assignment JOIN person ON person.id=assignment.person_id JOIN unit ON unit.id=assignment.unit_id JOIN person_unit_relationship relationship ON relationship.id=assignment.source_relationship_id JOIN person actor ON actor.id=assignment.granted_by_person_id`;
  async list(
    context: TenantContext,
    cursor?: string,
    options?: { selfOnly?: boolean },
  ) {
    return this.tx(async (client) => {
      if (options?.selfOnly) {
        if (!SAFE_SCHEMA.test(context.schemaName))
          throw new AuthorizationDenied();
      } else {
        await this.authorize(client, context);
      }
      await client.query(
        `SET LOCAL search_path TO ${context.schemaName},pg_catalog`,
      );
      const rows = await client.query(
        `${this.select} WHERE ($1::uuid IS NULL OR assignment.public_id>$1)${
          options?.selfOnly ? " AND assignment.person_id=$2" : ""
        } ORDER BY assignment.public_id LIMIT 51`,
        options?.selfOnly
          ? [cursor ?? null, context.personId]
          : [cursor ?? null],
      );
      return {
        items: rows.rows.slice(0, 50).map(map),
        nextCursor: rows.rows[50]?.public_id,
      };
    });
  }
  async assign(
    context: TenantContext,
    input: FinancialResponsibleDraft & {
      confirmed: true;
      idempotencyKey: string;
      requestId: string;
    },
  ) {
    return this.tx(async (client) => {
      await this.authorize(client, context);
      await client.query(
        `SET LOCAL search_path TO ${context.schemaName},pg_catalog`,
      );
      const requestHash = hash(canonical(input)),
        keyHash = hash(input.idempotencyKey),
        now = (await client.query("SELECT CURRENT_TIMESTAMP now")).rows[0]
          .now;
      const claimed = await client.query(
        `INSERT INTO role_command_idempotency(actor_person_id,operation,key_hash,request_hash,expires_at) VALUES($1,'financial-responsible-assign',$2,$3,$4::timestamptz+interval '24 hours') ON CONFLICT DO NOTHING RETURNING key_hash`,
        [context.personId, keyHash, requestHash, now],
      );
      if (!claimed.rowCount) {
        const prior = await client.query(
          `SELECT request_hash,response_body FROM role_command_idempotency WHERE actor_person_id=$1 AND operation='financial-responsible-assign' AND key_hash=$2 FOR UPDATE`,
          [context.personId, keyHash],
        );
        if (
          prior.rows[0]?.request_hash !== requestHash ||
          !prior.rows[0]?.response_body
        )
          throw new FinancialResponsibleConflict(undefined);
        return map(prior.rows[0].response_body);
      }
      const person = await client.query(
        `SELECT id FROM person WHERE public_id=$1 AND state='active' FOR UPDATE`,
        [input.personPublicId],
      );
      if (!person.rowCount) throw new AuthorizationDenied();
      const unit = await client.query(
        `SELECT id FROM unit WHERE public_id=$1 AND state='active' FOR UPDATE`,
        [input.unitPublicId],
      );
      if (!unit.rowCount) throw new AuthorizationDenied();
      const relationship = await client.query(
        `SELECT id,public_id FROM person_unit_relationship
          WHERE person_id=$1 AND unit_id=$2 AND state='active'
            AND starts_on<=CURRENT_DATE AND (ends_on IS NULL OR ends_on>CURRENT_DATE)
          ORDER BY starts_on DESC LIMIT 1 FOR UPDATE`,
        [person.rows[0].id, unit.rows[0].id],
      );
      if (!relationship.rowCount) throw new AuthorizationDenied();
      const id = randomUUID(),
        publicId = randomUUID(),
        validFrom = new Date(input.validFrom),
        validUntil = input.validUntil ? new Date(input.validUntil) : null,
        state =
          validFrom <= new Date(now) &&
          (validUntil === null || validUntil > new Date(now))
            ? "active"
            : "scheduled";
      let created;
      try {
        created = await client.query(
          `INSERT INTO financial_responsible_assignment(id,public_id,person_id,unit_id,source_relationship_id,valid_from,valid_until,state,granted_by_person_id,created_at,updated_at) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$10) RETURNING *`,
          [
            id,
            publicId,
            person.rows[0].id,
            unit.rows[0].id,
            relationship.rows[0].id,
            validFrom,
            validUntil,
            state,
            context.personId,
            now,
          ],
        );
      } catch (error) {
        if ((error as { code?: string }).code === "23505")
          throw new FinancialResponsibleConflict(undefined);
        throw error;
      }
      const row = {
        ...created.rows[0],
        person_public_id: input.personPublicId,
        unit_public_id: input.unitPublicId,
        relationship_public_id: relationship.rows[0].public_id,
        granted_by_public_id: context.personId,
      };
      await this.effects(
        client,
        id,
        publicId,
        null,
        state,
        1,
        input.requestId,
        context.personId,
        now,
      );
      await client.query(
        `UPDATE role_command_idempotency SET response_body=$4 WHERE actor_person_id=$1 AND operation='financial-responsible-assign' AND key_hash=$2 AND request_hash=$3`,
        [context.personId, keyHash, requestHash, JSON.stringify(row)],
      );
      return map(row);
    });
  }
  private async effects(
    client: PoolClient,
    id: string,
    publicId: string,
    fromState: string | null,
    state: string,
    version: number,
    requestId: string,
    actor: string,
    now: Date,
  ) {
    await client.query(
      `INSERT INTO financial_responsible_transition(id,assignment_id,from_state,to_state,actor_person_id,occurred_at,request_id) VALUES($1,$2,$3,$4,$5,$6,$7)`,
      [randomUUID(), id, fromState, state, actor, now, requestId],
    );
    await client.query(
      `INSERT INTO financial_responsible_projection(assignment_id,public_id,unit_id,state,valid_from,valid_until,version) SELECT id,public_id,unit_id,state,valid_from,valid_until,version FROM financial_responsible_assignment WHERE id=$1 ON CONFLICT(assignment_id) DO UPDATE SET state=excluded.state,version=excluded.version,projected_at=$2`,
      [id, now],
    );
    await client.query(
      `INSERT INTO institutional_audit_event(id,request_id,actor_person_id,event_type,target_kind,target_id,after_value,occurred_at) VALUES($1,$2,$3,$4,'financial-responsible-assignment',$5,$6,$7)`,
      [
        randomUUID(),
        requestId,
        actor,
        `financial-responsible.${state}`,
        id,
        JSON.stringify({ publicId, state, version }),
        now,
      ],
    );
    await client.query(
      `INSERT INTO financial_responsible_notification_outbox(id,assignment_id,transition,payload,available_at,created_at,updated_at) VALUES($1,$2,$3,$4,$5,$5,$5)`,
      [
        randomUUID(),
        id,
        state,
        JSON.stringify({ assignmentPublicId: publicId, state }),
        now,
      ],
    );
  }
  async remove(
    context: TenantContext,
    input: {
      publicId: string;
      expectedVersion: number;
      confirmed: true;
      requestId: string;
    },
  ) {
    return this.tx(async (client) => {
      await this.authorize(client, context);
      await client.query(
        `SET LOCAL search_path TO ${context.schemaName},pg_catalog`,
      );
      const found = await client.query(
        `${this.select} WHERE assignment.public_id=$1 FOR UPDATE OF assignment`,
        [input.publicId],
      );
      const row = found.rows[0];
      if (!row) throw new AuthorizationDenied();
      if (Number(row.version) !== input.expectedVersion)
        throw new FinancialResponsibleConflict(map(row));
      if (row.state !== "scheduled" && row.state !== "active")
        throw new FinancialResponsibleConflict(map(row));
      const now = (await client.query("SELECT CURRENT_TIMESTAMP now")).rows[0]
        .now;
      const updated = await client.query(
        `UPDATE financial_responsible_assignment SET state='revoked',version=version+1,updated_at=$3 WHERE id=$1 AND version=$2 RETURNING *`,
        [row.id, input.expectedVersion, now],
      );
      if (!updated.rowCount) throw new FinancialResponsibleConflict(map(row));
      await this.effects(
        client,
        row.id,
        row.public_id,
        row.state,
        "revoked",
        input.expectedVersion + 1,
        input.requestId,
        context.personId,
        now,
      );
      return map({ ...row, ...updated.rows[0] });
    });
  }
  async materialize(now = new Date()) {
    const tenants = await this.pool.query(
      `SELECT id,schema_name FROM burgoweb_global.tenant_registry WHERE state='active' AND schema_name~'^tenant_[a-f0-9]{32}$'`,
    );
    let count = 0;
    for (const tenant of tenants.rows) {
      try {
        count += await this.tx(async (client) => {
          await client.query(
            `SET LOCAL search_path TO ${tenant.schema_name},pg_catalog`,
          );
          const candidates = await client.query(
            `SELECT assignment.id,assignment.public_id,assignment.state,assignment.version,assignment.valid_until,assignment.granted_by_person_id,
               (relationship.state='ended' OR (relationship.ends_on IS NOT NULL AND relationship.ends_on<=CURRENT_DATE)) relationship_ended
             FROM financial_responsible_assignment assignment
             JOIN person_unit_relationship relationship ON relationship.id=assignment.source_relationship_id
             WHERE (assignment.state='scheduled' AND assignment.valid_from<=$1 AND (assignment.valid_until IS NULL OR assignment.valid_until>$1))
                OR (assignment.state IN('scheduled','active') AND assignment.valid_until IS NOT NULL AND assignment.valid_until<=$1)
                OR (assignment.state IN('scheduled','active') AND (relationship.state='ended' OR (relationship.ends_on IS NOT NULL AND relationship.ends_on<=CURRENT_DATE)))
             FOR UPDATE OF assignment`,
            [now],
          );
          let tenantCount = 0;
          for (const row of candidates.rows) {
            // Encerrar o Vínculo de origem invalida a atribuição imediatamente (AC10),
            // com prioridade sobre a simples expiração por vigência.
            const state = row.relationship_ended
              ? "revoked"
              : row.valid_until && new Date(row.valid_until) <= now
                ? "expired"
                : row.state === "scheduled"
                  ? "active"
                  : row.state;
            if (state === row.state) continue;
            const changed = await client.query(
              `UPDATE financial_responsible_assignment SET state=$2,version=version+1,updated_at=$3 WHERE id=$1 AND version=$4 RETURNING version`,
              [row.id, state, now, row.version],
            );
            if (!changed.rowCount) continue;
            await this.effects(
              client,
              row.id,
              row.public_id,
              row.state,
              state,
              Number(changed.rows[0].version),
              `financial-responsible-materializer:${row.public_id}:${state}:${now.toISOString()}`,
              row.granted_by_person_id,
              now,
            );
            tenantCount++;
          }
          return tenantCount;
        });
      } catch {
        continue;
      }
    }
    return count;
  }
}
