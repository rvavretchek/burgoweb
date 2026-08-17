import { describe, expect, it, vi } from 'vitest';
import { GetAuthorizedTenants, GetTenantDashboard, TenantAccessDenied, type TenancyRepository } from '../packages/application/src/index.js';

describe('seleção e TenantContext deny-by-default', () => {
  it('lista somente projeções vigentes e minimizadas', async () => {
    const repository: TenancyRepository = { listAuthorized: vi.fn(async () => [{ publicId: 'p1', displayName: 'Sol', timeZone: 'America/Sao_Paulo' }]), resolveContext: vi.fn() };
    await expect(new GetAuthorizedTenants(repository).execute('a1', new Date())).resolves.toEqual([{ publicId: 'p1', displayName: 'Sol', timeZone: 'America/Sao_Paulo' }]);
  });
  it('nega antes de consultar tenant quando projeção global não autoriza', async () => {
    const repository: TenancyRepository = { listAuthorized: vi.fn(), resolveContext: vi.fn(async () => undefined) };
    const at = new Date(); await expect(new GetTenantDashboard(repository).execute('a1', 'p2', at, 'r1')).rejects.toBeInstanceOf(TenantAccessDenied);
    expect(repository.resolveContext).toHaveBeenCalledWith('a1', 'p2', at, 'dashboard.read', 'r1');
  });
  it('entrega estado vazio apenas com capacidade efetiva', async () => {
    const context = { accountId: 'a1', personId: 'person', membershipId: 'm1', tenantId: 't1', publicId: 'p1', schemaName: 'tenant_0123456789abcdef0123456789abcdef', displayName: 'Sol', timeZone: 'America/Sao_Paulo', authorizationVersion: 1, capabilities: ['dashboard.read'] };
    const repository: TenancyRepository = { listAuthorized: vi.fn(), resolveContext: vi.fn(async () => context) };
    await expect(new GetTenantDashboard(repository).execute('a1', 'p1', new Date(), 'r2')).resolves.toEqual({ condominium: { publicId: 'p1', displayName: 'Sol', timeZone: 'America/Sao_Paulo' }, state: 'empty', actions: [] });
  });
});
