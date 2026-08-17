import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import type { RecoveryTokenCodec, RecoveryTokenContext } from '@burgoweb/application';

export interface RecoveryTokenKeyring { currentVersion: string; keys: Record<string, string> }
export class HmacRecoveryTokenCodec implements RecoveryTokenCodec {
  constructor(private readonly keyring: RecoveryTokenKeyring) { if (!keyring.keys[keyring.currentVersion]) throw new Error('Versão atual do recovery token ausente.'); }
  derive(context: RecoveryTokenContext) { const key=this.keyring.keys[context.keyVersion]; if(!key)throw new Error('Versão do recovery token indisponível.'); return createHmac('sha256',key).update(['password-recovery',context.recoveryId,context.outboxId,context.accountId,context.requestId,context.issuedAt.toISOString()].join('\u001f')).digest('base64url'); }
  hash(token:string){return createHash('sha256').update(token,'utf8').digest('hex');}
  matches(token:string,expectedHash:string){const actual=Buffer.from(this.hash(token),'hex');const expected=/^[a-f0-9]{64}$/i.test(expectedHash)?Buffer.from(expectedHash,'hex'):Buffer.alloc(0);return actual.length===expected.length&&timingSafeEqual(actual,expected);}
}
