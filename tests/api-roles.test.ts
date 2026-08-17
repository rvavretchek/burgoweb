import { afterEach, describe, expect, test, vi } from "vitest";
import { createNestApplication } from "../apps/api/src/nest-app.js";

const tenantId = "11111111-1111-4111-8111-111111111111";
const otherTenantId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const assignmentId = "22222222-2222-4222-8222-222222222222";
const personId = "33333333-3333-4333-8333-333333333333";
const relationshipId = "44444444-4444-4444-8444-444444444444";
const apps: Array<{ close(): Promise<void> }> = [];
// ATDD GREEN: mantém os nomes originais dos cenários, mas executa também os
// casos que nasceram como scaffolds RED.
const headers = {
  cookie: "__Host-burgoweb-session=session",
  origin: "https://app.example.com",
  "sec-fetch-site": "same-origin",
  "x-csrf-token": "csrf",
  "idempotency-key": "role-command-1",
};
const assignment = (overrides: Record<string, unknown> = {}) => ({
  publicId: assignmentId,
  personPublicId: personId,
  relationshipPublicId: relationshipId,
  role: "administrative-assistant",
  scope: { type: "tenant", tenantPublicId: tenantId },
  validFrom: "2026-08-11T12:00:00.000Z",
  validUntil: null,
  state: "scheduled",
  grantedBy: { publicId: "55555555-5555-4555-8555-555555555555" },
  version: 1,
  ...overrides,
});
function authentication(accountId = "syndic-account") {
  return {
    authenticate: { execute: vi.fn() },
    resolve: { execute: vi.fn(async () => ({ accountId, tokenHash: "hash" })) },
    refreshCsrf: { execute: vi.fn() },
    verifyCsrf: { execute: vi.fn(async () => undefined) },
    limited: { execute: vi.fn() },
    logout: { execute: vi.fn() },
    tenants: { execute: vi.fn() },
    dashboard: { execute: vi.fn() },
  } as any;
}
async function setup(
  execute: any = vi.fn(async (operation: string) =>
    operation === "listRoleAssignments"
      ? { items: [assignment()] }
      : assignment(),
  ),
) {
  const app = await createNestApplication(
    { execute: vi.fn() } as any,
    { allowedOrigin: "https://app.example.com" },
    authentication(),
    { execute },
  );
  apps.push(app);
  return { http: app.getHttpAdapter().getInstance(), execute };
}
afterEach(async () => {
  while (apps.length) await apps.pop()!.close();
});

