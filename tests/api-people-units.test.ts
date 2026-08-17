import { afterEach, describe, expect, it, vi } from "vitest";
import { InstitucionalConflict } from "../packages/application/src/index.js";
import { createNestApplication } from "../apps/api/src/nest-app.js";
const apps: any[] = [];
afterEach(async () => {
  while (apps.length) await apps.pop().close();
});
function auth() {
  return {
    authenticate: { execute: vi.fn() },
    resolve: {
      execute: vi.fn(async () => ({
        accountId: "account-1",
        tokenHash: "hash",
      })),
    },
    refreshCsrf: { execute: vi.fn() },
    verifyCsrf: { execute: vi.fn(async () => undefined) },
    limited: { execute: vi.fn() },
    logout: { execute: vi.fn() },
    tenants: { execute: vi.fn() },
    dashboard: { execute: vi.fn() },
  } as any;
}
async function setup(
  execute = vi.fn(async (operation: string) =>
    operation.startsWith("list")
      ? { items: [] }
      : {
          publicId: crypto.randomUUID(),
          fullName: "Ana",
          state: "active",
          version: 1,
        },
  ),
) {
  const services = auth();
  const app = await createNestApplication(
    { execute: vi.fn() } as any,
    { allowedOrigin: "https://app.example.com" },
    services,
    { execute },
  );
  apps.push(app);
  return { http: app.getHttpAdapter().getInstance(), execute, services };
}
const headers = {
  cookie: "__Host-burgoweb-session=session",
  origin: "https://app.example.com",
  "sec-fetch-site": "same-origin",
  "x-csrf-token": "csrf",
  "idempotency-key": "request-1",
};
describe("API Pessoas, Unidades e Vínculos", () => {
  it("lista projeção autorizada com no-store e request id", async () => {
    const { http, execute } = await setup();
    const response = await http.inject({
      method: "GET",
      url: "/api/v1/tenants/11111111-1111-4111-8111-111111111111/people",
      headers: { cookie: headers.cookie },
    });
    expect(response.statusCode).toBe(200);
    expect(response.headers["cache-control"]).toBe("no-store");
    expect(response.headers["x-request-id"]).toBeTruthy();
    expect(execute).toHaveBeenCalledWith(
      "listPeople",
      "account-1",
      "11111111-1111-4111-8111-111111111111",
      { cursor: undefined },
    );
  });
  it("exige mesma origem, CSRF e Idempotency-Key na criação", async () => {
    const { http, execute, services } = await setup();
    expect(
      (
        await http.inject({
          method: "POST",
          url: "/api/v1/tenants/11111111-1111-4111-8111-111111111111/people",
          headers: {
            ...headers,
            origin: "https://evil.example",
            "sec-fetch-site": "cross-site",
          },
          payload: { fullName: "Ana" },
        })
      ).statusCode,
    ).toBe(403);
    expect(
      (
        await http.inject({
          method: "POST",
          url: "/api/v1/tenants/11111111-1111-4111-8111-111111111111/people",
          headers: { ...headers, "idempotency-key": "" },
          payload: { fullName: "Ana" },
        })
      ).statusCode,
    ).toBe(422);
    expect(execute).not.toHaveBeenCalled();
    expect(services.verifyCsrf.execute).not.toHaveBeenCalled();
  });
  it("rejeita campos desconhecidos sem repassá-los", async () => {
    const { http, execute } = await setup();
    const response = await http.inject({
      method: "POST",
      url: "/api/v1/tenants/11111111-1111-4111-8111-111111111111/units",
      headers,
      payload: { identifier: "Casa 1", schemaName: "tenant_alheio" },
    });
    expect(response.statusCode).toBe(422);
    expect(response.body).not.toContain("tenant_alheio");
    expect(execute).not.toHaveBeenCalled();
  });
  it("rejeita publicId contrabandeado no corpo de criação", async () => {
    const { http, execute } = await setup();
    const response = await http.inject({
      method: "POST",
      url: "/api/v1/tenants/11111111-1111-4111-8111-111111111111/units",
      headers,
      payload: {
        identifier: "Casa 1",
        publicId: "99999999-9999-4999-8999-999999999999",
      },
    });
    expect(response.statusCode).toBe(422);
    expect(execute).not.toHaveBeenCalled();
  });
  it("traduz conflito em 409 com projeção atual autorizada", async () => {
    const { http } = await setup(
      vi.fn(async () => {
        throw new InstitucionalConflict("O registro mudou.", { version: 2 });
      }),
    );
    const response = await http.inject({
      method: "POST",
      url: "/api/v1/tenants/11111111-1111-4111-8111-111111111111/people",
      headers,
      payload: { fullName: "Ana" },
    });
    expect(response.statusCode).toBe(409);
    expect(response.json()).toMatchObject({
      status: 409,
      current: { version: 2 },
    });
  });
  it("aceita update estrito e preserva o contrato de concorrência", async () => {
    const { http, execute } = await setup();
    const recordId = "22222222-2222-4222-8222-222222222222";
    const response = await http.inject({
      method: "PATCH",
      url: `/api/v1/tenants/11111111-1111-4111-8111-111111111111/people/${recordId}`,
      headers,
      payload: {
        fullName: "Ana Atual",
        expectedVersion: 3,
        reason: "Correção",
      },
    });
    expect(response.statusCode).toBe(200);
    expect(execute).toHaveBeenCalledWith(
      "updatePerson",
      "account-1",
      "11111111-1111-4111-8111-111111111111",
      expect.objectContaining({
        publicId: recordId,
        fullName: "Ana Atual",
        expectedVersion: 3,
        reason: "Correção",
      }),
    );
  });
  it("sanitiza falhas internas como 500 sem expor mensagem do driver", async () => {
    const { http } = await setup(
      vi.fn(async () => {
        throw new Error("invalid input syntax for type uuid: segredo-interno");
      }),
    );
    const response = await http.inject({
      method: "GET",
      url: "/api/v1/tenants/11111111-1111-4111-8111-111111111111/people",
      headers: { cookie: headers.cookie },
    });
    expect(response.statusCode).toBe(500);
    expect(response.body).not.toContain("segredo-interno");
    expect(response.json()).toMatchObject({
      status: 500,
      detail: "Não foi possível concluir a operação. Tente novamente.",
    });
  });
  it("rejeita tenant malformado antes de resolver contexto ou acessar PostgreSQL", async () => {
    const { http, execute } = await setup();
    const response = await http.inject({
      method: "GET",
      url: "/api/v1/tenants/invalido/people",
      headers: { cookie: headers.cookie },
    });
    expect(response.statusCode).toBe(422);
    expect(execute).not.toHaveBeenCalled();
  });
});
