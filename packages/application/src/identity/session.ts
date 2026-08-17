import type { PasswordHash, PasswordHasher } from './password-hasher.js';

export interface CredentialRecord extends PasswordHash { accountId: string; state: 'active' | 'disabled' | 'pending_verification'; emailVerified: boolean }
export interface SessionRecord { accountId: string; expiresAt: Date; tokenHash?: string }
export interface IdentityRepository {
  findCredential(email: string): Promise<CredentialRecord | undefined>;
  createSession(input: { accountId: string; tokenHash: string; csrfHash: string; createdAt: Date; lastSeenAt: Date; absoluteExpiresAt: Date; idleTtlSeconds: number; requestId: string }): Promise<void>;
  updateCredentialHash(accountId: string, expected: PasswordHash, replacement: PasswordHash): Promise<void>;
  denyLogin(input: { requestId: string; subject: string; occurredAt: Date }): Promise<void>;
  limitLogin(input: { requestId: string; subject: string; occurredAt: Date }): Promise<void>;
  resolveSession(tokenHash: string, now: Date, requestId: string): Promise<SessionRecord | undefined>;
  addCsrfToken(tokenHash: string, csrfHash: string, now: Date): Promise<boolean>;
  verifyCsrf(tokenHash: string, csrfHash: string, now: Date): Promise<boolean>;
  revokeSession(tokenHash: string, csrfHash: string, now: Date, requestId: string): Promise<'revoked' | 'absent' | 'csrf-rejected'>;
}
export interface SessionTokenCodec {
  issue(): { token: string; tokenHash: string; csrfToken: string; csrfHash: string };
  issueCsrf(): { csrfToken: string; csrfHash: string };
  hash(value: string): string;
}
export class SessionUnavailable extends Error {}
export class CsrfRejected extends Error {}

export class Authenticate {
  constructor(private readonly deps: { repository: IdentityRepository; hasher: PasswordHasher; codec: SessionTokenCodec; now?: () => Date; absoluteTtlSeconds: number; idleTtlSeconds: number; dummyHash?: PasswordHash }) {}
  async execute(command: { email: string; password: string; requestId: string }): Promise<{ token: string; csrfToken: string; maxAgeSeconds: number }> {
    const email = command.email.trim().toLowerCase(); const now = this.deps.now?.() ?? new Date();
    const found = await this.deps.repository.findCredential(email);
    const checked = await this.deps.hasher.verify(found ?? this.deps.dummyHash ?? { encodedHash: '$invalid$', pepperVersion: '' }, command.password);
    if (!found || found.state !== 'active' || !found.emailVerified || !checked.valid) {
      await this.deps.repository.denyLogin({ requestId: command.requestId, subject: email, occurredAt: now });
      throw new SessionUnavailable();
    }
    if (checked.needsRehash) {
      try { await this.deps.repository.updateCredentialHash(found.accountId, { encodedHash: found.encodedHash, pepperVersion: found.pepperVersion }, await this.deps.hasher.hash(command.password)); } catch { /* login remains valid; compare-and-swap may lose a safe race */ }
    }
    const issued = this.deps.codec.issue();
    await this.deps.repository.createSession({ accountId: found.accountId, tokenHash: issued.tokenHash, csrfHash: issued.csrfHash, createdAt: now, lastSeenAt: now, absoluteExpiresAt: new Date(now.getTime() + this.deps.absoluteTtlSeconds * 1000), idleTtlSeconds: this.deps.idleTtlSeconds, requestId: command.requestId });
    return { token: issued.token, csrfToken: issued.csrfToken, maxAgeSeconds: this.deps.absoluteTtlSeconds };
  }
}
export class ResolveSession {
  constructor(private readonly deps: { repository: IdentityRepository; codec: SessionTokenCodec; now?: () => Date }) {}
  async execute(token: string, requestId = ''): Promise<SessionRecord> { const tokenHash=this.deps.codec.hash(token);const value = token && await this.deps.repository.resolveSession(tokenHash, this.deps.now?.() ?? new Date(), requestId); if (!value) throw new SessionUnavailable(); return {...value,tokenHash}; }
}
export class RefreshSessionCsrf {
  constructor(private readonly deps: { repository: IdentityRepository; codec: SessionTokenCodec; now?: () => Date }) {}
  async execute(token: string): Promise<{ csrfToken: string }> { if (!token) throw new SessionUnavailable(); const issued=this.deps.codec.issueCsrf(); if(!await this.deps.repository.addCsrfToken(this.deps.codec.hash(token),issued.csrfHash,this.deps.now?.()??new Date()))throw new SessionUnavailable(); return {csrfToken:issued.csrfToken}; }
}
export class VerifySessionCsrf { constructor(private readonly deps:{repository:IdentityRepository;codec:SessionTokenCodec;now?:()=>Date}){} async execute(token:string,csrf:string){if(!token||!csrf||!await this.deps.repository.verifyCsrf(this.deps.codec.hash(token),this.deps.codec.hash(csrf),this.deps.now?.()??new Date()))throw new CsrfRejected();} }
export class LogoutSession {
  constructor(private readonly deps: { repository: IdentityRepository; codec: SessionTokenCodec; now?: () => Date }) {}
  async execute(token: string, csrfToken: string, requestId: string): Promise<void> { if (!token) return; if (!csrfToken) throw new CsrfRejected(); const result=await this.deps.repository.revokeSession(this.deps.codec.hash(token),this.deps.codec.hash(csrfToken),this.deps.now?.()??new Date(),requestId);if(result==='csrf-rejected')throw new CsrfRejected(); }
}
