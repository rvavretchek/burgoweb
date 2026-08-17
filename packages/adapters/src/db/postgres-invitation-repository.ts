import { createHash, randomUUID } from "node:crypto";
import type { Pool, PoolClient } from "pg";
import {
  InstitucionalConflict,
  InstitutionalAccessDenied,
  InstitutionalNotFound,
  ROLE_CATALOG,
  type InvitationDraft,
  type InvitationPreview,
  type InvitationRecord,
  type InvitationRepository,
  type InvitationRole,
  type InvitationTokenCodec,
  type PasswordHasher,
  type TenantContext,
} from "@burgoweb/application";
import { linkAuthorizationSourceInTransaction } from "./postgres-people-units-repository.js";

const SAFE_SCHEMA = /^tenant_[a-f0-9]{32}$/;
const digest = (value: string) =>
  createHash("sha256").update(value).digest("hex");
const canonical = (value: object) =>
  JSON.stringify(
    Object.fromEntries(
      Object.entries(value)
        .filter(
          ([key]) =>
            !["requestId", "idempotencyKey", "confirmed"].includes(key),
        )
        .sort(([a], [b]) => a.localeCompare(b)),
    ),
  );
const record = (row: any): InvitationRecord => ({
  publicId: row.public_id,
  email: row.recipient_email_normalized,
  role: row.role_kind,
  state: row.state,
  deliveryState: row.delivery_state ?? "pending",
  expiresAt: row.expires_at,
  version: Number(row.version),
});
const ROLE_CAPABILITIES: Readonly<Record<InvitationRole, readonly string[]>> =
  ROLE_CATALOG;

