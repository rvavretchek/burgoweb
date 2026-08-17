import { describe, expect, it, vi } from 'vitest';
import { CompletePasswordRecovery, ListAccountSessions, ProcessRecoveryEmail, RecoveryUnavailable, RequestPasswordRecovery, RevokeAccountSession } from '@burgoweb/application';
import { HmacRecoveryTokenCodec } from '@burgoweb/adapters';

const now = new Date('2026-07-31T12:00:00Z');

describe('password recovery', () => {
  it('returns the same public result whether the account is eligible or absent', async () => {
    const calls: unknown[] = [];
    const repository = { request: async (input: unknown) => { calls.push(input); return true; } } as never;
    const codec = new HmacRecoveryTokenCodec({ currentVersion: 'v1', keys: { v1: 'r'.repeat(32) } });
    const useCase = new RequestPasswordRecovery({ repository, codec, keyVersion: 'v1', ttlSeconds: 900, now: () => now });
    const eligible = await useCase.execute({ email: ' Person@Example.com ', requestId: crypto.randomUUID() });
    const absent = await new RequestPasswordRecovery({ repository: { request: async () => false } as never, codec, keyVersion: 'v1', ttlSeconds: 900, now: () => now }).execute({ email: 'none@example.com', requestId: crypto.randomUUID() });
    expect(eligible).toEqual(absent);
    expect(eligible).toEqual({ state: 'pending', message: 'Se a Conta estiver elegível, enviaremos instruções para recuperar o acesso.' });
    expect(calls).toHaveLength(1);
  });

  it('issues a purpose-bound hash-only token context', async () => {
    let captured: any;
    const codec = new HmacRecoveryTokenCodec({ currentVersion: 'v1', keys: { v1: 'r'.repeat(32) } });
    await new RequestPasswordRecovery({ repository: { request: async (_email: string, _requestId: string, _requestedAt: Date, issue: any) => { captured = issue({ accountId: crypto.randomUUID() }); return true; } } as never, codec, keyVersion: 'v1', ttlSeconds: 900, now: () => now }).execute({ email: 'a@example.com', requestId: crypto.randomUUID() });
    expect(captured.purpose).toBe('password-recovery');
    expect(captured.tokenHash).toMatch(/^[a-f0-9]{64}$/);
    expect(JSON.stringify(captured)).not.toContain('token":');
  });

  it('completes once, creates a fresh session and can revoke other sessions', async () => {
    const codec = new HmacRecoveryTokenCodec({ currentVersion: 'v1', keys: { v1: 'r'.repeat(32) } });
    const context = { recoveryId: crypto.randomUUID(), outboxId: crypto.randomUUID(), accountId: crypto.randomUUID(), requestId: crypto.randomUUID(), purpose: 'password-recovery' as const, keyVersion: 'v1', issuedAt: now };
    const token = codec.derive(context);
    let completed: any;
    const useCase = new CompletePasswordRecovery({
      repository: { complete: async (input: any) => { completed = input; return true; } } as never,
      hasher: { hash: async () => ({ encodedHash: '$argon2id$hash', pepperVersion: 'p1' }), verify: async () => ({ valid: true, needsRehash: false }) },
      recoveryCodec: codec,
      sessionCodec: { issue: () => ({ token: 'fresh-session', tokenHash: 's'.repeat(64), csrfToken: 'fresh-csrf', csrfHash: 'c'.repeat(64) }), issueCsrf: () => ({ csrfToken: '', csrfHash: '' }), hash: () => '' },
      absoluteTtlSeconds: 3600,
      idleTtlSeconds: 600,
      now: () => now,
    });
    const result = await useCase.execute({ token, newPassword: 'a secure password', revokeOtherSessions: true, requestId: crypto.randomUUID() });
    expect(result.token).toBe('fresh-session');
    expect(completed.revokeOtherSessions).toBe(true);
    expect(completed.recoveryTokenHash).toBe(codec.hash(token));
  });

  it('rejects an unavailable recovery without exposing an internal reason', async () => {
    const codec = new HmacRecoveryTokenCodec({ currentVersion: 'v1', keys: { v1: 'r'.repeat(32) } });
    const useCase = new CompletePasswordRecovery({ repository: { complete: async () => false } as never, hasher: { hash: async () => ({ encodedHash: 'x', pepperVersion: 'p' }), verify: async () => ({ valid: false, needsRehash: false }) }, recoveryCodec: codec, sessionCodec: { issue: () => ({ token: '', tokenHash: '', csrfToken: '', csrfHash: '' }), issueCsrf: () => ({ csrfToken: '', csrfHash: '' }), hash: () => '' }, absoluteTtlSeconds: 1, idleTtlSeconds: 1 });
    await expect(useCase.execute({ token: 'invalid', newPassword: 'valid password', revokeOtherSessions: false, requestId: crypto.randomUUID() })).rejects.toBeInstanceOf(RecoveryUnavailable);
  });
});

describe('account session management', () => {
  it('lists only repository-minimized session metadata', async () => {
    const value = [{ publicId: crypto.randomUUID(), createdAt: now, lastActivityAt: now, state: 'active' as const, current: true }];
    await expect(new ListAccountSessions({ listSessions: async () => value } as never).execute('account', 'hash', now)).resolves.toEqual(value);
  });

  it('revokes only in the authenticated account scope', async () => {
    let command: any;
    const useCase = new RevokeAccountSession({ revokeAccountSession: async (input: any) => { command = input; return { revoked: true, current: false }; } } as never);
    await useCase.execute({ accountId: 'account', currentTokenHash: 'hash', sessionPublicId: crypto.randomUUID(), requestId: crypto.randomUUID(), now });
    expect(command.accountId).toBe('account');
  });
});

describe('recovery email worker', () => {
  it('preserves the outbox idempotency key and does not finish after losing the lease', async () => {
    vi.useFakeTimers();
    try {
      const item = { recoveryId: crypto.randomUUID(), outboxId: crypto.randomUUID(), accountId: crypto.randomUUID(), requestId: crypto.randomUUID(), purpose: 'password-recovery' as const, keyVersion: 'v1', tokenHash: 'hash', issuedAt: now, expiresAt: new Date(now.getTime() + 60_000), to: 'person@example.com', attemptNumber: 1, leaseOwner: 'worker' };
      const finish = vi.fn(async () => true);
      let accept!: (value: { kind: 'accepted'; providerReference: string }) => void;
      const send = vi.fn(() => new Promise<{ kind: 'accepted'; providerReference: string }>(resolve => { accept = resolve; }));
      const job = new ProcessRecoveryEmail({ repository: { claim: async () => item, renew: async () => false, finish }, email: { send }, codec: { derive: () => 'token', hash: () => 'hash', matches: () => true }, baseUrl: 'https://app.example.com', leaseSeconds: 1, maxAttempts: 3, owner: 'worker', now: () => now });
      const execution = job.execute();
      await vi.advanceTimersByTimeAsync(1_000);
      accept({ kind: 'accepted', providerReference: 'provider-ref' });
      await execution;
      expect(send).toHaveBeenCalledWith(expect.objectContaining({ idempotencyKey: item.outboxId }));
      expect(finish).not.toHaveBeenCalled();
    } finally { vi.useRealTimers(); }
  });
});
