import { createHash, randomUUID } from "node:crypto";
import type { Pool, PoolClient } from "pg";
import {
  AuthorizationDenied,
  ROLE_CATALOG,
  RoleConflict,
  RoleValidation,
  transitionRoleAssignment,
  type RoleAssignmentRecord,
  type RoleAssignmentRepository,
  type RoleDraft,
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
const map = (row: any): RoleAssignmentRecord => ({
  publicId: row.public_id,
  personPublicId: row.person_public_id,
  relationshipPublicId: row.relationship_public_id ?? null,
  role: row.role_kind,
  scope:
    row.scope_kind === "unit"
      ? { type: "unit", unitPublicId: row.unit_public_id }
      : { type: "tenant" },
  validFrom: new Date(row.valid_from),
  validUntil: row.valid_until ? new Date(row.valid_until) : null,
  state: row.state,
  grantedBy: { publicId: row.granted_by_public_id },
  version: Number(row.version),
  effectiveCapabilities:
    row.state === "active"
      ? [...ROLE_CATALOG[row.role_kind as keyof typeof ROLE_CATALOG]]
      : [],
});

export class PostgresRoleAssignmentRepository implements RoleAssignmentRepository {
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
  private async authorize(
    client: PoolClient,
    context: TenantContext,
    capability: string,
    targetScope: { type: "tenant" } | { type: "unit"; unitId: string } = {
      type: "tenant",
    },
  ) {
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
          AND (assignment.scope_kind='tenant' OR assignment.scope_unit_id=$6)
        FOR UPDATE OF m,authority,assignment`,
      [
        context.membershipId,
        context.accountId,
        context.tenantId,
        context.personId,
        context.authorizationVersion,
        targetScope.type === "unit" ? targetScope.unitId : null,
      ],
    );
    const authorized = result.rows.some((row) =>
      (ROLE_CATALOG[row.role_kind as keyof typeof ROLE_CATALOG] as readonly string[]).includes(capability),
    );
    if (authorized) return;
    // Nem toda capacidade é institucional (ROLE_CATALOG): a partir da Story 1.9, capacidades como
    // roles.suspend podem vir de uma delegação explícita (capability_grant) ao Auxiliar.
    const delegated = await client.query(
      `SELECT 1 FROM ${context.schemaName}.capability_grant grant_row
         JOIN ${context.schemaName}.role_assignment source ON source.person_id=grant_row.person_id
          AND source.role_kind='administrative-assistant' AND source.state='active'
          AND source.valid_from<=CURRENT_TIMESTAMP AND (source.valid_until IS NULL OR source.valid_until>CURRENT_TIMESTAMP)
        WHERE grant_row.person_id=$1 AND grant_row.capability_id=$2 AND grant_row.state='active'
          AND grant_row.valid_from<=CURRENT_TIMESTAMP AND (grant_row.valid_until IS NULL OR grant_row.valid_until>CURRENT_TIMESTAMP)
        FOR UPDATE OF grant_row`,
      [context.personId, capability],
    );
    if (!delegated.rowCount) throw new AuthorizationDenied();
  }
  private select = `SELECT assignment.*,person.public_id person_public_id,relationship.public_id relationship_public_id,unit.public_id unit_public_id,actor.public_id granted_by_public_id FROM role_assignment assignment JOIN person ON person.id=assignment.person_id JOIN person actor ON actor.id=assignment.granted_by_person_id LEFT JOIN person_unit_relationship relationship ON relationship.id=assignment.source_relationship_id LEFT JOIN unit ON unit.id=assignment.scope_unit_id`;
  async list(context: TenantContext, cursor?: string) {
    return this.tx(async (client) => {
      await this.authorize(client, context, "roles.read");
      const result = await client.query(
        `SET LOCAL search_path TO ${context.schemaName},pg_catalog`,
      );
      void result;
      const viewer = await client.query(
        `SELECT public_id FROM person WHERE id=$1`,
        [context.personId],
      );
      const rows = await client.query(
        `${this.select} WHERE ($1::uuid IS NULL OR assignment.public_id>$1) ORDER BY assignment.public_id LIMIT 51`,
        [cursor ?? null],
      );
      return {
        items: rows.rows.slice(0, 50).map(map),
        nextCursor: rows.rows[50]?.public_id,
        viewerPersonPublicId: viewer.rows[0]?.public_id,
        viewerCapabilities: context.capabilities,
      };
    });
  }
  async preview(context: TenantContext, draft: RoleDraft) {
    return this.tx(async (client) => {
      await this.authorize(client, context, "roles.preview");
      await client.query(
        `SET LOCAL search_path TO ${context.schemaName},pg_catalog`,
      );
      const target = await client.query(
        `SELECT person.public_id,relationship.public_id relationship_public_id FROM person LEFT JOIN person_unit_relationship relationship ON relationship.person_id=person.id AND relationship.public_id=$2 AND relationship.state='active' WHERE person.public_id=$1 AND person.state='active'`,
        [draft.personPublicId, draft.relationshipPublicId ?? null],
      );
      if (
        !target.rowCount ||
        (draft.role === "resident" && !target.rows[0].relationship_public_id)
      )
        throw new RoleValidation("Vínculo incompatível.");
      return {
        person: { publicId: draft.personPublicId },
        relationship: draft.relationshipPublicId
          ? { publicId: draft.relationshipPublicId }
          : null,
        role: draft.role,
        scope: draft.scope,
        validFrom: draft.validFrom,
        validUntil: draft.validUntil ?? null,
        timeZone: draft.timeZone,
        accessEffects: {
          institutionalRole: true,
          delegatedCapability: false,
          financialResponsible: false,
          continuityContact: false,
        },
        capabilities: ROLE_CATALOG[draft.role],
      };
    });
  }
  async grant(
    context: TenantContext,
    input: RoleDraft & {
      confirmed: true;
      idempotencyKey: string;
      requestId: string;
    },
  ) {
    return this.tx(async (client) => {
      await this.authorize(client, context, "roles.grant");
      await client.query(
        `SET LOCAL search_path TO ${context.schemaName},pg_catalog`,
      );
      const requestHash = hash(canonical(input)),
        keyHash = hash(input.idempotencyKey),
        now = (await client.query("SELECT CURRENT_TIMESTAMP now")).rows[0].now;
      const claimed = await client.query(
        `INSERT INTO role_command_idempotency(actor_person_id,operation,key_hash,request_hash,expires_at) VALUES($1,'grant',$2,$3,$4::timestamptz+interval '24 hours') ON CONFLICT DO NOTHING RETURNING key_hash`,
        [context.personId, keyHash, requestHash, now],
      );
      if (!claimed.rowCount) {
        const prior = await client.query(
          `SELECT request_hash,response_body FROM role_command_idempotency WHERE actor_person_id=$1 AND operation='grant' AND key_hash=$2 FOR UPDATE`,
          [context.personId, keyHash],
        );
        if (
          prior.rows[0]?.request_hash !== requestHash ||
          !prior.rows[0]?.response_body
        )
          throw new RoleConflict(undefined);
        return map(prior.rows[0].response_body);
      }
      const person = await client.query(
        `SELECT id FROM person WHERE public_id=$1 AND state='active' FOR UPDATE`,
        [input.personPublicId],
      );
      if (!person.rowCount) throw new RoleValidation("Pessoa incompatível.");
      const relationship = input.relationshipPublicId
        ? await client.query(
            `SELECT id FROM person_unit_relationship WHERE public_id=$1 AND person_id=$2 AND state='active' AND starts_on<=CURRENT_DATE AND (ends_on IS NULL OR ends_on>CURRENT_DATE) FOR UPDATE`,
            [input.relationshipPublicId, person.rows[0].id],
          )
        : undefined;
      if (input.role === "resident" && !relationship?.rowCount)
        throw new RoleValidation("Vínculo incompatível.");
      const unit =
        input.scope.type === "unit"
          ? await client.query(
              `SELECT id FROM unit WHERE public_id=$1 AND state='active' FOR UPDATE`,
              [input.scope.unitPublicId],
            )
          : undefined;
      if (input.scope.type === "unit" && !unit?.rowCount)
        throw new RoleValidation("Unidade incompatível.");
      const target = {
        person_id: person.rows[0].id,
        relationship_id: relationship?.rows[0]?.id ?? null,
        unit_id: unit?.rows[0]?.id ?? null,
      };
      const id = randomUUID(),
        publicId = randomUUID(),
        validFrom = new Date(input.validFrom),
        validUntil = input.validUntil ? new Date(input.validUntil) : null,
        state =
          validFrom <= new Date(now) &&
          (validUntil === null || validUntil > new Date(now))
            ? "active"
            : "scheduled";
      const created = await client.query(
        `INSERT INTO role_assignment(id,public_id,person_id,source_relationship_id,role_kind,scope_kind,scope_unit_id,valid_from,valid_until,state,granted_by_person_id,created_at,updated_at) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$12) RETURNING *`,
        [
          id,
          publicId,
          target.person_id,
          target.relationship_id,
          input.role,
          input.scope.type,
          target.unit_id,
          validFrom,
          validUntil,
          state,
          context.personId,
          now,
        ],
      );
      const row = {
        ...created.rows[0],
        person_public_id: input.personPublicId,
        relationship_public_id: input.relationshipPublicId,
        unit_public_id:
          input.scope.type === "unit" ? input.scope.unitPublicId : null,
        granted_by_public_id: context.personId,
      };
      await this.effects(
        client,
        context.tenantId,
        id,
        publicId,
        input.role,
        null,
        state,
        1,
        input.requestId,
        context.personId,
        null,
        now,
      );
      await client.query(
        `UPDATE role_command_idempotency SET response_body=$4 WHERE actor_person_id=$1 AND operation='grant' AND key_hash=$2 AND request_hash=$3`,
        [context.personId, keyHash, requestHash, JSON.stringify(row)],
      );
      return map(row);
    });
  }
  private async effects(
    client: PoolClient,
    tenantId: string,
    id: string,
    publicId: string,
    role: string,
    fromState: string | null,
    state: string,
    version: number,
    requestId: string,
    actor: string,
    reason: string | null,
    now: Date,
  ) {
    await client.query(
      `INSERT INTO role_assignment_transition(id,assignment_id,from_state,to_state,actor_person_id,restricted_reason,occurred_at,request_id) VALUES($1,$2,$3,$4,$5,$6,$7,$8)`,
      [randomUUID(), id, fromState, state, actor, reason, now, requestId],
    );
    await client.query(
      `INSERT INTO role_authorization_projection(assignment_id,public_id,state,role_kind,scope_kind,valid_from,valid_until,version) SELECT id,public_id,state,role_kind,scope_kind,valid_from,valid_until,version FROM role_assignment WHERE id=$1 ON CONFLICT(assignment_id) DO UPDATE SET state=excluded.state,version=excluded.version,projected_at=$2`,
      [id, now],
    );
    await client.query(
      `INSERT INTO institutional_audit_event(id,request_id,actor_person_id,event_type,target_kind,target_id,after_value,reason,occurred_at) VALUES($1,$2,$3,$4,'role-assignment',$5,$6,$7,$8)`,
      [
        randomUUID(),
        requestId,
        actor,
        `role.assignment.${state}`,
        id,
        JSON.stringify({ publicId, role, state, version }),
        reason,
        now,
      ],
    );
    await client.query(
      `INSERT INTO role_notification_outbox(id,assignment_id,transition,payload,available_at,created_at,updated_at) VALUES($1,$2,$3,$4,$5,$5,$5)`,
      [
        randomUUID(),
        id,
        state,
        JSON.stringify({ assignmentPublicId: publicId, state }),
        now,
      ],
    );
    await client.query(
      `UPDATE authority_assignment authority SET authorization_version=authority.authorization_version+1 FROM burgoweb_global.account_tenant_memberships membership WHERE membership.authority_id=authority.id AND membership.tenant_id=$1 AND membership.person_id=(SELECT person_id FROM role_assignment WHERE id=$2)`,
      [tenantId, id],
    );
    await client.query(
      `UPDATE burgoweb_global.account_tenant_memberships membership SET authorization_version=authority.authorization_version FROM authority_assignment authority WHERE membership.authority_id=authority.id AND membership.tenant_id=$1 AND membership.person_id=(SELECT person_id FROM role_assignment WHERE id=$2)`,
      [tenantId, id],
    );
  }
  async transition(
    context: TenantContext,
    input: {
      publicId: string;
      transition: "suspend" | "restore" | "revoke";
      expectedVersion: number;
      reason?: string;
      confirmed?: boolean;
      requestId: string;
    },
  ) {
    return this.tx(async (client) => {
      await client.query(
        `SET LOCAL search_path TO ${context.schemaName},pg_catalog`,
      );
      const found = await client.query(
        `${this.select} WHERE assignment.public_id=$1 FOR UPDATE OF assignment`,
        [input.publicId],
      );
      const row = found.rows[0];
      if (!row) throw new AuthorizationDenied();
      await this.authorize(
        client,
        context,
        `roles.${input.transition}`,
        row.scope_kind === "unit"
          ? { type: "unit" as const, unitId: row.scope_unit_id as string }
          : { type: "tenant" as const },
      );
      if (Number(row.version) !== input.expectedVersion)
        throw new RoleConflict(map(row));
      if (
        (row.person_id === context.personId &&
          input.transition !== "restore") ||
        row.role_kind === "syndic"
      )
        throw new AuthorizationDenied();
      const state = transitionRoleAssignment(row.state, input.transition),
        now = (await client.query("SELECT CURRENT_TIMESTAMP now")).rows[0].now;
      const updated = await client.query(
        `UPDATE role_assignment SET state=$2,restricted_reason=COALESCE($3,restricted_reason),version=version+1,updated_at=$4 WHERE id=$1 AND version=$5 RETURNING *`,
        [row.id, state, input.reason ?? null, now, input.expectedVersion],
      );
      if (!updated.rowCount) throw new RoleConflict(map(row));
      await this.effects(
        client,
        context.tenantId,
        row.id,
        row.public_id,
        row.role_kind,
        row.state,
        state,
        input.expectedVersion + 1,
        input.requestId,
        context.personId,
        input.reason ?? null,
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
            `SELECT id,public_id,role_kind,state,version,valid_until,granted_by_person_id FROM role_assignment WHERE (state='scheduled' AND valid_from<=$1 AND (valid_until IS NULL OR valid_until>$1)) OR (state IN('scheduled','active','suspended') AND valid_until IS NOT NULL AND valid_until<=$1) FOR UPDATE`,
            [now],
          );
          let tenantCount = 0;
          for (const row of candidates.rows) {
            const state =
              row.valid_until && new Date(row.valid_until) <= now
                ? "expired"
                : row.state === "scheduled"
                  ? "active"
                  : row.state;
            if (state === row.state) continue;
            const changed = await client.query(
              `UPDATE role_assignment SET state=$2,version=version+1,updated_at=$3 WHERE id=$1 AND version=$4 RETURNING version`,
              [row.id, state, now, row.version],
            );
            if (!changed.rowCount) continue;
            await this.effects(
              client,
              tenant.id,
              row.id,
              row.public_id,
              row.role_kind,
              row.state,
              state,
              Number(changed.rows[0].version),
              `role-materializer:${row.public_id}:${state}:${now.toISOString()}`,
              row.granted_by_person_id,
              null,
              now,
            );
            tenantCount++;
          }
          return tenantCount;
        });
      } catch {
        // A failure materializing one tenant must not block activation/expiration for the rest;
        // the next scheduled run retries this tenant.
        continue;
      }
    }
    return count;
  }
}
