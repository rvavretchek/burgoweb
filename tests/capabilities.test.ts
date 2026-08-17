import { describe, expect, test, vi } from 'vitest';
import {
  CAPABILITY_CATALOG,
  CapabilityValidation,
  GrantCapability,
  ListCapabilityGrants,
  RevokeCapability,
  isAvailableCapability,
  isKnownCapability,
  resolveEffectiveDelegatedCapabilities,
  transitionCapabilityGrant,
  validateCapabilityDraft,
  type CapabilityDraft,
  type CapabilityGrantRepository,
} from '../packages/application/src/authorization/capabilities.js';
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
const draft = (overrides: Partial<CapabilityDraft> = {}): CapabilityDraft => ({
  personPublicId: '22222222-2222-4222-8222-222222222222',
  capabilityId: 'roles.suspend',
  validFrom: '2026-08-11T09:00',
  ...overrides,
});
const repository = (
  overrides: Partial<CapabilityGrantRepository> = {},
): CapabilityGrantRepository => ({
  list: vi.fn(),
  grant: vi.fn(),
  revoke: vi.fn(),
  materialize: vi.fn(),
  ...overrides,
});

describe('Story 1.9 - catálogo e domínio de capacidades delegadas', () => {
  test('mantém catálogo fechado com apenas roles.suspend e financial-responsibles.manage disponíveis para delegação real', () => {
    const available = CAPABILITY_CATALOG.filter((entry) => entry.available).map((entry) => entry.id);
    expect(available.sort()).toEqual(['financial-responsibles.manage', 'roles.suspend'].sort());
    expect(CAPABILITY_CATALOG.some((entry) => entry.id === 'financial.entries.manage' && !entry.available)).toBe(true);
    expect(CAPABILITY_CATALOG.some((entry) => entry.id === 'people-units-relationships.manage' && !entry.available)).toBe(true);
    expect(CAPABILITY_CATALOG.some((entry) => entry.id === 'invitations.manage' && !entry.available)).toBe(true);
  });

  test('isKnownCapability/isAvailableCapability distinguem catálogo de disponibilidade', () => {
    expect(isKnownCapability('roles.suspend')).toBe(true);
    expect(isAvailableCapability('roles.suspend')).toBe(true);
    expect(isKnownCapability('financial.entries.manage')).toBe(true);
    expect(isAvailableCapability('financial.entries.manage')).toBe(false);
    expect(isKnownCapability('poder-inexistente')).toBe(false);
    expect(isAvailableCapability('poder-inexistente')).toBe(false);
  });

  test('aplica a máquina de estados sem suspensão e mantém revogação terminal', () => {
    expect(transitionCapabilityGrant('scheduled', 'activate')).toBe('active');
    expect(transitionCapabilityGrant('active', 'expire')).toBe('expired');
    expect(transitionCapabilityGrant('scheduled', 'revoke')).toBe('revoked');
    expect(() => transitionCapabilityGrant('active', 'activate')).toThrow(CapabilityValidation);
    expect(() => transitionCapabilityGrant('revoked', 'revoke')).toThrow(CapabilityValidation);
  });

  test('resolveEffectiveDelegatedCapabilities une somente concessões ativas e vigentes', () => {
    const now = new Date('2026-08-10T15:00:00Z');
    expect(
      resolveEffectiveDelegatedCapabilities(
        [
          { capabilityId: 'roles.suspend', state: 'active', validFrom: new Date('2026-08-01Z'), validUntil: null },
          { capabilityId: 'invitations.manage', state: 'scheduled', validFrom: new Date('2026-08-01Z'), validUntil: null },
          { capabilityId: 'people-units-relationships.manage', state: 'active', validFrom: new Date('2026-08-01Z'), validUntil: new Date('2026-08-05Z') },
        ],
        now,
      ),
    ).toEqual(['roles.suspend']);
  });

  test('validateCapabilityDraft rejeita capability-id desconhecido, indisponível e vigência invertida', () => {
    expect(() => validateCapabilityDraft(draft({ capabilityId: 'poder-inexistente' }), 'America/Sao_Paulo')).toThrow(CapabilityValidation);
    expect(() => validateCapabilityDraft(draft({ capabilityId: 'financial.entries.manage' }), 'America/Sao_Paulo')).toThrow(CapabilityValidation);
    expect(() =>
      validateCapabilityDraft(draft({ validFrom: '2026-08-11T09:00', validUntil: '2026-08-11T08:00' }), 'America/Sao_Paulo'),
    ).toThrow(CapabilityValidation);
  });

  test('validateCapabilityDraft resolve o horário civil contra o fuso do Condomínio', () => {
    const result = validateCapabilityDraft(draft(), 'America/Sao_Paulo');
    expect(result.validFrom).toBe('2026-08-11T12:00:00.000Z');
  });

  test('ListCapabilityGrants/GrantCapability/RevokeCapability negam sem capabilities.grant', async () => {
    const repo = repository();
    await expect(new ListCapabilityGrants(repo).execute(context([]))).rejects.toBeInstanceOf(AuthorizationDenied);
    expect(() =>
      new GrantCapability(repo).execute(context([]), { ...draft(), confirmed: true, idempotencyKey: 'k', requestId: 'r' }),
    ).toThrow(AuthorizationDenied);
    expect(() =>
      new RevokeCapability(repo).execute(context([]), { publicId: '33333333-3333-4333-8333-333333333333', expectedVersion: 1, confirmed: true, requestId: 'r' }),
    ).toThrow(AuthorizationDenied);
  });

  test('ListCapabilityGrants sem capabilities.grant lista somente as próprias concessões (AC12)', async () => {
    const repo = repository({ list: vi.fn().mockResolvedValue({ items: [] }) });
    const result = await new ListCapabilityGrants(repo).execute(context(['roles.read']));
    expect(repo.list).toHaveBeenCalledWith(expect.anything(), undefined, { selfOnly: true });
    expect(result.viewerCapabilities).toEqual(['roles.read']);
    expect(result.catalog).toBe(CAPABILITY_CATALOG);
  });

  test('ListCapabilityGrants com capabilities.grant lista todas as concessões do Condomínio', async () => {
    const repo = repository({ list: vi.fn().mockResolvedValue({ items: [] }) });
    await new ListCapabilityGrants(repo).execute(context(['capabilities.grant']));
    expect(repo.list).toHaveBeenCalledWith(expect.anything(), undefined, undefined);
  });

  test('GrantCapability exige confirmação e Idempotency-Key e delega ao repositório', async () => {
    const repo = repository();
    expect(() =>
      new GrantCapability(repo).execute(context(['capabilities.grant']), { ...draft(), confirmed: false, idempotencyKey: 'k', requestId: 'r' }),
    ).toThrow(CapabilityValidation);
    await new GrantCapability(repo).execute(context(['capabilities.grant']), {
      ...draft(),
      confirmed: true,
      idempotencyKey: ' key-1 ',
      requestId: 'r1',
    });
    expect(repo.grant).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ confirmed: true, idempotencyKey: 'key-1', capabilityId: 'roles.suspend' }),
    );
  });

  test('RevokeCapability exige confirmação explícita e publicId/expectedVersion válidos', async () => {
    const repo = repository();
    const publicId = '33333333-3333-4333-8333-333333333333';
    expect(() =>
      new RevokeCapability(repo).execute(context(['capabilities.grant']), { publicId, expectedVersion: 1, requestId: 'r' }),
    ).toThrow(CapabilityValidation);
    expect(() =>
      new RevokeCapability(repo).execute(context(['capabilities.grant']), { publicId: 'não-uuid', expectedVersion: 1, confirmed: true, requestId: 'r' }),
    ).toThrow(CapabilityValidation);
    await new RevokeCapability(repo).execute(context(['capabilities.grant']), { publicId, expectedVersion: 1, confirmed: true, requestId: 'r' });
    expect(repo.revoke).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ publicId, confirmed: true }));
  });
});
