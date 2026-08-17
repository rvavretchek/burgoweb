import { createHash, randomUUID } from "node:crypto";
import type { Pool, PoolClient } from "pg";
import {
  AuthorizationDenied,
  CapabilityConflict,
  GRANT_CAPABILITY_CAPABILITY,
  type CapabilityDraft,
  type CapabilityGrantRecord,
  type CapabilityGrantRepository,
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
const map = (row: any): CapabilityGrantRecord => ({
  publicId: row.public_id,
  personPublicId: row.person_public_id,
  capabilityId: row.capability_id,
  validFrom: new Date(row.valid_from),
  validUntil: row.valid_until ? new Date(row.valid_until) : null,
  state: row.state,
  grantedBy: { publicId: row.granted_by_public_id },
  version: Number(row.version),
});

export class PostgresCapabilityGrantRepository
  implements CapabilityGrantRepository
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
      `SELECT 1
         FROM burgoweb_global.account_tenant_memberships m
         JOIN ${context.schemaName}.authority_assignment authority ON authority.id=m.authority_id
         JOIN ${context.schemaName}.role_assignment assignment ON assignment.person_id=m.person_id
        WHERE m.id=$1 AND m.account_id=$2 AND m.tenant_id=$3 AND m.person_id=$4
          AND m.state='active' AND m.authorization_version=$5
          AND authority.authorization_version=m.authorization_version
          AND assignment.state='active' AND assignment.valid_from<=CURRENT_TIMESTAMP
          AND (assignment.valid_until IS NULL OR assignment.valid_until>CURRENT_TIMESTAMP)
          AND assignment.role_kind='syndic'
        FOR UPDATE OF m,authority,assignment`,
      [
        context.membershipId,
        context.accountId,
        context.tenantId,
        context.personId,
        context.authorizationVersion,
      ],
    );
    if (!result.rowCount) throw new AuthorizationDenied();
  }
  private select = `SELECT grant_row.*,person.public_id person_public_id,actor.public_id granted_by_public_id FROM capability_grant grant_row JOIN person ON person.id=grant_row.person_id JOIN person actor ON actor.id=grant_row.granted_by_person_id`;
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
        `${this.select} WHERE ($1::uuid IS NULL OR grant_row.public_id>$1)${
          options?.selfOnly ? " AND grant_row.person_id=$2" : ""
        } ORDER BY grant_row.public_id LIMIT 51`,
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
  async grant(
    context: TenantContext,
    input: CapabilityDraft & {
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
        `INSERT INTO role_command_idempotency(actor_person_id,operation,key_hash,request_hash,expires_at) VALUES($1,'capability-grant',$2,$3,$4::timestamptz+interval '24 hours') ON CONFLICT DO NOTHING RETURNING key_hash`,
        [context.personId, keyHash, requestHash, now],
      );
      if (!claimed.rowCount) {
        const prior = await client.query(
          `SELECT request_hash,response_body FROM role_command_idempotency WHERE actor_person_id=$1 AND operation='capability-grant' AND key_hash=$2 FOR UPDATE`,
          [context.personId, keyHash],
        );
        if (
          prior.rows[0]?.request_hash !== requestHash ||
          !prior.rows[0]?.response_body
        )
          throw new CapabilityConflict(undefined);
        return map(prior.rows[0].response_body);
      }
      const person = await client.query(
        `SELECT id FROM person WHERE public_id=$1 AND state='active' FOR UPDATE`,
        [input.personPublicId],
      );
      if (!person.rowCount)
        throw new AuthorizationDenied();
      const eligible = await client.query(
        `SELECT 1 FROM role_assignment WHERE person_id=$1 AND role_kind='administrative-assistant' AND state='active' AND valid_from<=$2 AND (valid_until IS NULL OR valid_until>$2)`,
        [person.rows[0].id, now],
      );
      if (!eligible.rowCount) throw new AuthorizationDenied();
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
          `INSERT INTO capability_grant(id,public_id,person_id,capability_id,valid_from,valid_until,state,granted_by_person_id,created_at,updated_at) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$9) RETURNING *`,
          [
            id,
            publicId,
            person.rows[0].id,
            input.capabilityId,
            validFrom,
            validUntil,
            state,
            context.personId,
            now,
          ],
        );
      } catch (error) {
        if ((error as { code?: string }).code === "23505")
          throw new CapabilityConflict(undefined);
        throw error;
      }
      const row = {
        ...created.rows[0],
        person_public_id: input.personPublicId,
        granted_by_public_id: context.personId,
      };
      await this.effects(
        client,
        id,
        publicId,
        input.capabilityId,
        null,
        state,
        1,
        input.requestId,
        context.personId,
        now,
      );
      await client.query(
        `UPDATE role_command_idempotency SET response_body=$4 WHERE actor_person_id=$1 AND operation='capability-grant' AND key_hash=$2 AND request_hash=$3`,
        [context.personId, keyHash, requestHash, JSON.stringify(row)],
      );
      return map(row);
    });
  }
  private async effects(
    client: PoolClient,
    id: string,
    publicId: string,
    capabilityId: string,
    fromState: string | null,
    state: string,
    version: number,
    requestId: string,
    actor: string,
    now: Date,
  ) {
    await client.query(
      `INSERT INTO capability_grant_transition(id,grant_id,from_state,to_state,actor_person_id,occurred_at,request_id) VALUES($1,$2,$3,$4,$5,$6,$7)`,
      [randomUUID(), id, fromState, state, actor, now, requestId],
    );
    await client.query(
      `INSERT INTO capability_grant_projection(grant_id,public_id,state,capability_id,valid_from,valid_until,version) SELECT id,public_id,state,capability_id,valid_from,valid_until,version FROM capability_grant WHERE id=$1 ON CONFLICT(grant_id) DO UPDATE SET state=excluded.state,version=excluded.version,projected_at=$2`,
      [id, now],
    );
    await client.query(
      `INSERT INTO institutional_audit_event(id,request_id,actor_person_id,event_type,target_kind,target_id,after_value,occurred_at) VALUES($1,$2,$3,$4,'capability-grant',$5,$6,$7)`,
      [
        randomUUID(),
        requestId,
        actor,
        `capability.grant.${state}`,
        id,
        JSON.stringify({ publicId, capabilityId, state, version }),
        now,
      ],
    );
    await client.query(
      `INSERT INTO capability_notification_outbox(id,grant_id,transition,payload,available_at,created_at,updated_at) VALUES($1,$2,$3,$4,$5,$5,$5)`,
      [
        randomUUID(),
        id,
        state,
        JSON.stringify({ grantPublicId: publicId, state }),
        now,
      ],
    );
  }
  async revoke(
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
        `${this.select} WHERE grant_row.public_id=$1 FOR UPDATE OF grant_row`,
        [input.publicId],
      );
      const row = found.rows[0];
      if (!row) throw new AuthorizationDenied();
      if (Number(row.version) !== input.expectedVersion)
        throw new CapabilityConflict(map(row));
      if (row.state !== "scheduled" && row.state !== "active")
        throw new CapabilityConflict(map(row));
      const now = (await client.query("SELECT CURRENT_TIMESTAMP now")).rows[0]
        .now;
      const updated = await client.query(
        `UPDATE capability_grant SET state='revoked',version=version+1,updated_at=$3 WHERE id=$1 AND version=$2 RETURNING *`,
        [row.id, input.expectedVersion, now],
      );
      if (!updated.rowCount) throw new CapabilityConflict(map(row));
      await this.effects(
        client,
        row.id,
        row.public_id,
        row.capability_id,
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
            `SELECT id,public_id,capability_id,state,version,valid_until,granted_by_person_id FROM capability_grant WHERE (state='scheduled' AND valid_from<=$1 AND (valid_until IS NULL OR valid_until>$1)) OR (state IN('scheduled','active') AND valid_until IS NOT NULL AND valid_until<=$1) FOR UPDATE`,
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
              `UPDATE capability_grant SET state=$2,version=version+1,updated_at=$3 WHERE id=$1 AND version=$4 RETURNING version`,
              [row.id, state, now, row.version],
            );
            if (!changed.rowCount) continue;
            await this.effects(
              client,
              row.id,
              row.public_id,
              row.capability_id,
              row.state,
              state,
              Number(changed.rows[0].version),
              `capability-materializer:${row.public_id}:${state}:${now.toISOString()}`,
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
