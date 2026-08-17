import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import type { SessionTokenCodec } from '@burgoweb/application';

export class HmacSessionTokenCodec implements SessionTokenCodec {
  constructor(private readonly secret: string) {}
  hash(value: string): string { return createHmac('sha256', this.secret).update(value).digest('hex'); }
  issueCsrf() { const csrfToken = randomBytes(32).toString('base64url'); return { csrfToken, csrfHash: this.hash(csrfToken) }; }
  issue() { const token = randomBytes(32).toString('base64url'); const csrf = this.issueCsrf(); return { token, tokenHash: this.hash(token), ...csrf }; }
  matches(value: string, expected: string): boolean { const actual = Buffer.from(this.hash(value)); const target = Buffer.from(expected); return actual.length === target.length && timingSafeEqual(actual, target); }
}
