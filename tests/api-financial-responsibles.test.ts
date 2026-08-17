import { afterEach, describe, expect, test, vi } from "vitest";
import { createNestApplication } from "../apps/api/src/nest-app.js";

const tenantId = "11111111-1111-4111-8111-111111111111";
const assignmentId = "22222222-2222-4222-8222-222222222222";
const personId = "33333333-3333-4333-8333-333333333333";
const unitId = "44444444-4444-4444-8444-444444444444";
const apps: Array<{ close(): Promise<void> }> = [];
const headers = {
  cookie: "__Host-burgoweb-session=session",
  origin: "https://app.example.com",
  "sec-fetch-site": "same-origin",
  "x-csrf-token": "csrf",
  "idempotency-key": "financial-responsible-command-1",
};
const assignment = (overrides: Record<string, unknown> = {}) => ({
  publicId: assignmentId,
  personPublicId: personId,
  unitPublicId: unitId,
  relationshipPublicId: "55555555-5555-4555-8555-555555555555",
  validFrom: "2026-08-11T12:00:00.000Z",
  validUntil: null,
  state: "active",
  grantedBy: { publicId: "66666666-6666-4666-8666-666666666666" },
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
    operation === "listFinancialResponsibles"
      ? { items: [assignment()], viewerCapabilities: ["financial-responsibles.manage"] }
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

describe("Story 1.10 - API de Responsáveis Financeiros", () => {
  test("[P1] lista Responsáveis Financeiros com viewer minimizado", async () => {
    const { http, execute } = await setup();
    const response = await http.inject({
      method: "GET",
      url: `/api/v1/tenants/${tenantId}/financial-responsibles`,
      headers: { cookie: headers.cookie },
    });
    expect(response.statusCode).toBe(200);
    expect(response.headers["cache-control"]).toBe("no-store");
    expect(response.json()).toMatchObject({
      items: [{ publicId: assignmentId, state: "active" }],
    });
    expect(execute).toHaveBeenCalledWith(
      "listFinancialResponsibles",
      "syndic-account",
      tenantId,
      { cursor: undefined },
    );
  });

  test("[P1] atribui Responsável Financeiro exigindo Idempotency-Key e retorna 201", async () => {
    const { http, execute } = await setup();
    const response = await http.inject({
      method: "POST",
      url: `/api/v1/tenants/${tenantId}/financial-responsibles`,
      headers,
      payload: {
        personPublicId: personId,
        unitPublicId: unitId,
        validFrom: "2026-08-11T09:00",
      },
    });
    expect(response.statusCode).toBe(201);
    expect(execute).toHaveBeenCalledWith(
      "assignFinancialResponsible",
      "syndic-account",
      tenantId,
      expect.objectContaining({ idempotencyKey: "financial-responsible-command-1" }),
    );
  });

  test("[P1] rejeita atribuição sem Idempotency-Key e sem CSRF/origem válidos", async () => {
    const { http, execute } = await setup();
    const { "idempotency-key": _ignored, ...withoutKey } = headers;
    const payload = {
      personPublicId: personId,
      unitPublicId: unitId,
      validFrom: "2026-08-11T09:00",
      confirmed: true,
    };
    expect(
      (
        await http.inject({
          method: "POST",
          url: `/api/v1/tenants/${tenantId}/financial-responsibles`,
          headers: withoutKey,
          payload,
        })
      ).statusCode,
    ).toBe(422);
    expect(
      (
        await http.inject({
          method: "POST",
          url: `/api/v1/tenants/${tenantId}/financial-responsibles`,
          headers: { ...headers, origin: "https://evil.example", "sec-fetch-site": "cross-site" },
          payload,
        })
      ).statusCode,
    ).toBe(403);
    expect(execute).not.toHaveBeenCalled();
  });

  test("[P1] expõe remoção exigindo expectedVersion", async () => {
    const { http, execute } = await setup();
    const response = await http.inject({
      method: "POST",
      url: `/api/v1/tenants/${tenantId}/financial-responsibles/${assignmentId}/remove`,
      headers,
      payload: { expectedVersion: 1 },
    });
    expect(response.statusCode).toBe(200);
    expect(execute).toHaveBeenCalledWith(
      "removeFinancialResponsible",
      "syndic-account",
      tenantId,
      expect.objectContaining({ publicId: assignmentId, expectedVersion: 1 }),
    );
  });

  test("[P1] retorna conflito minimizado e acesso sem enumeração", async () => {
    for (const [error, status] of [
      [
        Object.assign(new Error("Revise."), {
          name: "InstitutionalConflict",
          current: { publicId: assignmentId, state: "revoked", version: 3 },
        }),
        409,
      ],
      [Object.assign(new Error("forbidden"), { name: "AuthorizationDenied" }), 404],
    ] as const) {
      const { http } = await setup(
        vi.fn(async () => {
          throw error;
        }),
      );
      const response = await http.inject({
        method: "POST",
        url: `/api/v1/tenants/${tenantId}/financial-responsibles/${assignmentId}/remove`,
        headers,
        payload: { expectedVersion: 1 },
      });
      expect(response.statusCode).toBe(status);
    }
  });

  test("[P0] mapeia FinancialResponsibleValidation/FinancialResponsibleConflict reais para 422/409, nunca 500", async () => {
    const { FinancialResponsibleConflict, FinancialResponsibleValidation } = await import(
      "../packages/application/src/finance/financial-responsibles.js"
    );
    const { http: httpValidation } = await setup(
      vi.fn(async () => {
        throw new FinancialResponsibleValidation("unitPublicId");
      }),
    );
    const validationResponse = await httpValidation.inject({
      method: "POST",
      url: `/api/v1/tenants/${tenantId}/financial-responsibles`,
      headers,
      payload: {
        personPublicId: personId,
        unitPublicId: "não-uuid",
        validFrom: "2026-08-11T09:00",
      },
    });
    expect(validationResponse.statusCode).toBe(422);
    expect(validationResponse.json()).toMatchObject({
      status: 422,
      type: expect.stringContaining("validation"),
      detail: "unitPublicId",
    });

    const { http: httpConflict } = await setup(
      vi.fn(async () => {
        throw new FinancialResponsibleConflict({ publicId: assignmentId, state: "revoked", version: 2 });
      }),
    );
    const conflictResponse = await httpConflict.inject({
      method: "POST",
      url: `/api/v1/tenants/${tenantId}/financial-responsibles/${assignmentId}/remove`,
      headers,
      payload: { expectedVersion: 1 },
    });
    expect(conflictResponse.statusCode).toBe(409);
    expect(conflictResponse.json()).toMatchObject({
      status: 409,
      current: { publicId: assignmentId, state: "revoked", version: 2 },
    });
  });
});
