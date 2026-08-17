import { describe, expect, it, vi } from "vitest";
import {
  CreatePerson,
  CreateRelationship,
  CreateUnit,
  InstitutionalValidation,
  normalizeInstitutionalEmail,
  normalizeUnitIdentifier,
  type PeopleUnitsRepository,
  type TenantContext,
} from "../packages/application/src/index.js";

const context: TenantContext = Object.freeze({
  accountId: "account-1",
  personId: "actor-1",
  membershipId: "membership-1",
  tenantId: "tenant-1",
  publicId: "11111111-1111-4111-8111-111111111111",
  schemaName: "tenant_0123456789abcdef0123456789abcdef",
  displayName: "Sol",
  timeZone: "America/Sao_Paulo",
  authorizationVersion: 3,
  capabilities: ["people-units-relationships.manage"],
});

function repository(
  overrides: Partial<PeopleUnitsRepository> = {},
): PeopleUnitsRepository {
  return {
    createPerson: vi.fn(async (_context, command) => ({
      publicId: "person-public",
      fullName: command.fullName.trim(),
      email: command.email?.trim().toLowerCase(),
      state: "active" as const,
      version: 1,
    })),
    createUnit: vi.fn(async (_context, command) => ({
      publicId: "unit-public",
      identifier: command.identifier.trim(),
      state: "active" as const,
      version: 1,
    })),
    createRelationship: vi.fn(async (_context, command) => ({
      publicId: "relationship-public",
      personPublicId: command.personPublicId,
      unitPublicId: command.unitPublicId,
      relationKind: command.relationKind.trim(),
      startsOn: command.startsOn as any,
      endsOn: command.endsOn as any,
      state: "active" as const,
      version: 1,
    })),
    listPeople: vi.fn(async () => ({ items: [], nextCursor: undefined })),
    listUnits: vi.fn(async () => ({ items: [], nextCursor: undefined })),
    listRelationships: vi.fn(async () => ({
      items: [],
      nextCursor: undefined,
    })),
    updatePerson: vi.fn(),
    updateUnit: vi.fn(),
    updateRelationship: vi.fn(),
    endRelationship: vi.fn(),
    ...overrides,
  };
}

describe("contratos institucionais de Pessoa, Unidade e Vínculo", () => {
  it("normaliza apenas sinais institucionais e não cria Conta, Papel ou acesso", async () => {
    const port = repository();
    const result = await new CreatePerson(port).execute(context, {
      fullName: "  Ana Lima  ",
      email: " ANA@EXAMPLE.COM ",
      idempotencyKey: "request-1",
      requestId: "r1",
    });
    expect(result).toMatchObject({
      fullName: "Ana Lima",
      email: "ana@example.com",
      state: "active",
      version: 1,
    });
    expect(port.createPerson).toHaveBeenCalledWith(
      context,
      expect.not.objectContaining({
        accountId: expect.anything(),
        role: expect.anything(),
        cpf: expect.anything(),
      }),
    );
    expect(normalizeInstitutionalEmail(" ANA@EXAMPLE.COM ")).toBe(
      "ana@example.com",
    );
  });

  it("aceita Unidade genérica e normaliza sua unicidade somente no tenant", async () => {
    const port = repository();
    await new CreateUnit(port).execute(context, {
      identifier: "  Bloco Azul / Loja 02 ",
      idempotencyKey: "request-2",
      requestId: "r2",
    });
    expect(normalizeUnitIdentifier("  Bloco Azul / Loja 02 ")).toBe(
      "bloco azul / loja 02",
    );
    expect(port.createUnit).toHaveBeenCalledWith(
      context,
      expect.objectContaining({ identifier: "Bloco Azul / Loja 02" }),
    );
  });

  it("mantém natureza declarativa e vigência em datas civis inclusiva/exclusiva", async () => {
    const port = repository();
    await new CreateRelationship(port).execute(context, {
      personPublicId: "p1",
      unitPublicId: "u1",
      relationKind: " Morador ",
      startsOn: "2026-08-01",
      endsOn: "2026-09-01",
      idempotencyKey: "request-3",
      requestId: "r3",
    });
    expect(port.createRelationship).toHaveBeenCalledWith(
      context,
      expect.objectContaining({
        relationKind: "Morador",
        startsOn: "2026-08-01",
        endsOn: "2026-09-01",
      }),
    );
  });

  it("rejeita data civil inválida, período vazio e contexto sem capacidade", async () => {
    const useCase = new CreateRelationship(repository());
    expect(() =>
      useCase.execute(context, {
        personPublicId: "p",
        unitPublicId: "u",
        relationKind: "Morador",
        startsOn: "01/08/2026",
        idempotencyKey: "k",
        requestId: "r",
      }),
    ).toThrow(InstitutionalValidation);
    expect(() =>
      useCase.execute(context, {
        personPublicId: "p",
        unitPublicId: "u",
        relationKind: "Morador",
        startsOn: "2026-08-02",
        endsOn: "2026-08-02",
        idempotencyKey: "k",
        requestId: "r",
      }),
    ).toThrow(InstitutionalValidation);
    expect(() =>
      new CreatePerson(repository()).execute(
        { ...context, capabilities: [] },
        { fullName: "Ana", idempotencyKey: "k", requestId: "r" },
      ),
    ).toThrow();
  });

  it("rejeita e-mail malformado e valor opcional com tipo incorreto", () => {
    const useCase = new CreatePerson(repository());
    expect(() =>
      useCase.execute(context, {
        fullName: "Ana",
        email: "sem-arroba",
        idempotencyKey: "k1",
        requestId: "r1",
      }),
    ).toThrow(InstitutionalValidation);
    expect(() =>
      useCase.execute(context, {
        fullName: "Ana",
        email: false as any,
        idempotencyKey: "k2",
        requestId: "r2",
      }),
    ).toThrow(InstitutionalValidation);
  });
});