export class PostgresInvitationRepository implements InvitationRepository {
  constructor(
    private readonly pool: Pool,
    private readonly codec: InvitationTokenCodec,
    private readonly keyVersion: string,
    private readonly passwordHasher: PasswordHasher,
    private readonly now = () => new Date(),
    private readonly failpoint?: (stage: string) => void,
  ) {}
  private async authorized(
    client: PoolClient,
    context: TenantContext,
    lock = true,
  ) {
    if (!SAFE_SCHEMA.test(context.schemaName))
      throw new InstitutionalAccessDenied();
    const suffix = lock ? " FOR UPDATE OF m,a" : "";
    const result = await client.query(
      `SELECT m.authorization_version,a.authorization_version authority_version FROM burgoweb_global.account_tenant_memberships m JOIN ${context.schemaName}.authority_assignment a ON a.id=m.authority_id WHERE m.id=$1 AND m.account_id=$2 AND m.tenant_id=$3 AND m.state='active' AND a.person_id=$4 AND a.state='active' AND 'invitations.manage'=ANY(a.capabilities)${suffix}`,
      [
        context.membershipId,
        context.accountId,
        context.tenantId,
        context.personId,
      ],
    );
    const row = result.rows[0];
    if (
      !row ||
      Number(row.authorization_version) !== context.authorizationVersion ||
      Number(row.authority_version) !== context.authorizationVersion
    )
      throw new InstitutionalAccessDenied();
    if (lock) await this.expirePending(client, context.tenantId, this.now());
  }
  private async target(
    client: PoolClient,
    context: TenantContext,
    input: InvitationDraft,
    lock = false,
  ) {
    const suffix = lock ? " FOR UPDATE OF p,r" : "";
    const result = await client.query(
      `SELECT p.id person_id,p.full_name,r.id relationship_id,r.state relationship_state,r.version relationship_version FROM ${context.schemaName}.person p JOIN ${context.schemaName}.person_unit_relationship r ON r.person_id=p.id WHERE p.public_id=$1 AND p.state='active' AND r.public_id=$2 AND r.state='active'${suffix}`,
      [input.personPublicId, input.relationshipPublicId],
    );
    if (!result.rows[0]) throw new InstitutionalNotFound();
    if (lock)
      await this.expirePending(client, context.tenantId, this.now(), {
        personId: result.rows[0].person_id,
        relationshipId: result.rows[0].relationship_id,
        role: input.role,
      });
    return result.rows[0];
  }
  private async expirePending(
    client: PoolClient,
    tenantId: string,
    now: Date,
    target?: { personId: string; relationshipId: string; role: string },
  ) {
    const values: any[] = [tenantId, now];
    let targetFilter = "";
    if (target) {
      values.push(target.personId, target.relationshipId, target.role);
      targetFilter =
        " AND person_id=$3 AND relationship_id=$4 AND role_kind=$5";
    }
    const expired = await client.query(
      `UPDATE burgoweb_global.invitations SET state='expired',version=version+1,updated_at=$2 WHERE tenant_id=$1 AND state='pending' AND expires_at<=$2${targetFilter} RETURNING id`,
      values,
    );
    if (expired.rowCount)
      await client.query(
        `UPDATE burgoweb_global.invitation_outbox SET status='dead',leased_until=NULL,lease_owner=NULL,last_error_code='expired',updated_at=$2 WHERE invitation_id=ANY($1::uuid[]) AND status IN('pending','leased')`,
        [expired.rows.map((row) => row.id), now],
      );
  }
  async preview(
    context: TenantContext,
    input: InvitationDraft,
  ): Promise<InvitationPreview> {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      await this.authorized(client, context, false);
      const target = await this.target(client, context, input);
      await client.query("COMMIT");
      return {
        recipientName: target.full_name,
        email: input.email,
        condominiumName: context.displayName,
        relationshipPublicId: input.relationshipPublicId,
        role: input.role,
        validForSeconds: input.validForSeconds,
      };
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  }
  async create(context: TenantContext, input: any): Promise<InvitationRecord> {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      await this.authorized(client, context);
      const target = await this.target(client, context, input, true);
      const key = digest(input.idempotencyKey),
        requestHash = digest(canonical(input));
      const inserted = await client.query(
        `INSERT INTO burgoweb_global.invitation_idempotency(account_id,tenant_id,operation,key_hash,request_hash,created_at,expires_at) VALUES($1,$2,'create',$3,$4,$5::timestamptz,$5::timestamptz+interval '24 hours') ON CONFLICT DO NOTHING RETURNING key_hash`,
        [context.accountId, context.tenantId, key, requestHash, this.now()],
      );
      if (!inserted.rowCount) {
        const replay = await client.query(
          `SELECT request_hash,response_body FROM burgoweb_global.invitation_idempotency WHERE account_id=$1 AND tenant_id=$2 AND operation='create' AND key_hash=$3`,
          [context.accountId, context.tenantId, key],
        );
        if (replay.rows[0]?.request_hash !== requestHash)
          throw new InstitucionalConflict(
            "A chave idempotente foi usada com outros dados.",
          );
        if (replay.rows[0]?.response_body) {
          await client.query("COMMIT");
          return record(replay.rows[0].response_body);
        }
        throw new InstitucionalConflict("O Convite está sendo processado.");
      }
      const invitationId = randomUUID(),
        publicId = randomUUID(),
        outboxId = randomUUID(),
        issuedAt = this.now();
      const tokenContext = {
        invitationId,
        outboxId,
        tenantId: context.tenantId,
        personId: target.person_id,
        relationshipId: target.relationship_id,
        email: input.email,
        issuedAt,
        keyVersion: this.keyVersion,
        purpose: "invitation" as const,
      };
      const tokenHash = this.codec.hash(this.codec.derive(tokenContext));
      const expiresAt = new Date(
        issuedAt.getTime() + input.validForSeconds * 1000,
      );
      const created = await client.query(
        `INSERT INTO burgoweb_global.invitations(id,public_id,tenant_id,tenant_schema_name,person_id,relationship_id,issuer_account_id,issuer_membership_id,recipient_email_normalized,role_kind,invitation_token_hash,key_version,expires_at,created_at,updated_at) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$14) RETURNING *, 'pending' delivery_state`,
        [
          invitationId,
          publicId,
          context.tenantId,
          context.schemaName,
          target.person_id,
          target.relationship_id,
          context.accountId,
          context.membershipId,
          input.email,
          input.role,
          tokenHash,
          this.keyVersion,
          expiresAt,
          issuedAt,
        ],
      );
      await client.query(
        `INSERT INTO burgoweb_global.invitation_outbox(id,invitation_id,available_at,created_at,updated_at) VALUES($1,$2,$3,$3,$3)`,
        [outboxId, invitationId, issuedAt],
      );
      await client.query(
        `INSERT INTO ${context.schemaName}.institutional_audit_event(id,request_id,actor_person_id,event_type,target_kind,target_id,after_value,occurred_at) VALUES($1,$2,$3,'invitation.created','invitation',$4,$5,$6)`,
        [
          randomUUID(),
          input.requestId,
          context.personId,
          invitationId,
          JSON.stringify({ publicId, role: input.role, state: "pending" }),
          issuedAt,
        ],
      );
      const response = record(created.rows[0]);
      await client.query(
        `UPDATE burgoweb_global.invitation_idempotency SET response_body=$5 WHERE account_id=$1 AND tenant_id=$2 AND operation='create' AND key_hash=$3 AND request_hash=$4`,
        [
          context.accountId,
          context.tenantId,
          key,
          requestHash,
          JSON.stringify({ ...created.rows[0], delivery_state: "pending" }),
        ],
      );
      await client.query("COMMIT");
      return response;
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  }
  async list(context: TenantContext, cursor?: string) {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      await this.authorized(client, context, false);
      const result = await client.query(
        `SELECT i.*,CASE WHEN i.state='pending' AND i.expires_at<=CURRENT_TIMESTAMP THEN 'expired' ELSE i.state END state,COALESCE(o.status,'dead') delivery_state FROM burgoweb_global.invitations i LEFT JOIN LATERAL(SELECT status FROM burgoweb_global.invitation_outbox WHERE invitation_id=i.id ORDER BY created_at DESC LIMIT 1)o ON true WHERE i.tenant_id=$1 AND ($2::uuid IS NULL OR i.public_id>$2::uuid) ORDER BY i.public_id LIMIT 51`,
        [context.tenantId, cursor ?? null],
      );
      await client.query("COMMIT");
      return {
        items: result.rows.slice(0, 50).map(record),
        nextCursor: result.rows[50]?.public_id,
      };
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  }
  async get(context: TenantContext, publicId: string) {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      await this.authorized(client, context, false);
      const result = await client.query(
        `SELECT i.*,CASE WHEN i.state='pending' AND i.expires_at<=CURRENT_TIMESTAMP THEN 'expired' ELSE i.state END state,COALESCE(o.status,'dead') delivery_state FROM burgoweb_global.invitations i LEFT JOIN LATERAL(SELECT status FROM burgoweb_global.invitation_outbox WHERE invitation_id=i.id ORDER BY created_at DESC LIMIT 1)o ON true WHERE i.tenant_id=$1 AND i.public_id=$2`,
        [context.tenantId, publicId],
      );
      if (!result.rows[0]) throw new InstitutionalNotFound();
      await client.query("COMMIT");
      return record(result.rows[0]);
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  }
  async cancel(context: TenantContext, input: any) {
    return this.transition(context, input, "cancelled");
  }
  async reissue(context: TenantContext, input: any) {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      await this.authorized(client, context);
      const priorResult = await client.query(
        `SELECT * FROM burgoweb_global.invitations WHERE tenant_id=$1 AND public_id=$2 AND version=$3 AND state='pending' FOR UPDATE`,
        [context.tenantId, input.publicId, input.expectedVersion],
      );
      const prior = priorResult.rows[0];
      if (!prior) {
        await client.query("COMMIT");
        throw new InstitucionalConflict(
          "O convite mudou ou não está mais pendente.",
        );
      }
      const now = this.now(),
        key = digest(input.idempotencyKey),
        requestHash = digest(canonical(input));
      const inserted = await client.query(
        `INSERT INTO burgoweb_global.invitation_idempotency(account_id,tenant_id,operation,key_hash,request_hash,created_at,expires_at) VALUES($1,$2,'reissue',$3,$4,$5::timestamptz,$5::timestamptz+interval '24 hours') ON CONFLICT DO NOTHING RETURNING key_hash`,
        [context.accountId, context.tenantId, key, requestHash, now],
      );
      if (!inserted.rowCount) {
        const replay = await client.query(
          `SELECT request_hash,response_body FROM burgoweb_global.invitation_idempotency WHERE account_id=$1 AND tenant_id=$2 AND operation='reissue' AND key_hash=$3`,
          [context.accountId, context.tenantId, key],
        );
        if (replay.rows[0]?.request_hash !== requestHash)
          throw new InstitucionalConflict(
            "A chave idempotente foi usada com outros dados.",
          );
        if (replay.rows[0]?.response_body) {
          await client.query("COMMIT");
          return record(replay.rows[0].response_body);
        }
        throw new InstitucionalConflict("O convite está sendo processado.");
      }
      const invitationId = randomUUID(),
        publicId = randomUUID(),
        outboxId = randomUUID(),
        email = input.email ?? prior.recipient_email_normalized;
      const corrected = email !== prior.recipient_email_normalized,
        priorState = corrected ? "cancelled" : "superseded";
      const tokenContext = {
        invitationId,
        outboxId,
        tenantId: context.tenantId,
        personId: prior.person_id,
        relationshipId: prior.relationship_id,
        email,
        issuedAt: now,
        keyVersion: this.keyVersion,
        purpose: "invitation" as const,
      };
      const tokenHash = this.codec.hash(this.codec.derive(tokenContext)),
        expiresAt = new Date(
          now.getTime() + (input.validForSeconds ?? 86400) * 1000,
        );
      await client.query(
        `UPDATE burgoweb_global.invitations SET state=$2,version=version+1,updated_at=$3 WHERE id=$1`,
        [prior.id, priorState, now],
      );
      await client.query(
        `UPDATE burgoweb_global.invitation_outbox SET status='dead',leased_until=NULL,lease_owner=NULL,last_error_code=$2,updated_at=$3 WHERE invitation_id=$1 AND status IN('pending','leased')`,
        [prior.id, priorState, now],
      );
      const created = await client.query(
        `INSERT INTO burgoweb_global.invitations(id,public_id,tenant_id,tenant_schema_name,person_id,relationship_id,issuer_account_id,issuer_membership_id,recipient_email_normalized,role_kind,invitation_token_hash,key_version,expires_at,created_at,updated_at) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$14) RETURNING *, 'pending' delivery_state`,
        [
          invitationId,
          publicId,
          context.tenantId,
          context.schemaName,
          prior.person_id,
          prior.relationship_id,
          context.accountId,
          context.membershipId,
          email,
          prior.role_kind,
          tokenHash,
          this.keyVersion,
          expiresAt,
          now,
        ],
      );
      if (!corrected)
        await client.query(
          `UPDATE burgoweb_global.invitations SET superseded_by=$2 WHERE id=$1`,
          [prior.id, invitationId],
        );
      await client.query(
        `INSERT INTO burgoweb_global.invitation_outbox(id,invitation_id,available_at,created_at,updated_at) VALUES($1,$2,$3,$3,$3)`,
        [outboxId, invitationId, now],
      );
      await client.query(
        `INSERT INTO ${context.schemaName}.institutional_audit_event(id,request_id,actor_person_id,event_type,target_kind,target_id,before_value,after_value,occurred_at) VALUES($1,$2,$3,$4,'invitation',$5,$6,$7,$8)`,
        [
          randomUUID(),
          input.requestId,
          context.personId,
          corrected ? "invitation.email-corrected" : "invitation.reissued",
          invitationId,
          JSON.stringify({ publicId: prior.public_id, state: priorState }),
          JSON.stringify({ publicId, state: "pending" }),
          now,
        ],
      );
      await client.query(
        `UPDATE burgoweb_global.invitation_idempotency SET response_body=$5 WHERE account_id=$1 AND tenant_id=$2 AND operation='reissue' AND key_hash=$3 AND request_hash=$4`,
        [
          context.accountId,
          context.tenantId,
          key,
          requestHash,
          JSON.stringify({ ...created.rows[0], delivery_state: "pending" }),
        ],
      );
      await client.query("COMMIT");
      return record(created.rows[0]);
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  }
  private async transition(
    context: TenantContext,
    input: any,
    state: "cancelled" | "superseded",
  ) {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      await this.authorized(client, context);
      const now = this.now();
      const result = await client.query(
        `UPDATE burgoweb_global.invitations SET state=$4,version=version+1,updated_at=$5 WHERE tenant_id=$1 AND public_id=$2 AND version=$3 AND state='pending' RETURNING *, 'dead' delivery_state`,
        [context.tenantId, input.publicId, input.expectedVersion, state, now],
      );
      if (!result.rows[0]) {
        await client.query("COMMIT");
        throw new InstitucionalConflict(
          "O Convite mudou ou não está mais pendente.",
        );
      }
      await client.query(
        `UPDATE burgoweb_global.invitation_outbox SET status='dead',leased_until=NULL,lease_owner=NULL,last_error_code=$2,updated_at=$3 WHERE invitation_id=$1 AND status IN('pending','leased')`,
        [result.rows[0].id, state, now],
      );
      await client.query(
        `INSERT INTO ${context.schemaName}.institutional_audit_event(id,request_id,actor_person_id,event_type,target_kind,target_id,before_value,after_value,occurred_at) VALUES($1,$2,$3,$4,'invitation',$5,$6,$7,$8)`,
        [
          randomUUID(),
          input.requestId,
          context.personId,
          state === "cancelled"
            ? "invitation.cancelled"
            : "invitation.superseded",
          result.rows[0].id,
          JSON.stringify({
            publicId: result.rows[0].public_id,
            state: "pending",
          }),
          JSON.stringify({ publicId: result.rows[0].public_id, state }),
          now,
        ],
      );
      await client.query("COMMIT");
      return record(result.rows[0]);
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  }
  async accept(input: {
    token: string;
    accountId?: string;
    password?: string;
    requestId: string;
  }) {
    const client = await this.pool.connect();
    let row: any;
    try {
      await client.query("BEGIN");
      const tokenHash = this.codec.hash(input.token),
        now = this.now();
      const found = await client.query(
        `SELECT i.*,t.public_id tenant_public_id FROM burgoweb_global.invitations i JOIN burgoweb_global.tenant_registry t ON t.id=i.tenant_id WHERE i.invitation_token_hash=$1 AND i.state='pending' AND i.expires_at>CURRENT_TIMESTAMP FOR UPDATE OF i`,
        [tokenHash],
      );
      row = found.rows[0];
      if (!row || !SAFE_SCHEMA.test(row.tenant_schema_name)) {
        await client.query("ROLLBACK");
        return undefined;
      }
      let accountId = input.accountId;
      if (accountId) {
        // Query dedicada (não LEFT JOIN) porque PostgreSQL proíbe FOR UPDATE sobre o lado
        // nullable de uma junção externa; trava a Conta para evitar TOCTOU entre esta
        // checagem e o commit da mesma transação.
        const acct = await client.query(
          `SELECT state,email_verified_at,email_normalized FROM burgoweb_global.accounts WHERE id=$1 FOR UPDATE`,
          [accountId],
        );
        const acctRow = acct.rows[0];
        if (
          !acctRow ||
          acctRow.state !== "active" ||
          !acctRow.email_verified_at ||
          acctRow.email_normalized !== row.recipient_email_normalized
        ) {
          await client.query("ROLLBACK");
          return undefined;
        }
      } else {
        if (!input.password) {
          await client.query("ROLLBACK");
          return undefined;
        }
        const existing = await client.query(
          `SELECT id,state,email_verified_at FROM burgoweb_global.accounts WHERE email_normalized=$1 FOR UPDATE`,
          [row.recipient_email_normalized],
        );
        if (existing.rows[0]) {
          await client.query("ROLLBACK");
          return undefined;
        }
        accountId = randomUUID();
        const password = await this.passwordHasher.hash(input.password);
        await client.query(
          `INSERT INTO burgoweb_global.accounts(id,email_normalized,state,email_verified_at,created_at) VALUES($1,$2,'active',$3,$3)`,
          [accountId, row.recipient_email_normalized, now],
        );
        await client.query(
          `INSERT INTO burgoweb_global.credentials(account_id,encoded_hash,pepper_version,created_at) VALUES($1,$2,$3,$4)`,
          [accountId, password.encodedHash, password.pepperVersion, now],
        );
      }
      const source = await client.query(
        `SELECT r.id,r.person_id,r.state,p.state person_state FROM ${row.tenant_schema_name}.person_unit_relationship r JOIN ${row.tenant_schema_name}.person p ON p.id=r.person_id WHERE r.id=$1 FOR UPDATE`,
        [row.relationship_id],
      );
      if (
        source.rows[0]?.state !== "active" ||
        source.rows[0]?.person_state !== "active" ||
        source.rows[0]?.person_id !== row.person_id
      ) {
        await client.query("ROLLBACK");
        return undefined;
      }
      const issuer = await client.query(
        `SELECT m.authorization_version,a.authorization_version authority_version,a.person_id issuer_person_id FROM burgoweb_global.account_tenant_memberships m JOIN ${row.tenant_schema_name}.authority_assignment a ON a.id=m.authority_id WHERE m.id=$1 AND m.account_id=$2 AND m.state='active' AND a.state='active' AND 'invitations.manage'=ANY(a.capabilities) FOR UPDATE OF m,a`,
        [row.issuer_membership_id, row.issuer_account_id],
      );
      if (
        !issuer.rows[0] ||
        Number(issuer.rows[0].authorization_version) !==
          Number(issuer.rows[0].authority_version)
      ) {
        await client.query("ROLLBACK");
        return undefined;
      }
      this.failpoint?.("accept.after-account");
      const role = row.role_kind as InvitationRole;
      const capabilities = ROLE_CAPABILITIES[role];
      if (!capabilities) {
        await client.query("ROLLBACK");
        return undefined;
      }
      const existingMembership = await client.query(
        `SELECT m.id membership_id,m.authority_id,a.authorization_version
           FROM burgoweb_global.account_tenant_memberships m
           JOIN ${row.tenant_schema_name}.authority_assignment a ON a.id=m.authority_id
          WHERE m.account_id=$1 AND m.tenant_id=$2 AND m.person_id=$3 AND m.state='active'
          FOR UPDATE OF m,a`,
        [accountId, row.tenant_id, row.person_id],
      );
      const authorityId = existingMembership.rows[0]?.authority_id ?? randomUUID();
      const membershipId = existingMembership.rows[0]?.membership_id ?? randomUUID();
      if (existingMembership.rowCount) {
        await client.query(
          `UPDATE ${row.tenant_schema_name}.authority_assignment
              SET capabilities=(SELECT array_agg(DISTINCT capability ORDER BY capability) FROM unnest(capabilities||$2::text[]) capability),
                  authorization_version=authorization_version+1
            WHERE id=$1`,
          [authorityId, [...capabilities]],
        );
        await client.query(
          `UPDATE burgoweb_global.account_tenant_memberships membership
              SET authorization_version=authority.authorization_version
             FROM ${row.tenant_schema_name}.authority_assignment authority
            WHERE membership.id=$1 AND authority.id=membership.authority_id`,
          [membershipId],
        );
      } else {
        await client.query(
          `INSERT INTO ${row.tenant_schema_name}.authority_assignment(id,person_id,state,created_at,role_kind,capabilities,authorization_version,activated_at) VALUES($1,$2,'active',$3,$4,$5,1,$3)`,
          [authorityId, row.person_id, now, role, [...capabilities]],
        );
        this.failpoint?.("accept.after-authority");
        await client.query(
          `INSERT INTO burgoweb_global.account_tenant_memberships(id,account_id,tenant_id,person_id,authority_id,state,valid_from,authorization_version) VALUES($1,$2,$3,$4,$5,'active',$6,1)`,
          [membershipId, accountId, row.tenant_id, row.person_id, authorityId, now],
        );
        await linkAuthorizationSourceInTransaction(client, {
          schemaName: row.tenant_schema_name,
          tenantId: row.tenant_id,
          relationshipId: row.relationship_id,
          expectedPersonId: row.person_id,
          authorityId,
          membershipId,
        });
      }
      const roleAssignmentId = randomUUID();
      await client.query(
        `INSERT INTO ${row.tenant_schema_name}.role_assignment(id,public_id,person_id,source_relationship_id,role_kind,scope_kind,valid_from,state,granted_by_person_id,created_at,updated_at)
         VALUES($1,$1,$2,$3,$4,'tenant',$5,'active',$6,$5,$5)`,
        [roleAssignmentId, row.person_id, row.relationship_id, role, now, issuer.rows[0].issuer_person_id],
      );
      await client.query(
        `INSERT INTO ${row.tenant_schema_name}.role_authorization_projection(assignment_id,public_id,state,role_kind,scope_kind,valid_from,version,projected_at)
         VALUES($1,$1,'active',$2,'tenant',$3,1,$3)`,
        [roleAssignmentId, role, now],
      );
      this.failpoint?.("accept.after-membership");
      await client.query(
        `UPDATE burgoweb_global.invitations SET state='accepted',accepted_at=$2,accepted_account_id=$3,version=version+1,updated_at=$2 WHERE id=$1`,
        [row.id, now, accountId],
      );
      await client.query(
        `INSERT INTO ${row.tenant_schema_name}.institutional_audit_event(id,request_id,actor_person_id,event_type,target_kind,target_id,after_value,occurred_at) VALUES($1,$2,$3,'invitation.accepted','invitation',$4,$5,$6)`,
        [
          randomUUID(),
          input.requestId,
          row.person_id,
          row.id,
          JSON.stringify({ role, state: "accepted" }),
          now,
        ],
      );
      await client.query("COMMIT");
      return {
        state: "accepted" as const,
        tenantPublicId: row.tenant_public_id,
        role,
      };
    } catch (e: any) {
      await client.query("ROLLBACK");
      if (e?.code === "23505") {
        const conflictConstraint =
          typeof e?.constraint === "string" ? e.constraint : undefined;
        if (
          row &&
          SAFE_SCHEMA.test(row.tenant_schema_name) &&
          (conflictConstraint === "authority_assignment_initial_unique" ||
            conflictConstraint ===
              "memberships_one_active_account_tenant_idx" ||
            conflictConstraint === "memberships_one_active_person_tenant_idx")
        ) {
          try {
            await client.query("BEGIN");
            await client.query(
              `INSERT INTO ${row.tenant_schema_name}.institutional_audit_event(id,request_id,actor_person_id,event_type,target_kind,target_id,after_value,occurred_at) VALUES($1,$2,$3,'invitation.accept.conflict','invitation',$4,$5,$6)`,
              [
                randomUUID(),
                input.requestId,
                row.person_id,
                row.id,
                JSON.stringify({ constraint: conflictConstraint }),
                this.now(),
              ],
            );
            await client.query("COMMIT");
          } catch {
            await client.query("ROLLBACK").catch(() => {});
          }
        }
        return undefined;
      }
      throw e;
    } finally {
      client.release();
    }
  }
}
