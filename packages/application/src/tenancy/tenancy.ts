import { MANAGE_INSTITUTIONAL_RECORDS } from './people-units.js';

export interface TenantSummary { readonly publicId: string; readonly displayName: string; readonly timeZone: string }
export interface TenantContext extends TenantSummary { readonly accountId: string; readonly personId: string; readonly membershipId: string; readonly tenantId: string; readonly schemaName: string; readonly authorizationVersion: number; readonly capabilities: readonly string[] }
export interface TenancyRepository {
  listAuthorized(accountId: string, now: Date): Promise<TenantSummary[]>;
  resolveContext(accountId: string, publicId: string, now: Date, capability: string, requestId: string): Promise<TenantContext | undefined>;
}
export class TenantAccessDenied extends Error {}
export class GetAuthorizedTenants { constructor(private readonly repository: TenancyRepository) {} execute(accountId: string, now = new Date()) { return this.repository.listAuthorized(accountId, now); } }
export class GetTenantDashboard {
  constructor(private readonly repository: TenancyRepository) {}
  async execute(accountId: string, publicId: string, now = new Date(), requestId = '') { const context = await this.repository.resolveContext(accountId, publicId, now, 'dashboard.read', requestId); if (!context) throw new TenantAccessDenied(); const actions = context.capabilities.includes(MANAGE_INSTITUTIONAL_RECORDS) ? [MANAGE_INSTITUTIONAL_RECORDS] : []; return { condominium: { publicId: context.publicId, displayName: context.displayName, timeZone: context.timeZone }, state: 'empty' as const, actions }; }
}
