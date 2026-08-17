import { describe, expect, test, vi } from 'vitest';
import {
  AuthorizationDenied,
  GrantRoleAssignment,
  PreviewRoleAssignment,
  ROLE_CATALOG,
  RestoreRoleAssignment,
  RevokeRoleAssignment,
  RoleValidation,
  SuspendRoleAssignment,
  resolveCivilInstant,
  resolveEffectiveCapabilities,
  transitionRoleAssignment,
  validateReason,
  validateRoleDraft,
  type RoleAssignmentRepository,
  type RoleDraft,
} from '../packages/application/src/authorization/roles.js';
import type { TenantContext } from '../packages/application/src/index.js';

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
const draft = (overrides: Partial<RoleDraft> = {}): RoleDraft => ({
  personPublicId: '22222222-2222-4222-8222-222222222222',
  role: 'resident',
  scope: { type: 'tenant' },
  validFrom: '2026-08-11T09:00',
  timeZone: 'America/Sao_Paulo',
  ...overrides,
});
const repository = (
  overrides: Partial<RoleAssignmentRepository> = {},
): RoleAssignmentRepository => ({
  list: vi.fn(),
  preview: vi.fn(),
  grant: vi.fn(),
  transition: vi.fn(),
  materialize: vi.fn(),
  ...overrides,
});