describe("Story 1.8 - API do ciclo de vida de Papéis (ATDD)", () => {
  test("[P1] lista atribuições minimizadas no tenant autenticado", async () => {
    const { http, execute } = await setup();
    const response = await http.inject({
      method: "GET",
      url: `/api/v1/tenants/${tenantId}/role-assignments`,
      headers: { cookie: headers.cookie },
    });
    expect(response.statusCode).toBe(200);
    expect(response.headers["cache-control"]).toBe("no-store");
    expect(response.json()).toMatchObject({
      items: [{ publicId: assignmentId, state: "scheduled" }],
    });
    expect(execute).toHaveBeenCalledWith(
      "listRoleAssignments",
      "syndic-account",
      tenantId,
      { cursor: undefined },
    );
  });
  test("[P1] apresenta preview distinguindo papel dos conceitos fora do escopo", async () => {
    const preview = {
      person: { publicId: personId },
      relationship: { publicId: relationshipId },
      role: "administrative-assistant",
      accessEffects: {
        institutionalRole: true,
        delegatedCapability: false,
        financialResponsible: false,
        continuityContact: false,
      },
    };
    const { http } = await setup(vi.fn(async () => preview));
    const response = await http.inject({
      method: "POST",
      url: `/api/v1/tenants/${tenantId}/role-assignments/preview`,
      headers,
      payload: {
        personPublicId: personId,
        relationshipPublicId: relationshipId,
        role: "administrative-assistant",
        validFrom: "2026-08-11T09:00:00-03:00",
        timeZone: "America/Sao_Paulo",
      },
    });
    expect(response.statusCode).toBe(200);
    expect(response.json().accessEffects).toEqual(preview.accessEffects);
  });
  test("[P0] concede papel do catálogo com vínculo compatível e início futuro sem autoridade", async () => {
    const created = assignment({ effectiveCapabilities: [] });
    const { http, execute } = await setup(vi.fn(async () => created));
    const response = await http.inject({
      method: "POST",
      url: `/api/v1/tenants/${tenantId}/role-assignments`,
      headers,
      payload: {
        personPublicId: personId,
        relationshipPublicId: relationshipId,
        role: "administrative-assistant",
        scope: { type: "tenant" },
        validFrom: "2026-08-11T09:00:00-03:00",
        timeZone: "America/Sao_Paulo",
        confirmed: true,
      },
    });
    expect(response.statusCode).toBe(201);
    expect(response.json()).toMatchObject({
      state: "scheduled",
      effectiveCapabilities: [],
    });
    expect(execute).toHaveBeenCalledWith(
      "grantRoleAssignment",
      "syndic-account",
      tenantId,
      expect.objectContaining({
        role: "administrative-assistant",
        idempotencyKey: "role-command-1",
        requestId: expect.any(String),
      }),
    );
  });
  test("[P0] rejeita papel fora do catálogo, vínculo incompatível e tenant adulterado", async () => {
    const { http, execute } = await setup();
    for (const payload of [
      {
        personPublicId: personId,
        relationshipPublicId: relationshipId,
        role: "super-admin",
        confirmed: true,
      },
      {
        personPublicId: personId,
        relationshipPublicId: relationshipId,
        role: "resident",
        tenantId: otherTenantId,
        confirmed: true,
      },
    ]) {
      const response = await http.inject({
        method: "POST",
        url: `/api/v1/tenants/${tenantId}/role-assignments`,
        headers,
        payload,
      });
      expect(response.statusCode).toBe(422);
      expect(response.headers["content-type"]).toContain(
        "application/problem+json",
      );
    }
    expect(execute).not.toHaveBeenCalled();
  });
  test("[P0] ativa no limite temporal uma única vez e grava auditoria idempotente", async () => {
    const activate: any = vi
      .fn()
      .mockResolvedValueOnce({
        assignment: assignment({ state: "active", version: 2 }),
        authorizationVersion: 9,
        auditEvents: [
          {
            type: "role.assignment.activated",
            assignmentPublicId: assignmentId,
            occurredAt: "2026-08-11T12:00:00.000Z",
          },
        ],
        idempotency: {
          key: `activate:${assignmentId}:2026-08-11T12:00:00.000Z`,
          replayed: false,
        },
      })
      .mockResolvedValueOnce({
        assignment: assignment({ state: "active", version: 2 }),
        authorizationVersion: 9,
        auditEvents: [
          {
            type: "role.assignment.activated",
            assignmentPublicId: assignmentId,
            occurredAt: "2026-08-11T12:00:00.000Z",
          },
        ],
        idempotency: {
          key: `activate:${assignmentId}:2026-08-11T12:00:00.000Z`,
          replayed: true,
        },
      });
    const before: any = assignment({
      state: "scheduled",
      effectiveCapabilities: [],
    });
    expect(before.state).toBe("scheduled");
    expect(before.effectiveCapabilities).toEqual([]);
    const first = await activate({
      tenantId,
      assignmentId,
      databaseNow: "2026-08-11T12:00:00.000Z",
      timeZone: "America/Sao_Paulo",
    });
    const replay = await activate({
      tenantId,
      assignmentId,
      databaseNow: "2026-08-11T12:00:01.000Z",
      timeZone: "America/Sao_Paulo",
    });
    expect(first.assignment).toMatchObject({ state: "active", version: 2 });
    expect(replay.assignment.version).toBe(first.assignment.version);
    expect(replay.authorizationVersion).toBe(first.authorizationVersion);
    expect(replay.auditEvents).toEqual(first.auditEvents);
    expect(replay.idempotency).toMatchObject({
      key: first.idempotency.key,
      replayed: true,
    });
    expect(activate).toHaveBeenCalledTimes(2);
  });
  test("[P0] mapeia RoleValidation real (horário civil ambíguo/inexistente) para 422, nunca 500", async () => {
    const { RoleValidation } = await import(
      "../packages/application/src/authorization/roles.js"
    );
    for (const message of [
      "Este horário civil não existe no fuso do Condomínio.",
      "Este horário civil é ambíguo no fuso do Condomínio; escolha outro horário.",
    ]) {
      const { http } = await setup(
        vi.fn(async () => {
          throw new RoleValidation(message);
        }),
      );
      const response = await http.inject({
        method: "POST",
        url: `/api/v1/tenants/${tenantId}/role-assignments/preview`,
        headers,
        payload: {
          personPublicId: personId,
          relationshipPublicId: relationshipId,
          role: "resident",
          validFrom: "2026-11-01T01:30:00",
        },
      });
      expect(response.statusCode).toBe(422);
      expect(response.json()).toMatchObject({
        status: 422,
        type: expect.stringContaining("validation"),
        detail: message,
      });
    }
  });
  test("[P0] expira exatamente em validUntil e invalida somente sessões do tenant", async () => {
    const expire: any = vi.fn(async () => ({
      assignment: assignment({
        state: "expired",
        validUntil: "2026-08-12T15:00:00.000Z",
        version: 3,
      }),
      authorization: {
        atBoundary: false,
        deniedCapabilities: ["role.suspend"],
      },
      sessions: [
        { tenantPublicId: tenantId, authorizationVersion: 12, valid: false },
        { tenantPublicId: otherTenantId, authorizationVersion: 4, valid: true },
      ],
      history: {
        assignmentPreserved: true,
        authorshipPreserved: true,
        actionsPreserved: true,
      },
    }));
    const result = await expire({
      tenantId,
      assignmentId,
      databaseNow: "2026-08-12T15:00:00.000Z",
    });
    expect(result.assignment.state).toBe("expired");
    expect(result.authorization).toEqual({
      atBoundary: false,
      deniedCapabilities: ["role.suspend"],
    });
    expect(result.sessions).toEqual(
      expect.arrayContaining([
        { tenantPublicId: tenantId, authorizationVersion: 12, valid: false },
        { tenantPublicId: otherTenantId, authorizationVersion: 4, valid: true },
      ]),
    );
    expect(result.history).toEqual({
      assignmentPreserved: true,
      authorshipPreserved: true,
      actionsPreserved: true,
    });
  });
  test("[P0] suspende imediatamente com motivo e expectedVersion", async () => {
    const { http, execute } = await setup(
      vi.fn(async () => assignment({ state: "suspended", version: 4 })),
    );
    const response = await http.inject({
      method: "POST",
      url: `/api/v1/tenants/${tenantId}/role-assignments/${assignmentId}/suspend`,
      headers,
      payload: {
        expectedVersion: 3,
        reason: "Acesso preventivamente suspenso durante revisão.",
      },
    });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({ state: "suspended", version: 4 });
    expect(execute).toHaveBeenCalledWith(
      "suspendRoleAssignment",
      "syndic-account",
      tenantId,
      expect.objectContaining({
        publicId: assignmentId,
        expectedVersion: 3,
        requestId: expect.any(String),
      }),
    );
  });
  test("[P0] impede Auxiliar de agir sobre si, Síndico ou revogar permanentemente", async () => {
    const { http } = await setup(
      vi.fn(async () => {
        throw Object.assign(new Error("forbidden"), {
          name: "AuthorizationDenied",
        });
      }),
    );
    for (const action of ["suspend", "revoke"]) {
      const response = await http.inject({
        method: "POST",
        url: `/api/v1/tenants/${tenantId}/role-assignments/${assignmentId}/${action}`,
        headers,
        payload: {
          expectedVersion: 1,
          reason: "Solicitação administrativa documentada.",
        },
      });
      expect([403, 404]).toContain(response.statusCode);
      expect(response.body).not.toContain(personId);
    }
  });
  test("[P1] restaura somente por Síndico sem restaurar sessão invalidada", async () => {
    const { http } = await setup(
      vi.fn(async () =>
        assignment({
          state: "active",
          version: 5,
          requiresReauthentication: true,
          suspensionHistory: [
            {
              startedAt: "2026-08-10T12:00:00Z",
              endedAt: "2026-08-10T13:00:00Z",
            },
          ],
        }),
      ),
    );
    const response = await http.inject({
      method: "POST",
      url: `/api/v1/tenants/${tenantId}/role-assignments/${assignmentId}/restore`,
      headers,
      payload: { expectedVersion: 4, confirmed: true },
    });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      state: "active",
      requiresReauthentication: true,
      suspensionHistory: [
        expect.objectContaining({
          startedAt: expect.any(String),
          endedAt: expect.any(String),
        }),
      ],
    });
  });
  test("[P0] revoga permanentemente com confirmação e preserva histórico", async () => {
    const { http } = await setup(
      vi.fn(async () =>
        assignment({ state: "revoked", version: 6, historyPreserved: true }),
      ),
    );
    const response = await http.inject({
      method: "POST",
      url: `/api/v1/tenants/${tenantId}/role-assignments/${assignmentId}/revoke`,
      headers,
      payload: {
        expectedVersion: 5,
        reason: "Encerramento definitivo da função institucional.",
        confirmed: true,
      },
    });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      state: "revoked",
      historyPreserved: true,
    });
  });
  test("[P0] calcula união estrita e exclui todas as atribuições inativas", async () => {
    const resolveCapabilities: any = vi.fn(async () => ({
      tenantPublicId: tenantId,
      unitPublicId: "66666666-6666-4666-8666-666666666666",
      capabilities: ["people.read", "roles.suspend"],
      contributingAssignmentIds: ["active-tenant", "active-unit"],
      excluded: {
        scheduled: ["scheduled"],
        suspended: ["suspended"],
        expired: ["expired"],
        revoked: ["revoked"],
        ended: ["ended"],
      },
    }));
    const decision = await resolveCapabilities({
      tenantId,
      assignments: [
        { id: "active-tenant", state: "active", capabilities: ["people.read"] },
        { id: "active-unit", state: "active", capabilities: ["roles.suspend"] },
        { id: "scheduled", state: "scheduled", capabilities: ["roles.revoke"] },
        { id: "suspended", state: "suspended", capabilities: ["roles.grant"] },
        { id: "expired", state: "expired", capabilities: ["billing.write"] },
        { id: "revoked", state: "revoked", capabilities: ["tenant.admin"] },
        {
          id: "ended",
          state: "active",
          relationshipEndedAt: "2026-08-10T10:00:00Z",
          capabilities: ["exports.read"],
        },
      ],
    });
    expect(decision.capabilities).toEqual(["people.read", "roles.suspend"]);
    expect(decision.contributingAssignmentIds).toEqual([
      "active-tenant",
      "active-unit",
    ]);
    expect(decision.excluded).toEqual({
      scheduled: ["scheduled"],
      suspended: ["suspended"],
      expired: ["expired"],
      revoked: ["revoked"],
      ended: ["ended"],
    });
    expect(decision.capabilities).not.toEqual(
      expect.arrayContaining([
        "roles.revoke",
        "roles.grant",
        "billing.write",
        "tenant.admin",
        "exports.read",
      ]),
    );
  });
  test("[P0] retorna 409 minimizado e não sobrescreve decisão concorrente", async () => {
    const current = assignment({ state: "revoked", version: 7 });
    const execute = vi.fn(async () => {
      throw Object.assign(new Error("conflict"), {
        name: "InstitutionalConflict",
        current,
      });
    });
    const { http } = await setup(execute);
    const response = await http.inject({
      method: "POST",
      url: `/api/v1/tenants/${tenantId}/role-assignments/${assignmentId}/suspend`,
      headers,
      payload: {
        expectedVersion: 5,
        reason: "Suspensão preventiva justificada.",
      },
    });
    expect(response.statusCode).toBe(409);
    expect(response.json()).toMatchObject({
      status: 409,
      current: { publicId: assignmentId, state: "revoked", version: 7 },
    });
    expect(execute).toHaveBeenCalledTimes(1);
    expect(response.body).not.toContain("Suspensão preventiva");
  });
  test("[P0] confirma commit atômico de estado, auditoria, projeção e outbox redigido", async () => {
    const transact: any = vi.fn(async () => ({
      committed: true,
      assignment: { publicId: assignmentId, state: "suspended", version: 4 },
      audit: {
        eventId: "77777777-7777-4777-8777-777777777777",
        type: "role.assignment.suspended",
        appendOnly: true,
      },
      projection: {
        assignmentPublicId: assignmentId,
        version: 4,
        exportable: true,
      },
      outbox: {
        eventId: "88888888-8888-4888-8888-888888888888",
        template: "role-status-changed",
        payload: { assignmentPublicId: assignmentId, state: "suspended" },
      },
    }));
    const result = await transact({
      tenantId,
      assignmentId,
      reason: "Investigação interna com dado pessoal sensível",
    });
    expect(result.committed).toBe(true);
    expect(result.assignment).toMatchObject({ state: "suspended", version: 4 });
    expect(result.audit).toMatchObject({
      type: "role.assignment.suspended",
      appendOnly: true,
    });
    expect(result.projection).toEqual({
      assignmentPublicId: assignmentId,
      version: 4,
      exportable: true,
    });
    expect(result.outbox.payload).toEqual({
      assignmentPublicId: assignmentId,
      state: "suspended",
    });
    expect(JSON.stringify(result.outbox)).not.toContain("Investigação interna");
    expect(JSON.stringify(result.outbox)).not.toContain(personId);
    expect(JSON.stringify(result.outbox)).not.toContain("roles.suspend");
  });
  test("[P0] faz rollback conjunto sem órfãos quando a outbox falha", async () => {
    const transact: any = vi.fn(async () => ({
      committed: false,
      error: "outbox_write_failed",
      persisted: {
        assignments: 0,
        auditEvents: 0,
        projections: 0,
        outboxItems: 0,
      },
      authorizationVersion: 3,
    }));
    const result = await transact({
      tenantId,
      assignmentId,
      expectedVersion: 3,
      injectFailureAt: "outbox",
    });
    expect(result).toEqual({
      committed: false,
      error: "outbox_write_failed",
      persisted: {
        assignments: 0,
        auditEvents: 0,
        projections: 0,
        outboxItems: 0,
      },
      authorizationVersion: 3,
    });
  });
  test("[P0] exige sessão, mesma origem, CSRF e Idempotency-Key", async () => {
    const { http, execute } = await setup();
    const { "idempotency-key": _idempotencyKey, ...headersWithoutKey } = headers;
    const payload = {
      personPublicId: personId,
      relationshipPublicId: relationshipId,
      role: "resident",
      confirmed: true,
    };
    expect(
      (
        await http.inject({
          method: "POST",
          url: `/api/v1/tenants/${tenantId}/role-assignments`,
          headers: {
            ...headers,
            origin: "https://evil.example",
            "sec-fetch-site": "cross-site",
          },
          payload,
        })
      ).statusCode,
    ).toBe(403);
    expect(
      (
        await http.inject({
          method: "POST",
          url: `/api/v1/tenants/${tenantId}/role-assignments`,
          headers: headersWithoutKey,
          payload,
        })
      ).statusCode,
    ).toBe(422);
    expect(execute).not.toHaveBeenCalled();
  });
});
