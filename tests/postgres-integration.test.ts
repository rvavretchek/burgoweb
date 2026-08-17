import { readFile } from "node:fs/promises";
import {
  GenericContainer,
  Wait,
  type StartedTestContainer,
} from "testcontainers";
import { Pool } from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PostgresTenantMigrator } from "../packages/adapters/src/db/postgres-tenant-migrator.js";
import { PostgresPeopleUnitsRepository } from "../packages/adapters/src/db/postgres-people-units-repository.js";
import { PostgresIdentityRepository } from "../packages/adapters/src/db/postgres-identity-repository.js";
import {
  PostgresAuditPort,
  PostgresProvisioningRepository,
} from "../packages/adapters/src/db/postgres-provisioning-repository.js";
import {
  HmacRecoveryTokenCodec,
  HmacInvitationTokenCodec,
  HmacVerificationTokenCodec,
  PostgresGlobalMigrator,
  PostgresRateLimiter,
  PostgresInvitationRepository,
  PostgresRecoveryRepository,
  PostgresVerificationOutbox,
  PostgresVerificationRepository,
} from "../packages/adapters/src/index.js";
import {
  CompletePasswordRecovery,
  AcceptInvitation,
  CreateInvitation,
  CreateCondominium,
  InstitucionalConflict,
  RequestPasswordRecovery,
  VerificationTokenIssuer,
} from "../packages/application/src/index.js";
import { createProductionApplication } from "../apps/api/src/composition-root.js";

