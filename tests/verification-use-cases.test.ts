import { describe, expect, it, vi } from 'vitest';
import { ResendEmailVerification, VerificationTokenIssuer, type VerificationRepository } from '../packages/application/src/index.js';
import { HmacVerificationTokenCodec } from '../packages/adapters/src/index.js';

const codec = new HmacVerificationTokenCodec({ currentVersion: 'v1', keys: { v1: 'k'.repeat(32) } });

describe('emissão e reenvio de verificação', () => {
  it('emite somente material hash-only persistível com validade finita', () => {
    const ids = ['verification-id', 'outbox-id'];
    const issuer = new VerificationTokenIssuer({ codec, keyVersion: 'v1', ttlSeconds: 3600, uuid: () => ids.shift()!, now: () => new Date('2026-07-30T12:00:00Z') });
    const material = issuer.issue({ accountId: 'account-id', requestId: 'request-id' });
    expect(material).toMatchObject({ verificationId: 'verification-id', outboxId: 'outbox-id', accountId: 'account-id', requestId: 'request-id', purpose: 'email-verification', keyVersion: 'v1', tokenHash: expect.stringMatching(/^[a-f0-9]{64}$/) });
    expect(material.expiresAt.toISOString()).toBe('2026-07-30T13:00:00.000Z');
    expect(JSON.stringify(material)).not.toMatch(/"token"|raw|secret/i);
    expect(issuer.reconstruct(material)).toHaveLength(43);
  });

  it('retorna resposta neutra tanto para candidato elegível quanto inexistente', async () => {
    const issue = vi.fn();
    const repository: VerificationRepository = { reissue: vi.fn(async (_command, factory) => { factory({ accountId: 'account', requestId: 'request' }); return true; }), confirm: vi.fn() };
    const issuer = { issue } as unknown as VerificationTokenIssuer;
    issue.mockReturnValue({ verificationId: 'v', outboxId: 'o', accountId: 'account', requestId: 'request', purpose: 'email-verification', keyVersion: 'v1', tokenHash: 'a'.repeat(64), issuedAt: new Date(), expiresAt: new Date() });
    const useCase = new ResendEmailVerification({ repository, issuer });
    const eligible = await useCase.execute({ requestId: 'request', email: 'ana@example.com' });
    expect(eligible).toEqual({ state: 'pending', message: 'Se houver uma solicitação elegível, uma nova verificação será preparada.' });
    expect(issue).toHaveBeenCalled();

    const absent = new ResendEmailVerification({ repository: { reissue: vi.fn(async () => false), confirm: vi.fn() }, issuer });
    expect(await absent.execute({ requestId: 'unknown', email: 'nobody@example.com' })).toEqual(eligible);
  });
});
