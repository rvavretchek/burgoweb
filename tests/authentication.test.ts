import { describe, expect, it, vi } from 'vitest';
import { Authenticate, CsrfRejected, LogoutSession, RefreshSessionCsrf, ResolveSession, SessionUnavailable, type IdentityRepository, type SessionTokenCodec } from '../packages/application/src/index.js';
import { Argon2PasswordHasher } from '../packages/adapters/src/security/argon2-password-hasher.js';
import { loadSessionConfig } from '../packages/config/src/security-config.js';

const now = new Date('2026-07-30T20:00:00Z');
const credential = { accountId: 'a1', state: 'active' as const, emailVerified: true, encodedHash: 'hash', pepperVersion: 'v1' };

function setup(overrides: Partial<IdentityRepository> = {}) {
  const repository: IdentityRepository = {
    findCredential: vi.fn(async () => credential), createSession: vi.fn(async () => undefined), updateCredentialHash: vi.fn(async () => undefined), denyLogin: vi.fn(async () => undefined), limitLogin: vi.fn(async () => undefined),
    resolveSession: vi.fn(async () => ({ accountId: 'a1', expiresAt: new Date(now.getTime() + 60_000) })), addCsrfToken: vi.fn(async () => true), verifyCsrf: vi.fn(async () => true), revokeSession: vi.fn(async () => 'revoked' as const), ...overrides,
  };
  const hasher = { hash: vi.fn(async () => ({ encodedHash: 'new', pepperVersion: 'v2' })), verify: vi.fn(async () => ({ valid: true, needsRehash: false })) };
  const codec: SessionTokenCodec = { issue: vi.fn(() => ({ token: 'raw-session', tokenHash: 'session-hash', csrfToken: 'raw-csrf', csrfHash: 'csrf-hash' })), issueCsrf:vi.fn(()=>({csrfToken:'fresh-csrf',csrfHash:'fresh-csrf-hash'})), hash: vi.fn(value => `${value}-hash`) };
  return { repository, hasher, codec };
}

describe('autenticação e sessão opaca', () => {
  it('usa throttle de touch de 5 minutos e rejeita TTL fora do limite seguro',()=>{const base={BURGOWEB_SESSION_SECRET:'s'.repeat(32),BURGOWEB_RATE_LIMIT_KEY:'r'.repeat(32)};expect(loadSessionConfig(base).touchIntervalSeconds).toBe(300);expect(()=>loadSessionConfig({...base,BURGOWEB_SESSION_ABSOLUTE_TTL_SECONDS:String(31_536_001)})).toThrow(/safe limit|limite seguro/);expect(()=>loadSessionConfig({...base,BURGOWEB_SESSION_IDLE_TTL_SECONDS:'300',BURGOWEB_SESSION_TOUCH_INTERVAL_SECONDS:'300'})).toThrow();});
  it('cria sessão hash-only para Conta ativa e credencial válida', async () => {
    const deps = setup();
    const result = await new Authenticate({ ...deps, now: () => now, absoluteTtlSeconds: 3600, idleTtlSeconds: 900 }).execute({ email: ' ANA@EXAMPLE.COM ', password: 'segredo', requestId: 'r1' });
    expect(result).toEqual({ token: 'raw-session', csrfToken: 'raw-csrf', maxAgeSeconds: 3600 });
    expect(deps.repository.findCredential).toHaveBeenCalledWith('ana@example.com');
    expect(deps.repository.createSession).toHaveBeenCalledWith(expect.objectContaining({ tokenHash: 'session-hash', csrfHash: 'csrf-hash', accountId: 'a1' }));
    expect(JSON.stringify((deps.repository.createSession as ReturnType<typeof vi.fn>).mock.calls)).not.toContain('raw-session');
  });
  it('executa dummy verify para Conta ausente e produz falha pública única', async () => {
    const deps = setup({ findCredential: vi.fn(async () => undefined) });
    await expect(new Authenticate({ ...deps, now: () => now, absoluteTtlSeconds: 3600, idleTtlSeconds: 900, dummyHash: { encodedHash: 'dummy', pepperVersion: 'v1' } }).execute({ email: 'missing@example.com', password: 'x', requestId: 'r2' })).rejects.toBeInstanceOf(SessionUnavailable);
    expect(deps.hasher.verify).toHaveBeenCalledWith({ encodedHash: 'dummy', pepperVersion: 'v1' }, 'x');
    expect(deps.repository.denyLogin).toHaveBeenCalled();
  });
  it('faz rehash progressivo por compare-and-swap', async () => {
    const deps = setup(); deps.hasher.verify.mockResolvedValue({ valid: true, needsRehash: true });
    await new Authenticate({ ...deps, now: () => now, absoluteTtlSeconds: 3600, idleTtlSeconds: 900 }).execute({ email: 'a@b.com', password: 'x', requestId: 'r3' });
    expect(deps.repository.updateCredentialHash).toHaveBeenCalledWith('a1', { encodedHash: 'hash', pepperVersion: 'v1' }, { encodedHash: 'new', pepperVersion: 'v2' });
  });
  it.each([{state:'disabled' as const,emailVerified:true},{state:'active' as const,emailVerified:false}])('nega Conta indisponível sem criar sessão',async unavailable=>{const deps=setup({findCredential:vi.fn(async()=>({...credential,...unavailable}))});await expect(new Authenticate({...deps,now:()=>now,absoluteTtlSeconds:3600,idleTtlSeconds:900}).execute({email:'a@b.com',password:'x',requestId:'r'})).rejects.toBeInstanceOf(SessionUnavailable);expect(deps.repository.createSession).not.toHaveBeenCalled();});
  it('neutraliza pepper desconhecido e hash malformado sem lançar',async()=>{const hasher=new Argon2PasswordHasher({pepper:'p'.repeat(32),pepperVersion:'v2'});await expect(hasher.verify({encodedHash:'malformed',pepperVersion:'missing'},'x')).resolves.toEqual({valid:false,needsRehash:false});await expect(hasher.verify({encodedHash:'malformed',pepperVersion:'v2'},'x')).resolves.toEqual({valid:false,needsRehash:false});});
  it('resolve sessão vigente e logout exige CSRF ligado à sessão', async () => {
    const deps = setup();
    await expect(new ResolveSession({ repository: deps.repository, codec: deps.codec, now: () => now }).execute('raw-session')).resolves.toMatchObject({ accountId: 'a1' });
    await new LogoutSession({ repository: deps.repository, codec: deps.codec, now: () => now }).execute('raw-session', 'raw-csrf', 'r4');
    expect(deps.repository.revokeSession).toHaveBeenCalledWith('raw-session-hash', 'raw-csrf-hash', now, 'r4');
  });
  it('não resolve nem toca sessão antes de validar CSRF no logout',async()=>{const deps=setup();await expect(new LogoutSession({repository:deps.repository,codec:deps.codec,now:()=>now}).execute('raw-session','','r')).rejects.toBeInstanceOf(CsrfRejected);expect(deps.repository.resolveSession).not.toHaveBeenCalled();expect(deps.repository.revokeSession).not.toHaveBeenCalled();});
  it('emite CSRF recuperável por aba ligado à sessão',async()=>{const deps=setup();await expect(new RefreshSessionCsrf({repository:deps.repository,codec:deps.codec,now:()=>now}).execute('raw-session')).resolves.toEqual({csrfToken:'fresh-csrf'});expect(deps.repository.addCsrfToken).toHaveBeenCalledWith('raw-session-hash','fresh-csrf-hash',now);});
});
