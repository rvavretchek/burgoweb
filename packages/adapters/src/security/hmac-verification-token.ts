import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import type { VerificationTokenCodec, VerificationTokenContext } from '@burgoweb/application';

export interface VerificationTokenKeyring { currentVersion: string; keys: Record<string, string> }

export class HmacVerificationTokenCodec implements VerificationTokenCodec {
  constructor(private readonly keyring: VerificationTokenKeyring) {
    if (!keyring.keys[keyring.currentVersion]) throw new Error('Versão atual do token ausente no keyring.');
  }

  derive(context: VerificationTokenContext): string {
    const key = this.keyring.keys[context.keyVersion];
    if (!key) throw new Error('Versão do token indisponível no keyring.');
    const domain = [context.purpose, context.verificationId, context.outboxId, context.accountId, context.requestId, context.issuedAt.toISOString()].join('\u001f');
    return createHmac('sha256', key).update(domain).digest('base64url');
  }

  hash(token: string): string { return createHash('sha256').update(token, 'utf8').digest('hex'); }

  matches(token: string, expectedHash: string): boolean {
    const actual = Buffer.from(this.hash(token), 'hex');
    const expected = /^[a-f0-9]{64}$/i.test(expectedHash) ? Buffer.from(expectedHash, 'hex') : Buffer.alloc(0);
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  }
}

