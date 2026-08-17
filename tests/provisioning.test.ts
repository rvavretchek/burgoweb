import { describe, expect, it, vi } from 'vitest';
import { canonicalRequestHash, CreateCondominium, ProvisioningProblem, validateCreateCommand, type CreateCondominiumCommand, type ProvisioningRepository, type StoredProvisioning } from '../packages/application/src/index.js';
import { loadRuntimeConfig, loadSecurityConfig } from '../packages/config/src/index.js';
import { redact } from '../packages/adapters/src/observability/redaction.js';
import { Argon2PasswordHasher } from '../packages/adapters/src/security/argon2-password-hasher.js';

const command: CreateCondominiumCommand = { person: { fullName: 'Ana Silva' }, account: { email: 'ana@example.com' }, condominium: { displayName: 'Residencial Sol' }, password: 'uma senha longa e segura', authorityDeclarationAccepted: true };

function harness() {
  const records = new Map<string, StoredProvisioning>();
  const persisted: unknown[] = [];
  const repository: ProvisioningRepository = {
    findByIdempotencyKey: async key => records.get(key),
    begin: async record => { records.set(record.idempotencyKey, record); },
    accountExists: async () => false,
    persistGlobal: async value => { persisted.push(value); return { existingAccount: false, seed: { personId: 'person-id', authorityId: 'authority-id', fullName: value.command.person.fullName, acceptedAt: value.acceptedAt } }; },
    markPending: async (key, result, event) => { records.set(key, { ...records.get(key)!, state: 'pending-email-verification', result }); await audit.record(event); },
    markFailure: async (key, state) => { records.set(key, { ...records.get(key)!, state }); },
  };
  const tenantProvisioner = { createAndMigrate: vi.fn(async () => undefined), compensate: vi.fn(async () => true), decoy: vi.fn(async () => undefined) };
  const passwordHasher = { hash: vi.fn(async () => ({ encodedHash: 'opaque', pepperVersion: 'v1' })), verify: vi.fn(async () => ({ valid: true, needsRehash: false })) };
  const audit = { record: vi.fn(async (_event: unknown) => undefined) };
  const ids = ['request-id', 'public-id', 'schema-id'];
  return { useCase: new CreateCondominium({ repository, tenantProvisioner, passwordHasher, audit, now: () => new Date('2026-07-28T18:00:00Z'), uuid: () => ids.shift()! }), records, persisted, tenantProvisioner, audit };
}

describe('contrato de provisionamento', () => {
  it('exige a declaração sem consentimento implícito', () => {
    expect(() => validateCreateCommand({ ...command, authorityDeclarationAccepted: false })).toThrowError(ProvisioningProblem);
  });

  it('normaliza e gera hash canônico estável sem confundir conteúdo diferente', () => {
    expect(canonicalRequestHash(command)).toBe(canonicalRequestHash({ ...command, account: { email: ' ANA@EXAMPLE.COM ' } }));
    expect(canonicalRequestHash(command)).not.toBe(canonicalRequestHash({ ...command, condominium: { displayName: 'Outro' } }));
  });

  it('persiste declaração versionada e termina pendente, nunca ativo', async () => {
    const h = harness();
    const result = await h.useCase.execute(command, 'key-1');
    expect(result.state).toBe('pending-email-verification');
    expect(JSON.stringify(result)).not.toMatch(/password|hash|pepper|schema/i);
    expect(h.persisted[0]).toMatchObject({ declarationVersion: '2026-07-28', schemaName: 'tenant_schemaid' });
  });

  it('reproduz o resultado conhecido e rejeita a mesma chave com conteúdo divergente', async () => {
    const h = harness();
    const first = await h.useCase.execute(command, 'key-1');
    expect(await h.useCase.execute(command, 'key-1')).toEqual(first);
    await expect(h.useCase.execute({ ...command, condominium: { displayName: 'Outro' } }, 'key-1')).rejects.toMatchObject({ status: 409 });
    expect(h.tenantProvisioner.createAndMigrate).toHaveBeenCalledTimes(1);
  });

  it('compensa falha parcial e não deixa estado utilizável', async () => {
    const h = harness();
    h.tenantProvisioner.createAndMigrate.mockRejectedValueOnce(new Error('failpoint'));
    await expect(h.useCase.execute(command, 'key-fail')).rejects.toMatchObject({ status: 503 });
    expect(h.records.get('key-fail')?.state).toBe('compensated');
  });
});

describe('segurança', () => {
  it('usa Argon2id com salt individual e pepper versionado', async () => {
    const hasher = new Argon2PasswordHasher({ pepper: 'p'.repeat(32), pepperVersion: 'v1' });
    const first = await hasher.hash('uma senha longa e segura');
    const second = await hasher.hash('uma senha longa e segura');
    expect(first.encodedHash).toMatch(/^\$argon2id\$/);
    expect(first.encodedHash).not.toBe(second.encodedHash);
    expect(await hasher.verify(first, 'uma senha longa e segura')).toEqual({ valid: true, needsRehash: false });
    expect(JSON.stringify(first)).not.toContain('p'.repeat(32));
  });
  it('falha fechado sem pepper runtime coerente', () => {
    expect(() => loadSecurityConfig({})).toThrow(/credencial/i);
    expect(loadSecurityConfig({ BURGOWEB_PASSWORD_PEPPER: 'x'.repeat(32), BURGOWEB_PASSWORD_PEPPER_VERSION: 'v1' })).toMatchObject({ pepper: 'x'.repeat(32), pepperVersion: 'v1', previousPeppers: {} });
  });

  it('falha no startup sem banco/pepper e resolve configuração tipada coerente', () => {
    expect(() => loadRuntimeConfig({})).toThrow(/configuração/i);
    expect(loadRuntimeConfig({ BURGOWEB_DATABASE_URL: 'postgres://localhost/burgoweb', BURGOWEB_PASSWORD_PEPPER: 'x'.repeat(32), BURGOWEB_PASSWORD_PEPPER_VERSION: 'v1', BURGOWEB_SESSION_SECRET: 's'.repeat(32), BURGOWEB_RATE_LIMIT_KEY: 'r'.repeat(32), BURGOWEB_API_PORT: '3100', BURGOWEB_VERIFICATION_BASE_URL: 'https://app.example.com', BURGOWEB_VERIFICATION_TOKEN_KEY: 'k'.repeat(32), BURGOWEB_VERIFICATION_TOKEN_KEY_VERSION: 'v1', BURGOWEB_RECOVERY_TOKEN_KEY: 'q'.repeat(32), BURGOWEB_RECOVERY_TOKEN_KEY_VERSION: 'v1', BURGOWEB_INVITATION_TOKEN_KEY: 'i'.repeat(32), BURGOWEB_INVITATION_TOKEN_KEY_VERSION: 'v1' })).toMatchObject({ databaseUrl: 'postgres://localhost/burgoweb', port: 3100, security: { pepperVersion: 'v1' }, session: { absoluteTtlSeconds: 28_800 }, verification: { currentKeyVersion: 'v1' }, recovery: { currentKeyVersion: 'v1' }, invitation: { currentKeyVersion: 'v1' } });
  });

  it('redige segredos e dados pessoais recursivamente', () => {
    expect(redact({ password: 'secret', nested: { email: 'ana@example.com', safe: 'ok' } })).toEqual({ password: '[REDACTED]', nested: { email: '[REDACTED]', safe: 'ok' } });
  });
});
