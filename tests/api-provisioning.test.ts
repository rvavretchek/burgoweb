import { describe, expect, it, vi } from 'vitest';
import { ProvisioningProblem, type PublicMutationRateLimiter } from '../packages/application/src/index.js';
import { createNestApplication } from '../apps/api/src/nest-app.js';

function fakeRateLimiter(): PublicMutationRateLimiter {
  const counts = new Map<string, number>();
  return {
    async consume(operation, signals, _now, limit) {
      const key = `${operation}|${signals.join('|')}`;
      const count = (counts.get(key) ?? 0) + 1;
      counts.set(key, count);
      return count <= limit;
    },
  };
}

describe('API pública de provisionamento', () => {
  it('sobe pelo composition root NestJS/platform-fastify e publica OpenAPI minimizado', async () => {
    const app = await createNestApplication({ execute: vi.fn(async () => ({ requestId: 'r', publicCondominiumId: 'c', state: 'pending-email-verification' as const, message: 'Pendente.' })) });
    const response = await app.getHttpAdapter().getInstance().inject({ method: 'GET', url: '/api/v1/openapi.json' });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({ openapi: '3.1.0', paths: { '/api/v1/provisioning/condominiums': { post: { operationId: 'createCondominium' } } } });
    expect(response.body).not.toMatch(/encodedHash|pepper|schemaName|tokenHash|rawToken|cookie/i);
    await app.close();
  });
  it('valida runtime, ignora correlação não confiável e bloqueia TenantContext no Nest', async () => {
    const execute = vi.fn();
    const app = await createNestApplication({ execute });
    const fastify = app.getHttpAdapter().getInstance();
    const invalid = await fastify.inject({ method: 'POST', url: '/api/v1/provisioning/condominiums', headers: { 'idempotency-key': 'key', 'sec-fetch-site': 'same-origin', 'x-request-id': 'senha-ou-injecao\n' }, payload: {} });
    expect(invalid.statusCode).toBe(422);
    expect(invalid.headers['content-type']).toContain('application/problem+json');
    expect(invalid.headers['x-request-id']).toMatch(/^[0-9a-f-]{36}$/);
    expect(execute).not.toHaveBeenCalled();
    expect((await fastify.inject({ method: 'GET', url: '/api/v1/tenants/opaque/context' })).statusCode).toBe(404);
    await app.close();
  });

  it('aplica limite por operação e sinais de origem, nunca somente IP', async () => {
    const app = await createNestApplication({ execute: vi.fn(async () => ({ requestId: 'r', publicCondominiumId: 'c', state: 'pending-email-verification' as const, message: 'Pendente.' })) }, { rateLimiter: fakeRateLimiter() });
    const fastify = app.getHttpAdapter().getInstance();
    const request = () => fastify.inject({ method: 'POST', url: '/api/v1/provisioning/condominiums', headers: { 'idempotency-key': crypto.randomUUID(), 'sec-fetch-site': 'same-origin', 'user-agent': 'browser-a', 'accept-language': 'pt-BR' }, payload: { fullName: 'Ana', email: 'ana@example.com', condominiumName: 'Sol', password: 'senha suficientemente longa', authorityDeclarationAccepted: true } });
    for (let count = 0; count < 5; count += 1) expect((await request()).statusCode).toBe(202);
    expect((await request()).statusCode).toBe(429);
    const otherSignals = await fastify.inject({ method: 'POST', url: '/api/v1/provisioning/condominiums', headers: { 'idempotency-key': 'other', 'sec-fetch-site': 'same-origin', 'user-agent': 'browser-b', 'accept-language': 'en' }, payload: { fullName: 'Ana', email: 'ana@example.com', condominiumName: 'Sol', password: 'senha suficientemente longa', authorityDeclarationAccepted: true } });
    expect(otherSignals.statusCode).toBe(202);
    await app.close();
  });
  it('publica resposta pendente, correlação e não expõe segredo/schema', async () => {
    const execute = vi.fn(async () => ({ requestId: 'public-request', publicCondominiumId: 'public-tenant', state: 'pending-email-verification' as const, message: 'Pendente de verificação.' }));
    const app = await createNestApplication({ execute });
    const response = await app.getHttpAdapter().getInstance().inject({ method: 'POST', url: '/api/v1/provisioning/condominiums', headers: { 'idempotency-key': 'key-1', 'sec-fetch-site': 'same-origin' }, payload: { fullName: 'Ana', email: 'ana@example.com', condominiumName: 'Sol', password: 'segredo muito longo', authorityDeclarationAccepted: true } });
    expect(response.statusCode).toBe(202);
    expect(response.headers['x-request-id']).toBeTruthy();
    expect(response.body).not.toMatch(/segredo|password|schema|pepper|hash/i);
    expect(execute).toHaveBeenCalledWith(expect.objectContaining({ condominium: { displayName: 'Sol' } }), 'key-1');
    await app.close();
  });

  it('usa RFC 9457, bloqueia origem cruzada e TenantContext pendente', async () => {
    const app = await createNestApplication({ execute: vi.fn(async () => { throw new ProvisioningProblem(409, 'https://burgoweb.local/problems/idempotency-conflict', 'Conflito', 'Chave reutilizada.'); }) });
    const fastify = app.getHttpAdapter().getInstance();
    const validPayload = { fullName: 'Ana', email: 'ana@example.com', condominiumName: 'Sol', password: 'segredo muito longo', authorityDeclarationAccepted: true };
    const conflict = await fastify.inject({ method: 'POST', url: '/api/v1/provisioning/condominiums', headers: { 'idempotency-key': 'key-1', 'sec-fetch-site': 'same-origin', 'x-burgoweb-client': 'web' }, payload: validPayload });
    expect(conflict.statusCode).toBe(409);
    expect(conflict.headers['content-type']).toContain('application/problem+json');
    expect(conflict.json()).toMatchObject({ type: expect.stringContaining('idempotency-conflict'), status: 409, requestId: expect.any(String) });
    expect((await fastify.inject({ method: 'POST', url: '/api/v1/provisioning/condominiums', headers: { 'sec-fetch-site': 'cross-site' }, payload: validPayload })).statusCode).toBe(403);
    expect((await fastify.inject({ method: 'GET', url: '/api/v1/tenants/opaque/context' })).statusCode).toBe(404);
    await app.close();
  });
});
