import { afterEach, describe, expect, test, vi } from "vitest";
import { createNestApplication } from "../apps/api/src/nest-app.js";

const tenantId = "11111111-1111-4111-8111-111111111111";
const grantId = "22222222-2222-4222-8222-222222222222";
const personId = "33333333-3333-4333-8333-333333333333";
const apps: Array<{ close(): Promise<void> }> = [];
const headers = {
  cookie: "__Host-burgoweb-session=session",
  origin: "https://app.example.com",
  "sec-fetch-site": "same-origin",
  "x-csrf-token": "csrf",
  "idempotency-key": "capability-command-1",
};
const grant = (overrides: Record<string, unknown> = {}) => ({
  publicId: grantId,
  personPublicId: personId,
  capabilityId: "roles.suspend",
  validFrom: "2026-08-11T12:00:00.000Z",
  validUntil: null,
  state: "active",
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
    operation === "listCapabilityGrants"
      ? { items: [grant()], catalog: [] }
      : grant(),
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

describe("Story 1.9 - API de delegação de capacidades", () => {
  test("[P1] lista capacidades com catálogo e viewer minimizados", async () => {
    const { http, execute } = await setup();
    const response = await http.inject({
      method: "GET",
      url: `/api/v1/tenants/${tenantId}/capability-grants`,
      headers: { cookie: headers.cookie },
    });
    expect(response.statusCode).toBe(200);
    expect(response.headers["cache-control"]).toBe("no-store");
    expect(response.json()).toMatchObject({
      items: [{ publicId: grantId, state: "active" }],
    });
    expect(execute).toHaveBeenCalledWith(
      "listCapabilityGrants",
      "syndic-account",
      tenantId,
      { cursor: undefined },
    );
  });

  test("[P1] concede capacidade exigindo Idempotency-Key e retorna 201", async () => {
    const { http, execute } = await setup();
    const response = await http.inject({
      method: "POST",
      url: `/api/v1/tenants/${tenantId}/capability-grants`,
      headers,
      payload: {
        personPublicId: personId,
        capabilityId: "roles.suspend",
        validFrom: "2026-08-11T09:00",
      },
    });
    expect(response.statusCode).toBe(201);
    expect(execute).toHaveBeenCalledWith(
      "grantCapability",
      "syndic-account",
      tenantId,
      expect.objectContaining({ idempotencyKey: "capability-command-1" }),
    );
  });

  test("[P1] rejeita concessão sem Idempotency-Key e sem CSRF/origem válidos", async () => {
    const { http, execute } = await setup();
    const { "idempotency-key": _ignored, ...withoutKey } = headers;
    const payload = {
      personPublicId: personId,
      capabilityId: "roles.suspend",
      validFrom: "2026-08-11T09:00",
      confirmed: true,
    };
    expect(
      (
        await http.inject({
          method: "POST",
          url: `/api/v1/tenants/${tenantId}/capability-grants`,
          headers: withoutKey,
          payload,
        })
      ).statusCode,
    ).toBe(422);
    expect(
      (
        await http.inject({
          method: "POST",
          url: `/api/v1/tenants/${tenantId}/capability-grants`,
          headers: { ...headers, origin: "https://evil.example", "sec-fetch-site": "cross-site" },
          payload,
        })
      ).statusCode,
    ).toBe(403);
    expect(execute).not.toHaveBeenCalled();
  });

  test("[P1] expõe revogação exigindo expectedVersion", async () => {
    const { http, execute } = await setup();
    const response = await http.inject({
      method: "POST",
      url: `/api/v1/tenants/${tenantId}/capability-grants/${grantId}/revoke`,
      headers,
      payload: { expectedVersion: 1 },
    });
    expect(response.statusCode).toBe(200);
    expect(execute).toHaveBeenCalledWith(
      "revokeCapability",
      "syndic-account",
      tenantId,
      expect.objectContaining({ publicId: grantId, expectedVersion: 1 }),
    );
  });

  test("[P1] retorna conflito minimizado e acesso sem enumeração", async () => {
    for (const [error, status] of [
      [
        Object.assign(new Error("Revise."), {
          name: "InstitutionalConflict",
          current: { publicId: grantId, state: "revoked", version: 3 },
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
        url: `/api/v1/tenants/${tenantId}/capability-grants/${grantId}/revoke`,
        headers,
        payload: { expectedVersion: 1 },
      });
      expect(response.statusCode).toBe(status);
    }
  });

  test("[P0] mapeia CapabilityValidation/CapabilityConflict reais para 422/409, nunca 500", async () => {
    const { CapabilityConflict, CapabilityValidation } = await import(
      "../packages/application/src/authorization/capabilities.js"
    );
    const { http: httpValidation } = await setup(
      vi.fn(async () => {
        throw new CapabilityValidation("capabilityUnavailable");
      }),
    );
    const validationResponse = await httpValidation.inject({
      method: "POST",
      url: `/api/v1/tenants/${tenantId}/capability-grants`,
      headers,
      payload: {
        personPublicId: personId,
        capabilityId: "financial.entries.manage",
        validFrom: "2026-08-11T09:00",
      },
    });
    expect(validationResponse.statusCode).toBe(422);
    expect(validationResponse.json()).toMatchObject({
      status: 422,
      type: expect.stringContaining("validation"),
      detail: "capabilityUnavailable",
    });

    const { http: httpConflict } = await setup(
      vi.fn(async () => {
        throw new CapabilityConflict({ publicId: grantId, state: "revoked", version: 2 });
      }),
    );
    const conflictResponse = await httpConflict.inject({
      method: "POST",
      url: `/api/v1/tenants/${tenantId}/capability-grants/${grantId}/revoke`,
      headers,
      payload: { expectedVersion: 1 },
    });
    expect(conflictResponse.statusCode).toBe(409);
    expect(conflictResponse.json()).toMatchObject({
      status: 409,
      current: { publicId: grantId, state: "revoked", version: 2 },
    });
  });
});
