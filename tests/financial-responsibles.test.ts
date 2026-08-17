import { describe, expect, test, vi } from 'vitest';
import {
  AssignFinancialResponsible,
  FinancialResponsibleValidation,
  ListFinancialResponsibles,
  MANAGE_FINANCIAL_RESPONSIBLES_CAPABILITY,
  RemoveFinancialResponsible,
  transitionFinancialResponsible,
  validateFinancialResponsibleDraft,
  type FinancialResponsibleDraft,
  type FinancialResponsibleRepository,
} from '../packages/application/src/finance/financial-responsibles.js';
import { AuthorizationDenied, type TenantContext } from '../packages/application/src/index.js';

const context = (capabilities: string[] = []): TenantContext => ({
  accountId: 'account-1',
  personId: 'person-1',
  membershipId: 'membership-1',
  tenantId: 'tenant-1',
  publicId: '11111111-1111-4111-8111-111111111111',
  schemaName: 'tenant_0123456789abcdef0123456789abcdef',
  displayName: 'Residencial Sol',
  timeZone: 'America/Sao_Paulo',
  authorizationVersion: 1,
  capabilities,
});
const draft = (overrides: Partial<FinancialResponsibleDraft> = {}): FinancialResponsibleDraft => ({
  personPublicId: '22222222-2222-4222-8222-222222222222',
  unitPublicId: '33333333-3333-4333-8333-333333333333',
  validFrom: '2026-08-11T09:00',
  ...overrides,
});
const repository = (
  overrides: Partial<FinancialResponsibleRepository> = {},
): FinancialResponsibleRepository => ({
  list: vi.fn(),
  assign: vi.fn(),
  remove: vi.fn(),
  materialize: vi.fn(),
  ...overrides,
});

describe('Story 1.10 - domínio de Responsáveis Financeiros', () => {
  test('MANAGE_FINANCIAL_RESPONSIBLES_CAPABILITY identifica a capacidade dedicada', () => {
    expect(MANAGE_FINANCIAL_RESPONSIBLES_CAPABILITY).toBe('financial-responsibles.manage');
  });

  test('aplica a máquina de estados sem suspensão e mantém revogação terminal', () => {
    expect(transitionFinancialResponsible('scheduled', 'activate')).toBe('active');
    expect(transitionFinancialResponsible('active', 'expire')).toBe('expired');
    expect(transitionFinancialResponsible('scheduled', 'revoke')).toBe('revoked');
    expect(() => transitionFinancialResponsible('active', 'activate')).toThrow(FinancialResponsibleValidation);
    expect(() => transitionFinancialResponsible('revoked', 'revoke')).toThrow(FinancialResponsibleValidation);
  });

  test('validateFinancialResponsibleDraft rejeita identificadores inválidos e vigência invertida', () => {
    expect(() => validateFinancialResponsibleDraft(draft({ personPublicId: 'não-uuid' }), 'America/Sao_Paulo')).toThrow(
      FinancialResponsibleValidation,
    );
    expect(() => validateFinancialResponsibleDraft(draft({ unitPublicId: 'não-uuid' }), 'America/Sao_Paulo')).toThrow(
      FinancialResponsibleValidation,
    );
    expect(() =>
      validateFinancialResponsibleDraft(draft({ validFrom: '2026-08-11T09:00', validUntil: '2026-08-11T08:00' }), 'America/Sao_Paulo'),
    ).toThrow(FinancialResponsibleValidation);
  });

  test('validateFinancialResponsibleDraft resolve o horário civil contra o fuso do Condomínio', () => {
    const result = validateFinancialResponsibleDraft(draft(), 'America/Sao_Paulo');
    expect(result.validFrom).toBe('2026-08-11T12:00:00.000Z');
  });

  test('ListFinancialResponsibles nega sem dashboard.read e sem financial-responsibles.manage', async () => {
    const repo = repository();
    await expect(new ListFinancialResponsibles(repo).execute(context([]))).rejects.toBeInstanceOf(AuthorizationDenied);
  });

  test('ListFinancialResponsibles sem financial-responsibles.manage lista somente as próprias atribuições', async () => {
    const repo = repository({ list: vi.fn().mockResolvedValue({ items: [] }) });
    const result = await new ListFinancialResponsibles(repo).execute(context(['dashboard.read']));
    expect(repo.list).toHaveBeenCalledWith(expect.anything(), undefined, { selfOnly: true });
    expect(result.viewerCapabilities).toEqual(['dashboard.read']);
  });

  test('ListFinancialResponsibles com financial-responsibles.manage lista todas as atribuições do Condomínio', async () => {
    const repo = repository({ list: vi.fn().mockResolvedValue({ items: [] }) });
    await new ListFinancialResponsibles(repo).execute(context([MANAGE_FINANCIAL_RESPONSIBLES_CAPABILITY]));
    expect(repo.list).toHaveBeenCalledWith(expect.anything(), undefined, undefined);
  });

  test('AssignFinancialResponsible/RemoveFinancialResponsible negam sem financial-responsibles.manage', () => {
    const repo = repository();
    expect(() =>
      new AssignFinancialResponsible(repo).execute(context([]), { ...draft(), confirmed: true, idempotencyKey: 'k', requestId: 'r' }),
    ).toThrow(AuthorizationDenied);
    expect(() =>
      new RemoveFinancialResponsible(repo).execute(context([]), { publicId: '44444444-4444-4444-8444-444444444444', expectedVersion: 1, confirmed: true, requestId: 'r' }),
    ).toThrow(AuthorizationDenied);
  });

  test('AssignFinancialResponsible exige confirmação e Idempotency-Key e delega ao repositório', async () => {
    const repo = repository();
    expect(() =>
      new AssignFinancialResponsible(repo).execute(context([MANAGE_FINANCIAL_RESPONSIBLES_CAPABILITY]), {
        ...draft(),
        confirmed: false,
        idempotencyKey: 'k',
        requestId: 'r',
      }),
    ).toThrow(FinancialResponsibleValidation);
    await new AssignFinancialResponsible(repo).execute(context([MANAGE_FINANCIAL_RESPONSIBLES_CAPABILITY]), {
      ...draft(),
      confirmed: true,
      idempotencyKey: ' key-1 ',
      requestId: 'r1',
    });
    expect(repo.assign).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ confirmed: true, idempotencyKey: 'key-1', unitPublicId: draft().unitPublicId }),
    );
  });

  test('RemoveFinancialResponsible exige confirmação explícita e publicId/expectedVersion válidos', async () => {
    const repo = repository();
    const publicId = '44444444-4444-4444-8444-444444444444';
    expect(() =>
      new RemoveFinancialResponsible(repo).execute(context([MANAGE_FINANCIAL_RESPONSIBLES_CAPABILITY]), { publicId, expectedVersion: 1, requestId: 'r' }),
    ).toThrow(FinancialResponsibleValidation);
    expect(() =>
      new RemoveFinancialResponsible(repo).execute(context([MANAGE_FINANCIAL_RESPONSIBLES_CAPABILITY]), { publicId: 'não-uuid', expectedVersion: 1, confirmed: true, requestId: 'r' }),
    ).toThrow(FinancialResponsibleValidation);
    await new RemoveFinancialResponsible(repo).execute(context([MANAGE_FINANCIAL_RESPONSIBLES_CAPABILITY]), { publicId, expectedVersion: 1, confirmed: true, requestId: 'r' });
    expect(repo.remove).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ publicId, confirmed: true }));
  });
});
