import { describe, expect, it, vi } from 'vitest';
import { VerificationUnavailable } from '../packages/application/src/index.js';
import { createNestApplication } from '../apps/api/src/nest-app.js';

describe('API pública de verificação', () => {
  it('confirma somente por POST same-origin e uniformiza token indisponível', async () => {
    const confirm = vi.fn().mockResolvedValueOnce({ state: 'activated', message: 'Canal confirmado.' }).mockRejectedValue(new VerificationUnavailable());
    const app = await createNestApplication({ execute: vi.fn() }, { confirm: { execute: confirm }, resend: { execute: vi.fn(async () => ({ state: 'pending' as const, message: 'Neutra.' })) }, allowedOrigin: 'https://app.example.com' });
    const http = app.getHttpAdapter().getInstance(); const headers = { origin: 'https://app.example.com', 'sec-fetch-site': 'same-origin' };
    expect((await http.inject({ method: 'GET', url: '/verificar-email?token=secret' })).statusCode).toBe(404);
    const accepted = await http.inject({ method: 'POST', url: '/api/v1/email-verifications/confirm', headers, payload: { token: 'a'.repeat(43) } });
    expect(accepted.statusCode).toBe(200); expect(accepted.headers['referrer-policy']).toBe('no-referrer');
    const gone = await http.inject({ method: 'POST', url: '/api/v1/email-verifications/confirm', headers, payload: { token: 'b'.repeat(43) } });
    expect(gone.statusCode).toBe(410); expect(gone.body).not.toMatch(/hash|expired|used|cancelled/i);
    expect((await http.inject({ method: 'POST', url: '/api/v1/email-verifications/confirm', headers: { origin: 'https://evil.test', 'sec-fetch-site': 'cross-site' }, payload: { token: 'a'.repeat(43) } })).statusCode).toBe(403);
    await app.close();
  });

  it('reenvio responde 202 neutro e valida estrutura pública', async () => {
    const execute = vi.fn(async () => ({ state: 'pending' as const, message: 'Se houver solicitação elegível, será preparada.' }));
    const app = await createNestApplication({ execute: vi.fn() }, { resend: { execute }, allowedOrigin: 'https://app.example.com' }); const http = app.getHttpAdapter().getInstance(); const headers = { origin: 'https://app.example.com', 'sec-fetch-site': 'same-origin' };
    const requestId = '018f47d2-8287-7d8a-9000-111111111111';
    expect((await http.inject({ method: 'POST', url: '/api/v1/email-verifications/resend', headers, payload: { requestId, email: 'ana@example.com' } })).statusCode).toBe(202);
    expect((await http.inject({ method: 'POST', url: '/api/v1/email-verifications/resend', headers, payload: { requestId, email: 'ana@example.com', tenant: 'x' } })).statusCode).toBe(422);
    await app.close();
  });
});
