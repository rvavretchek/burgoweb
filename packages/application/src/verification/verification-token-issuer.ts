import { randomUUID } from 'node:crypto';
import type { PendingVerificationRecord } from './contracts.js';
import type { VerificationTokenCodec } from './ports.js';

export class VerificationTokenIssuer {
  constructor(private readonly deps: { codec: VerificationTokenCodec; keyVersion: string; ttlSeconds: number; uuid?: () => string; now?: () => Date }) {}

  issue(target: { accountId: string; requestId: string }): PendingVerificationRecord {
    const uuid = this.deps.uuid ?? randomUUID;
    const issuedAt = (this.deps.now ?? (() => new Date()))();
    const record: Omit<PendingVerificationRecord, 'tokenHash'> = {
      verificationId: uuid(), outboxId: uuid(), accountId: target.accountId, requestId: target.requestId,
      purpose: 'email-verification', keyVersion: this.deps.keyVersion, issuedAt,
      expiresAt: new Date(issuedAt.getTime() + this.deps.ttlSeconds * 1000),
    };
    return { ...record, tokenHash: this.deps.codec.hash(this.deps.codec.derive(record)) };
  }

  reconstruct(record: PendingVerificationRecord): string { return this.deps.codec.derive(record); }
}