describe
  .runIf(process.env.BURGOWEB_INTEGRATION === "1")
  .sequential("PostgreSQL 18 real", () => {
    let container: StartedTestContainer;
    let pool: Pool;
    const externalDatabaseUrl = process.env.BURGOWEB_INTEGRATION_DATABASE_URL;

    beforeAll(async () => {
      if (externalDatabaseUrl) {
        pool = new Pool({ connectionString: externalDatabaseUrl });
        await pool.query("select 1");
        return;
      }
      container = await new GenericContainer("postgres:18.4")
        .withEnvironment({
          POSTGRES_DB: "burgoweb_test",
          POSTGRES_USER: "burgoweb",
          POSTGRES_PASSWORD: "test-only-password",
        })
        .withExposedPorts(5432)
        .withWaitStrategy(
          Wait.forLogMessage(
            /database system is ready to accept connections/,
            2,
          ),
        )
        .start();
      pool = new Pool({
        host: container.getHost(),
        port: container.getMappedPort(5432),
        database: "burgoweb_test",
        user: "burgoweb",
        password: "test-only-password",
      });
      await pool.query("select 1");
    }, 120_000);

    afterAll(async () => {
      await pool?.end();
      await container?.stop();
    });

    it("aplica migration global de forma retomável", async () => {
      const sql = await readFile(
        "migrations/global/001_provisioning.sql",
        "utf8",
      );
      await pool.query(sql);
      await pool.query(sql);
      const result = await pool.query(
        "select table_name from information_schema.tables where table_schema='burgoweb_global'",
      );
      expect(result.rows.map((row) => row.table_name)).toEqual(
        expect.arrayContaining([
          "accounts",
          "credentials",
          "tenant_registry",
          "provisioning_requests",
          "authority_declarations",
          "pending_authorities",
          "idempotency_records",
          "audit_events",
        ]),
      );
      await new PostgresGlobalMigrator(pool).migrate();
    });

    it("cria tenants isolados com o mesmo nome de exibição", async () => {
      const migrator = new PostgresTenantMigrator(pool);
      await migrator.createAndMigrate(
        "tenant_11111111111111111111111111111111",
      );
      await migrator.createAndMigrate(
        "tenant_22222222222222222222222222222222",
      );
      await pool.query(
        `insert into tenant_11111111111111111111111111111111.person(id, full_name, created_at) values ('11111111-1111-4111-8111-111111111111', 'Residencial Sol', now())`,
      );
      expect(
        (
          await pool.query(
            "select count(*)::int as count from tenant_11111111111111111111111111111111.person",
          )
        ).rows[0].count,
      ).toBe(1);
      expect(
        (
          await pool.query(
            "select count(*)::int as count from tenant_22222222222222222222222222222222.person",
          )
        ).rows[0].count,
      ).toBe(0);
    });

    it("serializa idempotência concorrente e permite nomes de exibição repetidos", async () => {
      const requestA = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
      const requestB = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
      await pool.query(
        `insert into burgoweb_global.provisioning_requests(id,state,correlation_id,created_at,updated_at) values ($1,'processing',$1,now(),now()),($2,'processing',$2,now(),now())`,
        [requestA, requestB],
      );
      const insert = (requestId: string) =>
        pool.query(
          `insert into burgoweb_global.idempotency_records(operation,idempotency_key,request_hash,request_id) values ('create-condominium','same-key',$1,$2) on conflict do nothing`,
          ["a".repeat(64), requestId],
        );
      await Promise.all([insert(requestA), insert(requestB)]);
      expect(
        (
          await pool.query(
            `select count(*)::int as count from burgoweb_global.idempotency_records where operation='create-condominium' and idempotency_key='same-key'`,
          )
        ).rows[0].count,
      ).toBe(1);

      await pool.query(
        `insert into burgoweb_global.tenant_registry(id,public_id,schema_name,display_name,state,migration_version,created_at) values ('11111111-aaaa-4aaa-8aaa-aaaaaaaaaaaa','11111111-bbbb-4bbb-8bbb-bbbbbbbbbbbb','tenant_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa','Residencial Sol','pending_verification',1,now()),('22222222-aaaa-4aaa-8aaa-aaaaaaaaaaaa','22222222-bbbb-4bbb-8bbb-bbbbbbbbbbbb','tenant_bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb','Residencial Sol','pending_verification',1,now())`,
      );
      expect(
        (
          await pool.query(
            `select count(*)::int as count from burgoweb_global.tenant_registry where display_name='Residencial Sol'`,
          )
        ).rows[0].count,
      ).toBe(2);
      await expect(
        pool.query(
          `insert into burgoweb_global.tenant_registry(id,public_id,schema_name,display_name,state,migration_version,created_at) values ('33333333-aaaa-4aaa-8aaa-aaaaaaaaaaaa','33333333-bbbb-4bbb-8bbb-bbbbbbbbbbbb','tenant_cccccccccccccccccccccccccccccccc','Ativo permitido','active',2,now())`,
        ),
      ).resolves.toMatchObject({ rowCount: 1 });
    });

    it("rejeita schema controlado externamente e compensa criação parcial", async () => {
      const migrator = new PostgresTenantMigrator(pool);
      await expect(
        migrator.createAndMigrate("public; drop schema public"),
      ).rejects.toThrow(/schema/i);
      await migrator.createAndMigrate(
        "tenant_33333333333333333333333333333333",
      );
      expect(
        await migrator.compensate("tenant_33333333333333333333333333333333"),
      ).toBe(true);
      expect(
        (
          await pool.query(
            "select count(*)::int as count from information_schema.schemata where schema_name='tenant_33333333333333333333333333333333'",
          )
        ).rows[0].count,
      ).toBe(0);
    });

    it("executa happy path pendente, replay e conflito no workflow real", async () => {
      const repository = new PostgresProvisioningRepository(pool);
      const useCase = new CreateCondominium({
        repository,
        tenantProvisioner: new PostgresTenantMigrator(pool),
        passwordHasher: {
          hash: async () => ({
            encodedHash: "$argon2id$test-only",
            pepperVersion: "v1",
          }),
          verify: async () => ({ valid: true, needsRehash: false }),
        },
        audit: new PostgresAuditPort(pool),
      });
      const input = {
        person: { fullName: "Ana Silva" },
        account: { email: "ana.workflow@example.com" },
        condominium: { displayName: "Residencial Workflow" },
        password: "senha longa de integração",
        authorityDeclarationAccepted: true,
      };
      const first = await useCase.execute(input, "workflow-key");
      expect(first.state).toBe("pending-email-verification");
      expect(await useCase.execute(input, "workflow-key")).toEqual(first);
      await expect(
        useCase.execute(
          { ...input, condominium: { displayName: "Outro" } },
          "workflow-key",
        ),
      ).rejects.toMatchObject({ status: 409 });
      const global = await pool.query(
        `select pr.state, tr.state as tenant_state, tr.migration_version, ad.declaration_text, ad.declaration_version from burgoweb_global.provisioning_requests pr join burgoweb_global.tenant_registry tr on tr.id=pr.tenant_id join burgoweb_global.authority_declarations ad on ad.request_id=pr.id where pr.id=$1`,
        [first.requestId],
      );
      expect(global.rows[0]).toMatchObject({
        state: "pending_verification",
        tenant_state: "pending_verification",
        migration_version: 8,
        declaration_version: "2026-07-28",
      });
      expect(global.rows[0].declaration_text).toContain("não certifica");
      const schema = (
        await pool.query(
          `select schema_name from burgoweb_global.tenant_registry where public_id=$1`,
          [first.publicCondominiumId],
        )
      ).rows[0].schema_name;
      expect(
        (
          await pool.query(
            `select count(*)::int as count from ${schema}.person`,
          )
        ).rows[0].count,
      ).toBe(1);
      expect(
        (
          await pool.query(
            `select count(*)::int as count from ${schema}.authority_assignment`,
          )
        ).rows[0].count,
      ).toBe(1);

      const neutral = await useCase.execute(
        { ...input, condominium: { displayName: "Tentativa neutra" } },
        "existing-account-key",
      );
      expect(Object.keys(neutral).sort()).toEqual(Object.keys(first).sort());
      expect(neutral.state).toBe(first.state);
      expect(
        (
          await pool.query(
            `select count(*)::int as count from burgoweb_global.accounts where email_normalized='ana.workflow@example.com'`,
          )
        ).rows[0].count,
      ).toBe(1);
      expect(
        (
          await pool.query(
            `select count(*)::int as count from burgoweb_global.tenant_registry where display_name in ('Residencial Workflow','Tentativa neutra')`,
          )
        ).rows[0].count,
      ).toBe(1);

      const concurrentInput = {
        ...input,
        account: { email: "concorrente@example.com" },
        condominium: { displayName: "Concorrente" },
      };
      const [concurrentA, concurrentB] = await Promise.all([
        useCase.execute(concurrentInput, "concurrent-workflow-key"),
        useCase.execute(concurrentInput, "concurrent-workflow-key"),
      ]);
      expect(concurrentB).toEqual(concurrentA);
      expect(
        (
          await pool.query(
            `select count(*)::int as count from burgoweb_global.accounts where email_normalized='concorrente@example.com'`,
          )
        ).rows[0].count,
      ).toBe(1);
      expect(
        (
          await pool.query(
            `select count(*)::int as count from burgoweb_global.tenant_registry where display_name='Concorrente'`,
          )
        ).rows[0].count,
      ).toBe(1);
    });

    it("compensa ou isola cada failpoint sem deixar tenant utilizável", async () => {
      const stages = [
        "global.after-account",
        "global.after-credential",
        "global.after-tenant",
        "global.after-declaration",
        "global.after-authority",
        "tenant.after-schema",
        "tenant.after-migration",
        "tenant.after-seed",
        "global.before-pending-commit",
      ];
      for (const [index, stage] of stages.entries()) {
        const trigger = (current: string) => {
          if (current === stage) throw new Error(`failpoint:${stage}`);
        };
        const repository = new PostgresProvisioningRepository(
          pool,
          stage.startsWith("global.") ? trigger : undefined,
        );
        const migrator = new PostgresTenantMigrator(
          pool,
          "migrations/tenant/001_identity_pending.sql",
          stage.startsWith("tenant.") ? trigger : undefined,
        );
        const useCase = new CreateCondominium({
          repository,
          tenantProvisioner: migrator,
          passwordHasher: {
            hash: async () => ({
              encodedHash: "$argon2id$test-only",
              pepperVersion: "v1",
            }),
            verify: async () => ({ valid: true, needsRehash: false }),
          },
          audit: new PostgresAuditPort(pool),
        });
        const key = `failpoint-${index}`;
        await expect(
          useCase.execute(
            {
              person: { fullName: "Falha Segura" },
              account: { email: `failpoint-${index}@example.com` },
              condominium: { displayName: `Failpoint ${index}` },
              password: "senha longa de integração",
              authorityDeclarationAccepted: true,
            },
            key,
          ),
        ).rejects.toMatchObject({ status: 503 });
        const record = await pool.query(
          `select pr.state,tr.schema_name,tr.state as tenant_state from burgoweb_global.idempotency_records ir join burgoweb_global.provisioning_requests pr on pr.id=ir.request_id left join burgoweb_global.tenant_registry tr on tr.id=pr.tenant_id where ir.idempotency_key=$1`,
          [key],
        );
        expect(record.rows[0].state).toBe("compensated");
        if (record.rows[0].schema_name) {
          expect(record.rows[0].tenant_state).toBe("compensated");
          expect(
            (
              await pool.query(
                `select count(*)::int as count from information_schema.schemata where schema_name=$1`,
                [record.rows[0].schema_name],
              )
            ).rows[0].count,
          ).toBe(0);
        }
        expect(
          (
            await pool.query(
              `select count(*)::int as count from burgoweb_global.audit_events ae join burgoweb_global.idempotency_records ir on ir.request_id=ae.request_id where ir.idempotency_key=$1 and ae.event_type='provisioning.pending'`,
              [key],
            )
          ).rows[0].count,
        ).toBe(0);
      }
    });

    it("faz rollback integral em cada etapa observável da ativação", async () => {
      const codec = new HmacVerificationTokenCodec({
        currentVersion: "failpoint-v1",
        keys: { "failpoint-v1": "f".repeat(32) },
      });
      const issuer = new VerificationTokenIssuer({
        codec,
        keyVersion: "failpoint-v1",
        ttlSeconds: 3600,
      });
      for (const [index, stage] of [
        "activation.after-token",
        "activation.after-global",
        "activation.after-tenant",
      ].entries()) {
        const useCase = new CreateCondominium({
          repository: new PostgresProvisioningRepository(pool),
          tenantProvisioner: new PostgresTenantMigrator(pool),
          passwordHasher: {
            hash: async () => ({
              encodedHash: "$argon2id$test-only",
              pepperVersion: "v1",
            }),
            verify: async () => ({ valid: true, needsRehash: false }),
          },
          audit: new PostgresAuditPort(pool),
          verificationIssuer: issuer,
        });
        const pending = await useCase.execute(
          {
            person: { fullName: "Rollback" },
            account: { email: `activation-${index}@example.com` },
            condominium: { displayName: `Activation ${index}` },
            password: "senha longa de integração",
            authorityDeclarationAccepted: true,
          },
          `activation-${index}`,
        );
        const token = await pool.query(
          `select vt.*,tr.schema_name from burgoweb_global.verification_tokens vt join burgoweb_global.provisioning_requests pr on pr.id=vt.request_id join burgoweb_global.tenant_registry tr on tr.id=pr.tenant_id where vt.request_id=$1`,
          [pending.requestId],
        );
        await expect(
          new PostgresVerificationRepository(pool, (current) => {
            if (current === stage) throw new Error(stage);
          }).confirm(token.rows[0].token_hash.trim(), new Date()),
        ).rejects.toThrow(stage);
        const state = await pool.query(
          `select a.state,a.email_verified_at,tr.state as tenant_state,pa.state as authority_state,tr.schema_name,vt.used_at from burgoweb_global.provisioning_requests pr join burgoweb_global.accounts a on a.id=pr.account_id join burgoweb_global.tenant_registry tr on tr.id=pr.tenant_id join burgoweb_global.pending_authorities pa on pa.request_id=pr.id join burgoweb_global.verification_tokens vt on vt.request_id=pr.id where pr.id=$1`,
          [pending.requestId],
        );
        expect(state.rows[0]).toMatchObject({
          state: "pending_verification",
          email_verified_at: null,
          tenant_state: "pending_verification",
          authority_state: "pending_verification",
          used_at: null,
        });
        expect(
          (
            await pool.query(
              `select state from ${state.rows[0].schema_name}.authority_assignment`,
            )
          ).rows[0].state,
        ).toBe("pending_verification");
        expect(
          (
            await pool.query(
              `select count(*)::int as count from burgoweb_global.audit_events where request_id=$1 and event_type='email-verification.activated'`,
              [pending.requestId],
            )
          ).rows[0].count,
        ).toBe(0);
      }
    });

    it("incrementa rate limit persistente atomicamente sob concorrência", async () => {
      const limiter = new PostgresRateLimiter(pool);
      const now = new Date("2026-07-30T12:00:00Z");
      const results = await Promise.all(
        Array.from({ length: 5 }, () =>
          limiter.consume(
            "email-verification.resend",
            ["request", "email@example.com", "origin", "agent"],
            now,
            3,
            300,
          ),
        ),
      );
      expect(results.filter(Boolean)).toHaveLength(3);
      expect(
        (
          await pool.query(
            `select count from burgoweb_global.rate_limit_buckets where operation='email-verification.resend.0'`,
          )
        ).rows[0].count,
      ).toBe(5);
      const rotated = await Promise.all(
        ["origin-a", "origin-b", "origin-c"].map((origin) =>
          limiter.consume(
            "auth.login.rotation",
            ["candidate@example.com", origin],
            now,
            2,
            300,
          ),
        ),
      );
      expect(rotated.filter(Boolean)).toHaveLength(2);
      expect(
        JSON.stringify(
          (
            await pool.query(
              `select subject_hash from burgoweb_global.rate_limit_buckets where operation like 'auth.login.rotation.%'`,
            )
          ).rows,
        ),
      ).not.toContain("candidate@example.com");
    });

    it("consome recovery token uma vez e preserva somente a nova sessão quando solicitado", async () => {
      await new PostgresGlobalMigrator(pool).migrate();
      const accountId = crypto.randomUUID();
      await pool.query(
        `INSERT INTO burgoweb_global.accounts(id,email_normalized,state,created_at,email_verified_at) VALUES($1,$2,'active',now(),now())`,
        [accountId, `recovery-${accountId}@example.com`],
      );
      await pool.query(
        `INSERT INTO burgoweb_global.credentials(account_id,encoded_hash,pepper_version,created_at) VALUES($1,'old','v1',now())`,
        [accountId],
      );
      const repository = new PostgresRecoveryRepository(pool);
      const codec = new HmacRecoveryTokenCodec({
        currentVersion: "v1",
        keys: { v1: "q".repeat(32) },
      });
      let token = "";
      const request = new RequestPasswordRecovery({
        repository,
        codec,
        keyVersion: "v1",
        ttlSeconds: 900,
      });
      const originalRequest = repository.request.bind(repository);
      repository.request = async (email, requestId, requestedAt, issue) =>
        originalRequest(email, requestId, requestedAt, (target) => {
          const record = issue(target);
          token = codec.derive(record);
          return record;
        });
      await request.execute({
        email: `recovery-${accountId}@example.com`,
        requestId: crypto.randomUUID(),
      });
      const complete = new CompletePasswordRecovery({
        repository,
        hasher: {
          hash: async () => ({ encodedHash: "new", pepperVersion: "v2" }),
          verify: async () => ({ valid: true, needsRehash: false }),
        },
        recoveryCodec: codec,
        sessionCodec: {
          issue: () => ({
            token: "fresh",
            tokenHash: "a".repeat(64),
            csrfToken: "csrf",
            csrfHash: "b".repeat(64),
          }),
          issueCsrf: () => ({ csrfToken: "", csrfHash: "" }),
          hash: () => "",
        },
        absoluteTtlSeconds: 3600,
        idleTtlSeconds: 600,
      });
      await expect(
        complete.execute({
          token,
          newPassword: "new secure password",
          revokeOtherSessions: true,
          requestId: crypto.randomUUID(),
        }),
      ).resolves.toMatchObject({ token: "fresh" });
      await expect(
        complete.execute({
          token,
          newPassword: "another secure password",
          revokeOtherSessions: false,
          requestId: crypto.randomUUID(),
        }),
      ).rejects.toThrow();
      expect(
        (
          await pool.query(
            `SELECT encoded_hash FROM burgoweb_global.credentials WHERE account_id=$1`,
            [accountId],
          )
        ).rows[0].encoded_hash,
      ).toBe("new");
    });

    it("persiste cadastros institucionais, replay, CAS e revogação derivada reais", async () => {
      await new PostgresGlobalMigrator(pool).migrate();
      const suffix = crypto.randomUUID().replaceAll("-", "");
      const schema = `tenant_${suffix}`;
      await new PostgresTenantMigrator(pool).createAndMigrate(schema);
      const tenantId = crypto.randomUUID(),
        tenantPublicId = crypto.randomUUID();
      const actorAccountId = crypto.randomUUID(),
        derivedAccountId = crypto.randomUUID();
      const actorPersonId = crypto.randomUUID(),
        relatedPersonId = crypto.randomUUID();
      const actorAuthorityId = crypto.randomUUID(),
        derivedAuthorityId = crypto.randomUUID();
      const actorMembershipId = crypto.randomUUID(),
        derivedMembershipId = crypto.randomUUID();
      await pool.query(
        `INSERT INTO burgoweb_global.tenant_registry(id,public_id,schema_name,display_name,state,migration_version,created_at) VALUES($1,$2,$3,'Integração institucional','active',5,now())`,
        [tenantId, tenantPublicId, schema],
      );
      await pool.query(
        `INSERT INTO burgoweb_global.accounts(id,email_normalized,state,created_at,email_verified_at) VALUES($1,$2,'active',now(),now()),($3,$4,'active',now(),now())`,
        [
          actorAccountId,
          `actor-${suffix}@example.com`,
          derivedAccountId,
          `derived-${suffix}@example.com`,
        ],
      );
      await pool.query(
        `INSERT INTO ${schema}.person(id,public_id,full_name,state,version,created_at) VALUES($1,$2,'Síndica','active',1,now()),($3,$4,'Moradora','active',1,now())`,
        [
          actorPersonId,
          crypto.randomUUID(),
          relatedPersonId,
          crypto.randomUUID(),
        ],
      );
      await pool.query(
        `INSERT INTO ${schema}.authority_assignment(id,person_id,state,created_at,role_kind,activated_at,capabilities,authorization_version) VALUES($1,$2,'active',now(),'syndic',now(),ARRAY['dashboard.read','people-units-relationships.manage','invitations.manage'],1),($3,$4,'active',now(),'syndic',now(),ARRAY['dashboard.read'],1)`,
        [actorAuthorityId, actorPersonId, derivedAuthorityId, relatedPersonId],
      );
      await pool.query(
        `INSERT INTO burgoweb_global.account_tenant_memberships(id,account_id,tenant_id,person_id,authority_id,state,valid_from,authorization_version) VALUES($1,$2,$3,$4,$5,'active',now(),1),($6,$7,$3,$8,$9,'active',now(),1)`,
        [
          actorMembershipId,
          actorAccountId,
          tenantId,
          actorPersonId,
          actorAuthorityId,
          derivedMembershipId,
          derivedAccountId,
          relatedPersonId,
          derivedAuthorityId,
        ],
      );
      const context = Object.freeze({
        accountId: actorAccountId,
        personId: actorPersonId,
        membershipId: actorMembershipId,
        tenantId,
        publicId: tenantPublicId,
        schemaName: schema,
        displayName: "Integração institucional",
        timeZone: "America/Sao_Paulo",
        authorizationVersion: 1,
        capabilities: Object.freeze([
          "dashboard.read",
          "people-units-relationships.manage",
          "invitations.manage",
        ]),
      });
      const repository = new PostgresPeopleUnitsRepository(pool, 1);
      const person = await repository.createPerson(context, {
        fullName: "Ana Institucional",
        email: `ana-${suffix}@example.com`,
        idempotencyKey: "person-key",
        requestId: crypto.randomUUID(),
      });
      const replay = await repository.createPerson(context, {
        fullName: "Ana Institucional",
        email: `ana-${suffix}@example.com`,
        idempotencyKey: "person-key",
        requestId: crypto.randomUUID(),
      });
      expect(replay).toEqual(person);
      await pool.query(
        `UPDATE ${schema}.institutional_idempotency SET expires_at=now()-interval '1 second' WHERE account_id=$1 AND operation='person.create'`,
        [actorAccountId],
      );
      const afterExpiry = await repository.createPerson(context, {
        fullName: "Bruno Institucional",
        email: `bruno-${suffix}@example.com`,
        idempotencyKey: "person-key",
        requestId: crypto.randomUUID(),
      });
      expect(afterExpiry.fullName).toBe("Bruno Institucional");
      const raceEmail = `race-${suffix}@example.com`;
      const race = await Promise.allSettled([
        repository.createPerson(context, {
          fullName: "Corrida A",
          email: raceEmail,
          idempotencyKey: "race-a",
          requestId: crypto.randomUUID(),
        }),
        repository.createPerson(context, {
          fullName: "Corrida B",
          email: raceEmail,
          idempotencyKey: "race-b",
          requestId: crypto.randomUUID(),
        }),
      ]);
      expect(
        race.filter((result) => result.status === "fulfilled"),
      ).toHaveLength(1);
      expect(
        race.filter((result) => result.status === "rejected"),
      ).toHaveLength(1);
      expect(
        (
          await pool.query(
            `SELECT count(*)::int AS count FROM ${schema}.person WHERE email_normalized=$1`,
            [raceEmail],
          )
        ).rows[0].count,
      ).toBe(1);
      await expect(
        repository.createPerson(context, {
          fullName: "Duplicada",
          email: `ana-${suffix}@example.com`,
          idempotencyKey: "duplicate-key",
          requestId: crypto.randomUUID(),
        }),
      ).rejects.toMatchObject({
        current: { candidate: { publicId: person.publicId } },
      });
      const unit = await repository.createUnit(context, {
        identifier: "Casa 01",
        idempotencyKey: "unit-key",
        requestId: crypto.randomUUID(),
      });
      const relationship = await repository.createRelationship(context, {
        personPublicId: person.publicId,
        unitPublicId: unit.publicId,
        relationKind: "Morador",
        startsOn: "2026-08-01",
        idempotencyKey: "relationship-key",
        requestId: crypto.randomUUID(),
      });
      const invitationCodec=new HmacInvitationTokenCodec({currentVersion:'integration-v1',keys:{'integration-v1':'i'.repeat(32)}}),invitationRepository=new PostgresInvitationRepository(pool,invitationCodec,'integration-v1',{hash:async()=>({encodedHash:'$argon2id$integration',pepperVersion:'v1'}),verify:async()=>({valid:true,needsRehash:false})});
      const tokenFor=async(publicId:string)=>{const row=(await pool.query(`SELECT i.id invitation_id,o.id outbox_id,i.tenant_id,i.person_id,i.relationship_id,i.recipient_email_normalized email,i.created_at issued_at,i.key_version FROM burgoweb_global.invitations i JOIN burgoweb_global.invitation_outbox o ON o.invitation_id=i.id WHERE i.public_id=$1`,[publicId])).rows[0];return invitationCodec.derive({invitationId:row.invitation_id,outboxId:row.outbox_id,tenantId:row.tenant_id,personId:row.person_id,relationshipId:row.relationship_id,email:row.email,issuedAt:row.issued_at,keyVersion:row.key_version,purpose:'invitation'});};
      const invitation=await new CreateInvitation(invitationRepository).execute(context,{personPublicId:person.publicId,relationshipPublicId:relationship.publicId,email:`invited-${suffix}@example.com`,role:'resident',validForSeconds:3600,idempotencyKey:'invitation-key',confirmed:true,requestId:crypto.randomUUID()});
      expect(invitation).toMatchObject({state:'pending',deliveryState:'pending',version:1});
      expect((await pool.query(`SELECT invitation_token_hash FROM burgoweb_global.invitations WHERE public_id=$1`,[invitation.publicId])).rows[0].invitation_token_hash).toHaveLength(64);
      expect((await pool.query(`SELECT count(*)::int count FROM ${schema}.authority_assignment WHERE source_relationship_id=(SELECT id FROM ${schema}.person_unit_relationship WHERE public_id=$1) AND role_kind='resident'`,[relationship.publicId])).rows[0].count).toBe(0);
      const tokenRow=(await pool.query(`SELECT i.id invitation_id,o.id outbox_id,i.tenant_id,i.person_id,i.relationship_id,i.recipient_email_normalized email,i.created_at issued_at,i.key_version FROM burgoweb_global.invitations i JOIN burgoweb_global.invitation_outbox o ON o.invitation_id=i.id WHERE i.public_id=$1`,[invitation.publicId])).rows[0];
      const invitationToken=invitationCodec.derive({invitationId:tokenRow.invitation_id,outboxId:tokenRow.outbox_id,tenantId:tokenRow.tenant_id,personId:tokenRow.person_id,relationshipId:tokenRow.relationship_id,email:tokenRow.email,issuedAt:tokenRow.issued_at,keyVersion:tokenRow.key_version,purpose:'invitation'});
      const acceptanceRace=await Promise.allSettled([new AcceptInvitation(invitationRepository).execute({token:invitationToken,password:'senha segura de integração',requestId:crypto.randomUUID()}),new AcceptInvitation(invitationRepository).execute({token:invitationToken,password:'senha segura de integração',requestId:crypto.randomUUID()})]);
      expect(acceptanceRace.filter(result=>result.status==='fulfilled')).toHaveLength(1);expect(acceptanceRace.filter(result=>result.status==='rejected')).toHaveLength(1);expect((acceptanceRace.find(result=>result.status==='fulfilled') as PromiseFulfilledResult<any>).value).toMatchObject({state:'accepted',tenantPublicId,role:'resident'});
      expect((await pool.query(`SELECT count(*)::int count FROM ${schema}.authority_assignment WHERE source_relationship_id=(SELECT id FROM ${schema}.person_unit_relationship WHERE public_id=$1) AND role_kind='resident'`,[relationship.publicId])).rows[0].count).toBe(1);
      const invitedMembershipId=(await pool.query(`SELECT m.id FROM burgoweb_global.account_tenant_memberships m JOIN burgoweb_global.accounts a ON a.id=m.account_id WHERE a.email_normalized=$1 AND m.tenant_id=$2`,[`invited-${suffix}@example.com`,tenantId])).rows[0].id;
      const secondPerson=await repository.createPerson(context,{fullName:'Conselheira convidada',email:`councilor-${suffix}@example.com`,idempotencyKey:'second-person-key',requestId:crypto.randomUUID()});
      const secondUnit=await repository.createUnit(context,{identifier:'Casa 02',idempotencyKey:'second-unit-key',requestId:crypto.randomUUID()});
      const secondRelationship=await repository.createRelationship(context,{personPublicId:secondPerson.publicId,unitPublicId:secondUnit.publicId,relationKind:'Conselheiro',startsOn:'2026-08-01',idempotencyKey:'second-relationship-key',requestId:crypto.randomUUID()});
      const existingAccountId=crypto.randomUUID(),existingEmail=`existing-invited-${suffix}@example.com`;await pool.query(`INSERT INTO burgoweb_global.accounts(id,email_normalized,state,email_verified_at,created_at) VALUES($1,$2,'active',now(),now())`,[existingAccountId,existingEmail]);const existingInvitation=await new CreateInvitation(invitationRepository).execute(context,{personPublicId:secondPerson.publicId,relationshipPublicId:secondRelationship.publicId,email:existingEmail,role:'councilor',validForSeconds:3600,idempotencyKey:'existing-invitation-key',confirmed:true,requestId:crypto.randomUUID()});await expect(new AcceptInvitation(invitationRepository).execute({token:await tokenFor(existingInvitation.publicId),accountId:existingAccountId,requestId:crypto.randomUUID()})).resolves.toMatchObject({state:'accepted',role:'councilor'});
      const roleCapabilities=await pool.query(`SELECT role_kind,capabilities FROM ${schema}.authority_assignment WHERE source_relationship_id IN((SELECT id FROM ${schema}.person_unit_relationship WHERE public_id=$1),(SELECT id FROM ${schema}.person_unit_relationship WHERE public_id=$2)) ORDER BY role_kind`,[relationship.publicId,secondRelationship.publicId]);
      expect(roleCapabilities.rows).toEqual(expect.arrayContaining([
        expect.objectContaining({role_kind:'resident',capabilities:expect.arrayContaining(['dashboard.read','role.resident'])}),
        expect.objectContaining({role_kind:'councilor',capabilities:expect.arrayContaining(['dashboard.read','role.councilor'])}),
      ]));
      const incompatibleAccountId=crypto.randomUUID();await pool.query(`INSERT INTO burgoweb_global.accounts(id,email_normalized,state,email_verified_at,created_at) VALUES($1,$2,'active',now(),now())`,[incompatibleAccountId,`other-${suffix}@example.com`]);
      const incompatibleInvitation=await new CreateInvitation(invitationRepository).execute(context,{personPublicId:secondPerson.publicId,relationshipPublicId:secondRelationship.publicId,email:`expected-${suffix}@example.com`,role:'resident',validForSeconds:3600,idempotencyKey:'incompatible-invitation-key',confirmed:true,requestId:crypto.randomUUID()});
      await expect(new AcceptInvitation(invitationRepository).execute({token:await tokenFor(incompatibleInvitation.publicId),accountId:incompatibleAccountId,requestId:crypto.randomUUID()})).rejects.toThrow();
      expect((await pool.query(`SELECT state FROM burgoweb_global.invitations WHERE public_id=$1`,[incompatibleInvitation.publicId])).rows[0].state).toBe('pending');
      const duplicateAccountId=crypto.randomUUID(),duplicateEmail=`duplicate-${suffix}@example.com`;await pool.query(`INSERT INTO burgoweb_global.accounts(id,email_normalized,state,email_verified_at,created_at) VALUES($1,$2,'active',now(),now())`,[duplicateAccountId,duplicateEmail]);
      const duplicateInvitation=await new CreateInvitation(invitationRepository).execute(context,{personPublicId:person.publicId,relationshipPublicId:relationship.publicId,email:duplicateEmail,role:'councilor',validForSeconds:3600,idempotencyKey:'duplicate-account-invitation-key',confirmed:true,requestId:crypto.randomUUID()});
      await expect(new AcceptInvitation(invitationRepository).execute({token:await tokenFor(duplicateInvitation.publicId),accountId:duplicateAccountId,requestId:crypto.randomUUID()})).rejects.toThrow();
      expect((await pool.query(`SELECT count(*)::int count FROM burgoweb_global.account_tenant_memberships WHERE tenant_id=$1 AND person_id=(SELECT id FROM ${schema}.person WHERE public_id=$2) AND state='active'`,[tenantId,person.publicId])).rows[0].count).toBe(1);
      await expect(new AcceptInvitation(invitationRepository).execute({token:invitationToken,password:'outra senha segura',requestId:crypto.randomUUID()})).rejects.toThrow();
      const revokedInvitation=await new CreateInvitation(invitationRepository).execute(context,{personPublicId:person.publicId,relationshipPublicId:relationship.publicId,email:`revoked-${suffix}@example.com`,role:'administrative-assistant',validForSeconds:3600,idempotencyKey:'revoked-invitation-key',confirmed:true,requestId:crypto.randomUUID()});
      const revokedToken=await tokenFor(revokedInvitation.publicId);
      await pool.query(`UPDATE ${schema}.authority_assignment SET state='ended' WHERE id=$1`,[actorAuthorityId]);
      await expect(new AcceptInvitation(invitationRepository).execute({token:revokedToken,password:'senha segura de integração',requestId:crypto.randomUUID()})).rejects.toThrow();
      expect((await pool.query(`SELECT state FROM burgoweb_global.invitations WHERE public_id=$1`,[revokedInvitation.publicId])).rows[0].state).toBe('pending');
      await pool.query(`UPDATE ${schema}.authority_assignment SET state='active' WHERE id=$1`,[actorAuthorityId]);
      await invitationRepository.cancel(context,{publicId:revokedInvitation.publicId,expectedVersion:1,requestId:crypto.randomUUID()});
      await expect(new AcceptInvitation(invitationRepository).execute({token:revokedToken,password:'senha segura de integração',requestId:crypto.randomUUID()})).rejects.toThrow();

      const supersededInvitation=await new CreateInvitation(invitationRepository).execute(context,{personPublicId:person.publicId,relationshipPublicId:relationship.publicId,email:`superseded-${suffix}@example.com`,role:'administrative-assistant',validForSeconds:3600,idempotencyKey:'superseded-invitation-key',confirmed:true,requestId:crypto.randomUUID()});
      const supersededToken=await tokenFor(supersededInvitation.publicId);
      const replacement=await invitationRepository.reissue(context,{publicId:supersededInvitation.publicId,expectedVersion:1,idempotencyKey:'replacement-key',requestId:crypto.randomUUID()});
      await expect(new AcceptInvitation(invitationRepository).execute({token:supersededToken,password:'senha segura de integração',requestId:crypto.randomUUID()})).rejects.toThrow();
      await invitationRepository.cancel(context,{publicId:replacement.publicId,expectedVersion:1,requestId:crypto.randomUUID()});

      const expiredInvitation=await new CreateInvitation(invitationRepository).execute(context,{personPublicId:person.publicId,relationshipPublicId:relationship.publicId,email:`expired-${suffix}@example.com`,role:'administrative-assistant',validForSeconds:3600,idempotencyKey:'expired-invitation-key',confirmed:true,requestId:crypto.randomUUID()});
      const expiredToken=await tokenFor(expiredInvitation.publicId);
      await pool.query(`UPDATE burgoweb_global.invitations SET expires_at=now()-interval '1 second' WHERE public_id=$1`,[expiredInvitation.publicId]);
      await expect(new AcceptInvitation(invitationRepository).execute({token:expiredToken,password:'senha segura de integração',requestId:crypto.randomUUID()})).rejects.toThrow();
      await expect(invitationRepository.cancel(context,{publicId:expiredInvitation.publicId,expectedVersion:1,requestId:crypto.randomUUID()})).rejects.toThrow('não está mais pendente');
      expect((await pool.query(`SELECT state FROM burgoweb_global.invitations WHERE public_id=$1`,[expiredInvitation.publicId])).rows[0].state).toBe('expired');

      const rollbackInvitation=await new CreateInvitation(invitationRepository).execute(context,{personPublicId:person.publicId,relationshipPublicId:relationship.publicId,email:`rollback-${suffix}@example.com`,role:'administrative-assistant',validForSeconds:3600,idempotencyKey:'rollback-invitation-key',confirmed:true,requestId:crypto.randomUUID()});const failingRepository=new PostgresInvitationRepository(pool,invitationCodec,'integration-v1',{hash:async()=>({encodedHash:'$argon2id$integration',pepperVersion:'v1'}),verify:async()=>({valid:true,needsRehash:false})},()=>new Date(),stage=>{if(stage==='accept.after-authority')throw new Error(stage);});await expect(new AcceptInvitation(failingRepository).execute({token:await tokenFor(rollbackInvitation.publicId),password:'senha segura de integração',requestId:crypto.randomUUID()})).rejects.toThrow('accept.after-authority');expect((await pool.query(`SELECT state FROM burgoweb_global.invitations WHERE public_id=$1`,[rollbackInvitation.publicId])).rows[0].state).toBe('pending');expect((await pool.query(`SELECT count(*)::int count FROM burgoweb_global.accounts WHERE email_normalized=$1`,[`rollback-${suffix}@example.com`])).rows[0].count).toBe(0);
      const generatedPublicId = await pool.query(
        `INSERT INTO ${schema}.person(id,full_name,state,version,created_at) VALUES($1,'ID público automático','active',1,now()) RETURNING public_id`,
        [crypto.randomUUID()],
      );
      expect(generatedPublicId.rows[0].public_id).toBeTruthy();
      await pool.query(
        `UPDATE ${schema}.authority_assignment SET person_id=(SELECT id FROM ${schema}.person WHERE public_id=$1) WHERE id=$2`,
        [person.publicId, derivedAuthorityId],
      );
      await pool.query(
        `UPDATE burgoweb_global.account_tenant_memberships SET state='ended',valid_until=now() WHERE id=$1`,
        [invitedMembershipId],
      );
      await pool.query(
        `UPDATE burgoweb_global.account_tenant_memberships SET person_id=(SELECT id FROM ${schema}.person WHERE public_id=$1) WHERE id=$2`,
        [person.publicId, derivedMembershipId],
      );
      await repository.linkAuthorizationSource(
        context,
        relationship.publicId,
        derivedAuthorityId,
        derivedMembershipId,
      );
      await pool.query(
        `UPDATE ${schema}.authority_assignment SET state='pending_verification' WHERE id=$1`,
        [derivedAuthorityId],
      );
      const otherTenantId = crypto.randomUUID(),
        otherTenantPublicId = crypto.randomUUID(),
        otherMembershipId = crypto.randomUUID();
      const otherSchema = `tenant_${crypto.randomUUID().replaceAll("-", "")}`;
      await new PostgresTenantMigrator(pool).createAndMigrate(otherSchema);
      await pool.query(
        `INSERT INTO burgoweb_global.tenant_registry(id,public_id,schema_name,display_name,state,migration_version,created_at) VALUES($1,$2,$3,'Outro tenant','active',5,now())`,
        [otherTenantId, otherTenantPublicId, otherSchema],
      );
      await pool.query(
        `INSERT INTO burgoweb_global.account_tenant_memberships(id,account_id,tenant_id,person_id,authority_id,state,valid_from,authorization_version) VALUES($1,$2,$3,$4,$5,'active',now(),1)`,
        [
          otherMembershipId,
          derivedAccountId,
          otherTenantId,
          relatedPersonId,
          crypto.randomUUID(),
        ],
      );
      const updated = await repository.updateRelationship(context, {
        publicId: relationship.publicId,
        relationKind: "Ocupante",
        startsOn: "2026-08-01",
        expectedVersion: 1,
        requestId: crypto.randomUUID(),
      });
      expect(updated).toMatchObject({
        personPublicId: person.publicId,
        unitPublicId: unit.publicId,
        version: 2,
      });
      await expect(
        repository.updateRelationship(context, {
          publicId: relationship.publicId,
          relationKind: "Obsoleto",
          startsOn: "2026-08-01",
          expectedVersion: 1,
          requestId: crypto.randomUUID(),
        }),
      ).rejects.toMatchObject({
        current: {
          publicId: relationship.publicId,
          personPublicId: person.publicId,
          unitPublicId: unit.publicId,
          version: 2,
        },
      });
      const ended = await repository.endRelationship(context, {
        publicId: relationship.publicId,
        effectiveOn: "2026-09-01",
        expectedVersion: 2,
        requestId: crypto.randomUUID(),
      });
      expect(ended).toMatchObject({
        personPublicId: person.publicId,
        unitPublicId: unit.publicId,
        state: "ended",
        version: 3,
      });
      expect(
        (
          await pool.query(
            `SELECT state FROM ${schema}.authority_assignment WHERE id=$1`,
            [derivedAuthorityId],
          )
        ).rows[0].state,
      ).toBe("ended");
      expect((await pool.query(`SELECT state FROM burgoweb_global.account_tenant_memberships WHERE id=$1`,[invitedMembershipId])).rows[0].state).toBe('ended');
      expect(
        (
          await pool.query(
            `SELECT state FROM burgoweb_global.account_tenant_memberships WHERE id=$1`,
            [derivedMembershipId],
          )
        ).rows[0].state,
      ).toBe("ended");
      expect(
        (
          await pool.query(
            `SELECT state FROM burgoweb_global.account_tenant_memberships WHERE id=$1`,
            [actorMembershipId],
          )
        ).rows[0].state,
      ).toBe("active");
      expect(
        (
          await pool.query(
            `SELECT state FROM burgoweb_global.account_tenant_memberships WHERE id=$1`,
            [otherMembershipId],
          )
        ).rows[0].state,
      ).toBe("active");
      expect(
        await new PostgresIdentityRepository(
          pool,
          "i".repeat(32),
        ).resolveContext(
          derivedAccountId,
          tenantPublicId,
          new Date(),
          "dashboard.read",
          crypto.randomUUID(),
        ),
      ).toBeUndefined();
      await expect(
        repository.linkAuthorizationSource(
          context,
          relationship.publicId,
          derivedAuthorityId,
          derivedMembershipId,
        ),
      ).rejects.toBeInstanceOf(InstitucionalConflict);
      const audit = await pool.query(
        `SELECT before_value,after_value FROM ${schema}.institutional_audit_event WHERE target_kind='relationship' ORDER BY occurred_at`,
      );
      expect(JSON.stringify(audit.rows)).not.toMatch(
        /person_id|unit_id|created_by/,
      );
    }, 30_000);

    it("inicia o composition root fail-closed e atende pela API NestJS real", async () => {
      const databaseUrl =
        externalDatabaseUrl ??
        `postgres://burgoweb:test-only-password@${container.getHost()}:${container.getMappedPort(5432)}/burgoweb_test`;
      const { app } = await createProductionApplication({
        BURGOWEB_DATABASE_URL: databaseUrl,
        BURGOWEB_PASSWORD_PEPPER: "p".repeat(32),
        BURGOWEB_PASSWORD_PEPPER_VERSION: "integration-v1",
        BURGOWEB_SESSION_SECRET: "s".repeat(32),
        BURGOWEB_RATE_LIMIT_KEY: "r".repeat(32),
        BURGOWEB_API_PORT: "3101",
        BURGOWEB_VERIFICATION_BASE_URL: "https://app.example.com",
        BURGOWEB_VERIFICATION_TOKEN_KEY: "k".repeat(32),
        BURGOWEB_VERIFICATION_TOKEN_KEY_VERSION: "integration-v1",
        BURGOWEB_RECOVERY_TOKEN_KEY: "q".repeat(32),
        BURGOWEB_RECOVERY_TOKEN_KEY_VERSION: "integration-v1",
        BURGOWEB_INVITATION_TOKEN_KEY: "i".repeat(32),
        BURGOWEB_INVITATION_TOKEN_KEY_VERSION: "integration-v1",
      });
      try {
        const response = await app
          .getHttpAdapter()
          .getInstance()
          .inject({
            method: "POST",
            url: "/api/v1/provisioning/condominiums",
            headers: {
              "idempotency-key": "production-composition-key",
              "sec-fetch-site": "same-origin",
            },
            payload: {
              fullName: "Produção Teste",
              email: "production@example.com",
              condominiumName: "Composition Root",
              password: "senha longa do composition root",
              authorityDeclarationAccepted: true,
            },
          });
        expect(response.statusCode, response.body).toBe(202);
        const pending = response.json();
        expect(pending).toMatchObject({ state: "pending-email-verification" });
        expect(response.body).not.toMatch(/password|hash|pepper|schema/i);
        const stored = await pool.query(
          `select vt.*,eo.status as outbox_status from burgoweb_global.verification_tokens vt join burgoweb_global.email_outbox eo on eo.id=vt.outbox_id where vt.request_id=$1`,
          [pending.requestId],
        );
        expect(stored.rowCount).toBe(1);
        expect(stored.rows[0]).toMatchObject({
          outbox_status: "pending",
          purpose: "email-verification",
        });
        const codec = new HmacVerificationTokenCodec({
          currentVersion: "integration-v1",
          keys: { "integration-v1": "k".repeat(32) },
        });
        const row = stored.rows[0];
        const previousToken = codec.derive({
          verificationId: row.id,
          outboxId: row.outbox_id,
          accountId: row.account_id,
          requestId: row.request_id,
          purpose: row.purpose,
          keyVersion: row.key_version,
          issuedAt: row.issued_at,
        });
        expect(codec.hash(previousToken)).toBe(row.token_hash.trim());
        const headers = {
          origin: "https://app.example.com",
          "sec-fetch-site": "same-origin",
        };
        expect(
          (
            await app
              .getHttpAdapter()
              .getInstance()
              .inject({
                method: "POST",
                url: "/api/v1/email-verifications/resend",
                headers,
                payload: {
                  requestId: pending.requestId,
                  email: "production@example.com",
                },
              })
          ).statusCode,
        ).toBe(202);
        expect(
          (
            await app
              .getHttpAdapter()
              .getInstance()
              .inject({
                method: "POST",
                url: "/api/v1/email-verifications/confirm",
                headers,
                payload: { token: previousToken },
              })
          ).statusCode,
        ).toBe(410);
        const current = (
          await pool.query(
            `select * from burgoweb_global.verification_tokens where request_id=$1 and cancelled_at is null order by issued_at desc limit 1`,
            [pending.requestId],
          )
        ).rows[0];
        const token = codec.derive({
          verificationId: current.id,
          outboxId: current.outbox_id,
          accountId: current.account_id,
          requestId: current.request_id,
          purpose: current.purpose,
          keyVersion: current.key_version,
          issuedAt: current.issued_at,
        });
        expect(
          (
            await pool.query(
              `select count(*)::int as count from burgoweb_global.verification_tokens where request_id=$1`,
              [pending.requestId],
            )
          ).rows[0].count,
        ).toBe(2);
        const outbox = new PostgresVerificationOutbox(pool);
        const [claimA, claimB] = await Promise.all([
          outbox.claim("worker-a", new Date(), 30),
          outbox.claim("worker-b", new Date(), 30),
        ]);
        const claims = [claimA, claimB].filter(
          (claim): claim is NonNullable<typeof claim> => Boolean(claim),
        );
        expect(new Set(claims.map((claim) => claim.outboxId)).size).toBe(
          claims.length,
        );
        if (claims[0]) {
          expect(await outbox.renew(claims[0], new Date(), 60)).toBe(true);
          await pool.query(
            `update burgoweb_global.email_outbox set leased_until=now()-interval '1 second' where id=$1`,
            [claims[0].outboxId],
          );
          const recovered = await outbox.claim(
            "worker-recovery",
            new Date(),
            30,
          );
          expect(recovered?.outboxId).toBe(claims[0].outboxId);
          await outbox.finish(
            recovered!,
            { kind: "accepted", providerReference: "integration-provider" },
            new Date(),
          );
        }
        if (claims[1]) {
          await outbox.finish(
            claims[1],
            { kind: "ambiguous", code: "provider-timeout" },
            new Date(),
          );
          expect(
            (
              await pool.query(
                `select status from burgoweb_global.email_outbox where id=$1`,
                [claims[1].outboxId],
              )
            ).rows[0].status,
          ).toBe("ambiguous");
        }
        const confirmations = await Promise.all([
          new PostgresVerificationRepository(pool).confirm(
            codec.hash(token),
            new Date(),
          ),
          new PostgresVerificationRepository(pool).confirm(
            codec.hash(token),
            new Date(),
          ),
        ]);
        expect(confirmations.filter(Boolean)).toHaveLength(1);
        expect(
          (
            await app
              .getHttpAdapter()
              .getInstance()
              .inject({
                method: "POST",
                url: "/api/v1/email-verifications/confirm",
                headers,
                payload: { token },
              })
          ).statusCode,
        ).toBe(410);
        const activated = await pool.query(
          `select a.state,a.email_verified_at,tr.state as tenant_state,pa.state as authority_state,tr.schema_name from burgoweb_global.provisioning_requests pr join burgoweb_global.accounts a on a.id=pr.account_id join burgoweb_global.tenant_registry tr on tr.id=pr.tenant_id join burgoweb_global.pending_authorities pa on pa.request_id=pr.id where pr.id=$1`,
          [pending.requestId],
        );
        expect(activated.rows[0]).toMatchObject({
          state: "active",
          tenant_state: "active",
          authority_state: "active",
          email_verified_at: expect.any(Date),
        });
        expect(
          (
            await pool.query(
              `select state from ${activated.rows[0].schema_name}.authority_assignment`,
            )
          ).rows[0].state,
        ).toBe("active");
        expect(
          (
            await pool.query(
              `select count(*)::int as count from burgoweb_global.audit_events where request_id=$1 and event_type='email-verification.activated'`,
              [pending.requestId],
            )
          ).rows[0].count,
        ).toBe(1);
        expect(
          (
            await pool.query(
              `select count(*)::int as count from burgoweb_global.verification_tokens where request_id=$1 and used_at is not null`,
              [pending.requestId],
            )
          ).rows[0].count,
        ).toBe(1);
        const login = await app
          .getHttpAdapter()
          .getInstance()
          .inject({
            method: "POST",
            url: "/api/v1/auth/sessions",
            headers,
            payload: {
              email: "production@example.com",
              password: "senha longa do composition root",
            },
          });
        expect(login.statusCode, login.body).toBe(201);
        const sessionCookie = String(login.headers["set-cookie"]).split(";")[0];
        expect(
          (
            await pool.query(
              `select event_type from burgoweb_global.audit_events where request_id=$1 order by event_type`,
              [login.headers["x-request-id"]],
            )
          ).rows.map((row) => row.event_type),
        ).toEqual(["login.accepted", "session.created"]);
        const sessionState = await pool.query(
          `select id,last_seen_at from burgoweb_global.sessions order by created_at desc limit 1`,
        );
        const originalLastSeen = sessionState.rows[0].last_seen_at;
        const refreshed = await app
          .getHttpAdapter()
          .getInstance()
          .inject({
            method: "GET",
            url: "/api/v1/auth/session",
            headers: { cookie: sessionCookie },
          });
        expect(refreshed.statusCode, refreshed.body).toBe(200);
        const csrf = refreshed.json().csrfToken;
        expect(
          (
            await pool.query(
              `select count(*)::int as count from burgoweb_global.session_csrf_tokens where session_id=$1`,
              [sessionState.rows[0].id],
            )
          ).rows[0].count,
        ).toBe(1);
        expect(
          (
            await pool.query(
              `select last_seen_at from burgoweb_global.sessions where id=$1`,
              [sessionState.rows[0].id],
            )
          ).rows[0].last_seen_at,
        ).toEqual(originalLastSeen);
        await pool.query(
          `update burgoweb_global.sessions set last_seen_at=now()-interval '6 minutes' where id=$1`,
          [sessionState.rows[0].id],
        );
        const beforeThrottledTouch = (
          await pool.query(
            `select last_seen_at from burgoweb_global.sessions where id=$1`,
            [sessionState.rows[0].id],
          )
        ).rows[0].last_seen_at;
        const tenants = await app
          .getHttpAdapter()
          .getInstance()
          .inject({
            method: "GET",
            url: "/api/v1/tenants",
            headers: { cookie: sessionCookie },
          });
        expect(tenants.statusCode, tenants.body).toBe(200);
        expect(tenants.json()).toEqual([
          {
            publicId: pending.publicCondominiumId,
            displayName: "Composition Root",
            timeZone: "America/Sao_Paulo",
          },
        ]);
        expect(
          (
            await pool.query(
              `select last_seen_at from burgoweb_global.sessions where id=$1`,
              [sessionState.rows[0].id],
            )
          ).rows[0].last_seen_at.getTime(),
        ).toBeGreaterThan(beforeThrottledTouch.getTime());
        const dashboard = await app
          .getHttpAdapter()
          .getInstance()
          .inject({
            method: "GET",
            url: `/api/v1/tenants/${pending.publicCondominiumId}/dashboard`,
            headers: { cookie: sessionCookie },
          });
        expect(dashboard.statusCode, dashboard.body).toBe(200);
        expect(dashboard.json().state).toBe("empty");
        const denied = await app
          .getHttpAdapter()
          .getInstance()
          .inject({
            method: "GET",
            url: "/api/v1/tenants/11111111-1111-4111-8111-111111111111/dashboard",
            headers: { cookie: sessionCookie },
          });
        expect(denied.statusCode).toBe(404);
        expect(
          (
            await pool.query(
              `select count(*)::int as count from burgoweb_global.audit_events where request_id=$1 and event_type='tenant.access-denied'`,
              [denied.headers["x-request-id"]],
            )
          ).rows[0].count,
        ).toBe(1);
        await pool.query(
          `update burgoweb_global.account_tenant_memberships set state='suspended',authorization_version=authorization_version+1 where account_id=(select account_id from burgoweb_global.provisioning_requests where id=$1)`,
          [pending.requestId],
        );
        expect(
          (
            await app
              .getHttpAdapter()
              .getInstance()
              .inject({
                method: "GET",
                url: `/api/v1/tenants/${pending.publicCondominiumId}/dashboard`,
                headers: { cookie: sessionCookie },
              })
          ).statusCode,
        ).toBe(404);
        await pool.query(
          `update burgoweb_global.account_tenant_memberships set state='active',authorization_version=authorization_version+1 where tenant_id=(select tenant_id from burgoweb_global.provisioning_requests where id=$1)`,
          [pending.requestId],
        );
        await pool.query(
          `update ${activated.rows[0].schema_name}.authority_assignment set capabilities='{}',authorization_version=authorization_version+1`,
        );
        expect(
          (
            await app
              .getHttpAdapter()
              .getInstance()
              .inject({
                method: "GET",
                url: `/api/v1/tenants/${pending.publicCondominiumId}/dashboard`,
                headers: { cookie: sessionCookie },
              })
          ).statusCode,
        ).toBe(404);
        await pool.query(
          `update ${activated.rows[0].schema_name}.authority_assignment set capabilities=ARRAY['dashboard.read'],authorization_version=authorization_version+1`,
        );
        expect(
          (
            await app
              .getHttpAdapter()
              .getInstance()
              .inject({
                method: "GET",
                url: `/api/v1/tenants/${pending.publicCondominiumId}/dashboard`,
                headers: { cookie: sessionCookie },
              })
          ).statusCode,
        ).toBe(200);
        expect(
          (
            await app
              .getHttpAdapter()
              .getInstance()
              .inject({
                method: "DELETE",
                url: "/api/v1/auth/session",
                headers: {
                  ...headers,
                  cookie: sessionCookie,
                  "x-csrf-token": csrf,
                },
              })
          ).statusCode,
        ).toBe(204);
        expect(
          (
            await app
              .getHttpAdapter()
              .getInstance()
              .inject({
                method: "GET",
                url: "/api/v1/tenants",
                headers: { cookie: sessionCookie },
              })
          ).statusCode,
        ).toBe(401);
      } finally {
        await app.close();
      }
    }, 20_000);
  });
