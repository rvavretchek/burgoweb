import { describe,expect,it } from 'vitest';
import { readFileSync } from 'node:fs';
const globalSql=readFileSync('migrations/global/006_invitations.sql','utf8');
describe('migrations de Convites',()=>{
  const tenantSql=readFileSync('migrations/tenant/005_invitations_capability.sql','utf8');
  it('persiste somente hash, finalidade, estados, outbox e idempotência',()=>{expect(globalSql).toContain('invitation_token_hash');expect(globalSql).not.toMatch(/temporary_password|raw_token/);expect(globalSql).toContain('invitation_outbox');expect(globalSql).toContain('invitation_idempotency');expect(globalSql).toContain("purpose='invitation'");});
  it('concede capacidade somente ao Síndico vigente e avança schema',()=>{expect(tenantSql).toContain("role_kind='syndic'");expect(tenantSql).toContain("state='active'");expect(tenantSql).toContain("'invitations.manage'");expect(tenantSql).toContain('VALUES (5, CURRENT_TIMESTAMP)');});
  it('impede duas Contas ativas representando a mesma Pessoa no tenant',()=>{expect(globalSql).toContain('memberships_one_active_person_tenant_idx');expect(globalSql).toContain('(tenant_id,person_id) WHERE state=\'active\'');});
});

describe('lifecycle persistido de Convites',()=>{it('materializa vencimento e encerra lease/outbox de forma retomável',()=>{expect(globalSql).toContain("SET state='expired'");expect(globalSql).toContain("last_error_code='expired'");expect(globalSql).toContain('leased_until=NULL');expect(globalSql).toContain("status IN('pending','leased')");});});
