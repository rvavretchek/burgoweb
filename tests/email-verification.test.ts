import { describe, expect, it } from 'vitest';
import { HmacVerificationTokenCodec } from '../packages/adapters/src/index.js';
import { loadEmailDeliveryConfig, loadVerificationConfig } from '../packages/config/src/index.js';

const context = {
  verificationId: '018f47d2-8287-7d8a-9000-111111111111',
  outboxId: '018f47d2-8287-7d8a-9000-222222222222',
  accountId: '018f47d2-8287-7d8a-9000-333333333333',
  requestId: '018f47d2-8287-7d8a-9000-444444444444',
  issuedAt: new Date('2026-07-30T12:00:00Z'),
  purpose: 'email-verification' as const,
  keyVersion: 'v2',
};

describe('token de verificação de e-mail', () => {
  it('reconstrói token opaco sem persistir material secreto e separa finalidade/contexto', () => {
    const codec = new HmacVerificationTokenCodec({ currentVersion: 'v2', keys: { v1: 'a'.repeat(32), v2: 'b'.repeat(32) } });
    const token = codec.derive(context);
    expect(token).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(codec.hash(token)).toMatch(/^[a-f0-9]{64}$/);
    expect(codec.derive(context)).toBe(token);
    expect(codec.derive({ ...context, requestId: 'other' })).not.toBe(token);
    expect(codec.matches(token, codec.hash(token))).toBe(true);
    expect(codec.matches(`${token.slice(0, -1)}x`, codec.hash(token))).toBe(false);
    expect(JSON.stringify(context)).not.toContain(token);
  });

  it('reconstrói tokens vigentes com chave anterior e falha fechado para versão desconhecida', () => {
    const codec = new HmacVerificationTokenCodec({ currentVersion: 'v2', keys: { v1: 'a'.repeat(32), v2: 'b'.repeat(32) } });
    expect(codec.derive({ ...context, keyVersion: 'v1' })).not.toBe(codec.derive(context));
    expect(() => codec.derive({ ...context, keyVersion: 'missing' })).toThrow(/versão/i);
  });
});

describe('configuração de verificação', () => {
  const valid = {
    BURGOWEB_VERIFICATION_BASE_URL: 'https://app.example.com',
    BURGOWEB_VERIFICATION_TOKEN_KEY: 'k'.repeat(32),
    BURGOWEB_VERIFICATION_TOKEN_KEY_VERSION: 'v1',
    BURGOWEB_EMAIL_FROM: 'Burgoweb <nao-responda@example.com>',
    BURGOWEB_EMAIL_PRIMARY_API_KEY: 'primary-secret',
    BURGOWEB_EMAIL_FALLBACK_API_KEY: 'fallback-secret',
  };

  it('carrega defaults operacionais seguros e keyring versionado', () => {
    expect(loadVerificationConfig(valid)).toMatchObject({ tokenTtlSeconds: 3600, leaseSeconds: 30, maxAttempts: 5, currentKeyVersion: 'v1' });
  });

  it.each([
    ['base URL insegura', { ...valid, BURGOWEB_VERIFICATION_BASE_URL: 'http://example.com' }],
    ['chave curta', { ...valid, BURGOWEB_VERIFICATION_TOKEN_KEY: 'short' }],
  ])('falha fechado quando %s', (_name, env) => expect(() => loadVerificationConfig(env)).toThrow());

  it.each([
    ['remetente ausente', { ...valid, BURGOWEB_EMAIL_FROM: '' }],
    ['credencial primária ausente', { ...valid, BURGOWEB_EMAIL_PRIMARY_API_KEY: '' }],
  ])('falha fechado na entrega quando %s', (_name, env) => expect(() => loadEmailDeliveryConfig(env)).toThrow());
});
