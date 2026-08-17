import { createHash,createHmac,timingSafeEqual } from 'node:crypto';
import type { InvitationTokenCodec,InvitationTokenContext } from '@burgoweb/application';
export class HmacInvitationTokenCodec implements InvitationTokenCodec{
  constructor(private readonly keyring:{currentVersion:string;keys:Record<string,string>}){if(!keyring.keys[keyring.currentVersion])throw new Error('Versão atual ausente.');}
  derive(context:InvitationTokenContext){const key=this.keyring.keys[context.keyVersion];if(!key)throw new Error('Versão indisponível.');return createHmac('sha256',key).update([context.purpose,context.invitationId,context.outboxId,context.tenantId,context.personId,context.relationshipId,context.email,context.issuedAt.toISOString()].join('\u001f')).digest('base64url');}
  hash(token:string){return createHash('sha256').update(token,'utf8').digest('hex');}
  matches(token:string,expectedHash:string){const actual=Buffer.from(this.hash(token),'hex');const expected=/^[a-f0-9]{64}$/i.test(expectedHash)?Buffer.from(expectedHash,'hex'):Buffer.alloc(0);return actual.length===expected.length&&timingSafeEqual(actual,expected);}
}
