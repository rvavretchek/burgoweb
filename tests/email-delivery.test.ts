import { describe, expect, it, vi } from 'vitest';
import { ProcessVerificationEmail, type ClaimedVerificationEmail, type VerificationOutboxRepository } from '../packages/application/src/index.js';
import { HmacVerificationTokenCodec, HttpEmailPort, MailpitEmailPort } from '../packages/adapters/src/index.js';

const item: ClaimedVerificationEmail = { verificationId: 'v', outboxId: 'o', accountId: 'a', requestId: 'r', purpose: 'email-verification', keyVersion: 'v1', issuedAt: new Date('2026-07-30T12:00:00Z'), expiresAt: new Date('2026-07-30T13:00:00Z'), tokenHash: '', to: 'ana@example.com', attemptNumber: 1, leaseOwner: 'worker' };

describe('worker e adapters de e-mail', () => {
  it('produz mensagem minimizada, link em fragmento e finaliza somente após aceite', async () => {
    const codec = new HmacVerificationTokenCodec({ currentVersion: 'v1', keys: { v1: 'k'.repeat(32) } });
    item.tokenHash = codec.hash(codec.derive(item));
    const finish = vi.fn(); const send = vi.fn(async (_message: { html: string }) => ({ kind: 'accepted' as const, providerReference: 'provider-id' }));
    const repository: VerificationOutboxRepository = { claim: vi.fn(async () => item), renew: vi.fn(async () => true), finish };
    expect(await new ProcessVerificationEmail({ repository, email: { send }, codec, baseUrl: 'https://app.example.com', leaseSeconds: 30, maxAttempts: 5, owner: 'worker', now: () => new Date('2026-07-30T12:01:00Z') }).execute()).toBe(true);
    const message = send.mock.calls[0]![0];
    expect(message.html).toContain('/verificar-email#token=');
    expect(message.html).not.toMatch(/tracking|condomínio|senha/i);
    expect(finish).toHaveBeenCalledWith(item, { kind: 'accepted', providerReference: 'provider-id' }, expect.any(Date), undefined);
  });

  it('classifica HTTP e não usa contingência após timeout ambíguo', async () => {
    const transientThenAccepted = vi.fn().mockResolvedValueOnce(new Response('', { status: 503 })).mockResolvedValueOnce(new Response('{"id":"fallback"}', { status: 200 }));
    const port = new HttpEmailPort({ from: 'noreply@example.com', primary: { name: 'brevo', endpoint: 'https://brevo.test', apiKey: 'a' }, fallback: { name: 'resend', endpoint: 'https://resend.test', apiKey: 'b' }, fetch: transientThenAccepted });
    const message = { to: 'ana@example.com', subject: 's', text: 't', html: '<p>t</p>', idempotencyKey: 'o' };
    expect(await port.send(message)).toEqual({ kind: 'accepted', providerReference: 'fallback' });
    expect(transientThenAccepted).toHaveBeenCalledTimes(2);
    const network = vi.fn(async () => { throw new TypeError('network'); });
    expect((await new HttpEmailPort({ from: 'noreply@example.com', primary: { name: 'brevo', endpoint: 'https://brevo.test', apiKey: 'a' }, fallback: { name: 'resend', endpoint: 'https://resend.test', apiKey: 'b' }, fetch: network }).send(message)).kind).toBe('ambiguous');
    expect(network).toHaveBeenCalledTimes(1);
  });

  it('envia ao Mailpit local com o contrato HTTP oficial sem expor segredo adicional', async () => {
    const fetcher = vi.fn(async (_input: RequestInfo | URL, _init?: RequestInit) => new Response('{}', { status: 200 }));
    const result = await new MailpitEmailPort({ endpoint: 'http://127.0.0.1:8025/api/v1/send', from: 'nao-responda@burgoweb.local', fetch: fetcher }).send({ to: 'ana@example.com', subject: 'Confirme', text: 'texto', html: '<p>texto</p>', idempotencyKey: 'outbox-id' });
    expect(result).toEqual({ kind: 'accepted', providerReference: 'mailpit-outbox-id' });
    const request = JSON.parse(String(fetcher.mock.calls[0]![1]?.body));
    expect(request).toMatchObject({ From: { Email: 'nao-responda@burgoweb.local', Name: 'Burgoweb' }, To: [{ Email: 'ana@example.com' }], Subject: 'Confirme', Tags: ['email-verification'] });
  });
});