describe('Story 1.8 - domínio de Papéis', () => {
  test('mantém catálogo MVP fechado e capacidades explícitas', () => {
    expect(Object.keys(ROLE_CATALOG)).toEqual(['syndic', 'administrative-assistant', 'councilor', 'resident']);
    // roles.suspend não é mais incondicional para o Auxiliar — depende de capability_grant (Story 1.9).
    expect(ROLE_CATALOG['administrative-assistant']).not.toContain('roles.suspend');
    expect(ROLE_CATALOG.resident).not.toContain('roles.grant');
  });

  test('aplica a máquina de estados e mantém revogação terminal', () => {
    expect(transitionRoleAssignment('scheduled', 'activate')).toBe('active');
    expect(transitionRoleAssignment('active', 'suspend')).toBe('suspended');
    expect(transitionRoleAssignment('suspended', 'restore')).toBe('active');
    expect(transitionRoleAssignment('active', 'expire')).toBe('expired');
    expect(transitionRoleAssignment('suspended', 'revoke')).toBe('revoked');
    expect(() => transitionRoleAssignment('revoked', 'restore')).toThrow(RoleValidation);
  });

  test('une somente atribuições ativas, vigentes e no alcance solicitado', () => {
    const now = new Date('2026-08-10T15:00:00Z');
    expect(resolveEffectiveCapabilities([
      { publicId: 'a', role: 'resident', state: 'active', validFrom: new Date('2026-08-01Z'), validUntil: null, scope: { type: 'tenant' } },
      { publicId: 'b', role: 'administrative-assistant', state: 'suspended', validFrom: new Date('2026-08-01Z'), validUntil: null, scope: { type: 'tenant' } },
      { publicId: 'c', role: 'councilor', state: 'active', validFrom: new Date('2026-08-01Z'), validUntil: null, scope: { type: 'unit', unitPublicId: 'u1' } },
    ], now, 'u2')).toEqual(ROLE_CATALOG.resident);
  });

  test('valida motivo restrito na borda', () => {
    expect(validateReason('  Motivo documentado  ')).toBe('Motivo documentado');
    expect(() => validateReason('x')).toThrow(RoleValidation);
    expect(() => validateReason('x'.repeat(501))).toThrow(RoleValidation);
  });

  test('resolveCivilInstant resolve horário civil não ambíguo no fuso do Condomínio', () => {
    const instant = resolveCivilInstant('2026-08-11T09:00', 'America/Sao_Paulo');
    expect(instant.toISOString()).toBe('2026-08-11T12:00:00.000Z');
  });

  test('resolveCivilInstant rejeita horário inexistente (spring-forward)', () => {
    // America/New_York em 2026-03-08: 01:59 EST salta direto para 03:00 EDT.
    expect(() => resolveCivilInstant('2026-03-08T02:30', 'America/New_York')).toThrow(RoleValidation);
  });

  test('resolveCivilInstant rejeita horário ambíguo (fall-back)', () => {
    // America/New_York em 2026-11-01: 01:30 ocorre duas vezes (EDT e EST).
    expect(() => resolveCivilInstant('2026-11-01T01:30', 'America/New_York')).toThrow(RoleValidation);
  });

  test('resolveCivilInstant rejeita formato inválido', () => {
    expect(() => resolveCivilInstant('2026-08-11T09:00:00-03:00', 'America/Sao_Paulo')).toThrow(RoleValidation);
    expect(() => resolveCivilInstant('não é uma data', 'America/Sao_Paulo')).toThrow(RoleValidation);
  });

  test('validateRoleDraft rejeita UUID inválido, Papel síndico, alcance inconsistente e vigência invertida', () => {
    expect(() => validateRoleDraft(draft({ personPublicId: 'não-uuid' }), 'America/Sao_Paulo')).toThrow(RoleValidation);
    expect(() => validateRoleDraft(draft({ role: 'syndic' as RoleDraft['role'] }), 'America/Sao_Paulo')).toThrow(RoleValidation);
    expect(() => validateRoleDraft(draft({ scope: { type: 'unit' } as RoleDraft['scope'] }), 'America/Sao_Paulo')).toThrow(RoleValidation);
    expect(() =>
      validateRoleDraft(
        draft({ validFrom: '2026-08-11T09:00', validUntil: '2026-08-11T08:00' }),
        'America/Sao_Paulo',
      ),
    ).toThrow(RoleValidation);
  });

  test('validateRoleDraft ignora o fuso enviado pelo cliente e usa sempre o fuso do Condomínio', () => {
    const result = validateRoleDraft(draft({ timeZone: 'Europe/Lisbon' }), 'America/Sao_Paulo');
    expect(result.timeZone).toBe('America/Sao_Paulo');
    expect(result.validFrom).toBe('2026-08-11T12:00:00.000Z');
  });

  test('PreviewRoleAssignment nega sem roles.preview e valida antes de delegar ao repositório', async () => {
    const repo = repository();
    expect(() => new PreviewRoleAssignment(repo).execute(context([]), draft())).toThrow(AuthorizationDenied);
    await new PreviewRoleAssignment(repo).execute(context(['roles.preview']), draft());
    expect(repo.preview).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ validFrom: '2026-08-11T12:00:00.000Z', timeZone: 'America/Sao_Paulo' }),
    );
  });

  test('GrantRoleAssignment nega sem roles.grant e exige confirmação e Idempotency-Key', async () => {
    const repo = repository();
    expect(() =>
      new GrantRoleAssignment(repo).execute(context([]), { ...draft(), confirmed: true, idempotencyKey: 'k', requestId: 'r' }),
    ).toThrow(AuthorizationDenied);
    expect(() =>
      new GrantRoleAssignment(repo).execute(context(['roles.grant']), { ...draft(), confirmed: false, idempotencyKey: 'k', requestId: 'r' }),
    ).toThrow(RoleValidation);
    expect(() =>
      new GrantRoleAssignment(repo).execute(context(['roles.grant']), { ...draft(), confirmed: true, idempotencyKey: '  ', requestId: 'r' }),
    ).toThrow(RoleValidation);
    await new GrantRoleAssignment(repo).execute(context(['roles.grant']), {
      ...draft(),
      confirmed: true,
      idempotencyKey: ' key-1 ',
      requestId: 'r1',
    });
    expect(repo.grant).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ confirmed: true, idempotencyKey: 'key-1', requestId: 'r1' }),
    );
  });

  test('SuspendRoleAssignment/RevokeRoleAssignment exigem motivo válido; RestoreRoleAssignment não', async () => {
    const repo = repository();
    const command = { publicId: '33333333-3333-4333-8333-333333333333', expectedVersion: 1, requestId: 'r' };
    expect(() => new SuspendRoleAssignment(repo).execute(context(['roles.suspend']), command)).toThrow(RoleValidation);
    await new SuspendRoleAssignment(repo).execute(context(['roles.suspend']), { ...command, reason: 'Motivo documentado' });
    expect(repo.transition).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ transition: 'suspend' }));

    expect(() => new RestoreRoleAssignment(repo).execute(context(['roles.restore']), command)).toThrow(RoleValidation); // falta confirmed
    await new RestoreRoleAssignment(repo).execute(context(['roles.restore']), { ...command, confirmed: true });
    expect(repo.transition).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ transition: 'restore' }));
  });

  test('ChangeRole nega quando o ator não possui a capacidade específica da transição', async () => {
    const repo = repository();
    const command = {
      publicId: '33333333-3333-4333-8333-333333333333',
      expectedVersion: 1,
      requestId: 'r',
      reason: 'Motivo documentado',
      confirmed: true,
    };
    expect(() => new RevokeRoleAssignment(repo).execute(context(['roles.suspend']), command)).toThrow(AuthorizationDenied);
    await new RevokeRoleAssignment(repo).execute(context(['roles.revoke']), command);
    expect(repo.transition).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ transition: 'revoke' }));
  });

  test('ChangeRole rejeita publicId e expectedVersion inválidos', () => {
    const repo = repository();
    expect(() =>
      new SuspendRoleAssignment(repo).execute(context(['roles.suspend']), {
        publicId: 'não-uuid',
        expectedVersion: 1,
        requestId: 'r',
        reason: 'Motivo documentado',
      }),
    ).toThrow(RoleValidation);
    expect(() =>
      new SuspendRoleAssignment(repo).execute(context(['roles.suspend']), {
        publicId: '33333333-3333-4333-8333-333333333333',
        expectedVersion: 0,
        requestId: 'r',
        reason: 'Motivo documentado',
      }),
    ).toThrow(RoleValidation);
  });
});
