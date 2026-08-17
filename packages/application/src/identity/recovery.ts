import type { PasswordHash, PasswordHasher } from './password-hasher.js';
import type { SessionTokenCodec } from './session.js';
import type { EmailDeliveryResult, EmailPort } from '../verification/ports.js';

export interface RecoveryTokenContext { recoveryId: string; outboxId: string; accountId: string; requestId: string; purpose: 'password-recovery'; keyVersion: string; issuedAt: Date }
export interface RecoveryTokenCodec { derive(context: RecoveryTokenContext): string; hash(token: string): string; matches(token: string, expectedHash: string): boolean }
export interface PendingRecoveryRecord extends RecoveryTokenContext { tokenHash: string; expiresAt: Date; email: string }
export interface AccountSessionSummary { publicId: string; createdAt: Date; lastActivityAt: Date; state: 'active' | 'expired' | 'revoked'; current: boolean }
export interface ClaimedRecoveryEmail extends RecoveryTokenContext { tokenHash:string; expiresAt:Date; to:string; attemptNumber:number; leaseOwner:string }
export interface RecoveryOutboxRepository { claim(owner:string,now:Date,leaseSeconds:number):Promise<ClaimedRecoveryEmail|undefined>; renew(item:ClaimedRecoveryEmail,now:Date,leaseSeconds:number):Promise<boolean>; finish(item:ClaimedRecoveryEmail,result:EmailDeliveryResult,now:Date,nextAttemptAt?:Date):Promise<boolean> }
export interface RecoveryRepository {
  request(email: string, requestId: string, requestedAt: Date, issue: (target: { accountId: string }) => PendingRecoveryRecord): Promise<boolean>;
  complete(input: { recoveryTokenHash: string; password: PasswordHash; sessionTokenHash: string; csrfHash: string; createdAt: Date; absoluteExpiresAt: Date; idleTtlSeconds: number; revokeOtherSessions: boolean; requestId: string }): Promise<boolean>;
}
export interface AccountSessionRepository {
  listSessions(accountId: string, currentTokenHash: string, now: Date): Promise<AccountSessionSummary[]>;
  revokeAccountSession(input: { accountId: string; currentTokenHash: string; sessionPublicId: string; requestId: string; now: Date }): Promise<{ revoked: boolean; current: boolean }>;
  revokeOtherSessions(input: { accountId: string; currentTokenHash: string; requestId: string; now: Date }): Promise<number>;
}

export class RecoveryUnavailable extends Error {}
const PUBLIC_RESULT = { state: 'pending' as const, message: 'Se a Conta estiver elegível, enviaremos instruções para recuperar o acesso.' };

export class RequestPasswordRecovery {
  constructor(private readonly deps: { repository: RecoveryRepository; codec: RecoveryTokenCodec; keyVersion: string; ttlSeconds: number; now?: () => Date; randomId?: () => string }) {}
  async execute(command: { email: string; requestId: string }) {
    const now = this.deps.now?.() ?? new Date(); const randomId = this.deps.randomId ?? (() => crypto.randomUUID());
    const email = command.email.trim().toLowerCase();
    await this.deps.repository.request(email, command.requestId, now, target => {
      const context: RecoveryTokenContext = { recoveryId: randomId(), outboxId: randomId(), accountId: target.accountId, requestId: command.requestId, purpose: 'password-recovery', keyVersion: this.deps.keyVersion, issuedAt: now };
      return { ...context, email, tokenHash: this.deps.codec.hash(this.deps.codec.derive(context)), expiresAt: new Date(now.getTime() + this.deps.ttlSeconds * 1000) };
    });
    return PUBLIC_RESULT;
  }
}

export class CompletePasswordRecovery {
  constructor(private readonly deps: { repository: RecoveryRepository; hasher: PasswordHasher; recoveryCodec: RecoveryTokenCodec; sessionCodec: SessionTokenCodec; absoluteTtlSeconds: number; idleTtlSeconds: number; now?: () => Date }) {}
  async execute(command: { token: string; newPassword: string; revokeOtherSessions: boolean; requestId: string }): Promise<{ token: string; csrfToken: string; maxAgeSeconds: number }> {
    if (!command.token || command.newPassword.length < 12) throw new RecoveryUnavailable();
    const now = this.deps.now?.() ?? new Date(); const password = await this.deps.hasher.hash(command.newPassword); const session = this.deps.sessionCodec.issue();
    const completed = await this.deps.repository.complete({ recoveryTokenHash: this.deps.recoveryCodec.hash(command.token), password, sessionTokenHash: session.tokenHash, csrfHash: session.csrfHash, createdAt: now, absoluteExpiresAt: new Date(now.getTime() + this.deps.absoluteTtlSeconds * 1000), idleTtlSeconds: this.deps.idleTtlSeconds, revokeOtherSessions: command.revokeOtherSessions, requestId: command.requestId });
    if (!completed) throw new RecoveryUnavailable();
    return { token: session.token, csrfToken: session.csrfToken, maxAgeSeconds: this.deps.absoluteTtlSeconds };
  }
}

export class ListAccountSessions { constructor(private readonly repository: AccountSessionRepository) {} execute(accountId: string, currentTokenHash: string, now = new Date()) { return this.repository.listSessions(accountId, currentTokenHash, now); } }
export class RevokeAccountSession { constructor(private readonly repository: AccountSessionRepository) {} execute(command: Parameters<AccountSessionRepository['revokeAccountSession']>[0]) { return this.repository.revokeAccountSession(command); } }
export class RevokeOtherAccountSessions { constructor(private readonly repository: AccountSessionRepository) {} execute(command: Parameters<AccountSessionRepository['revokeOtherSessions']>[0]) { return this.repository.revokeOtherSessions(command); } }

function escapeHtml(value:string){return value.replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]!));}
export class ProcessRecoveryEmail {
  constructor(private readonly deps:{repository:RecoveryOutboxRepository;email:EmailPort;codec:RecoveryTokenCodec;baseUrl:string;leaseSeconds:number;maxAttempts:number;owner:string;now?:()=>Date}){}
  async execute(){
    const now=this.deps.now?.()??new Date();
    const item=await this.deps.repository.claim(this.deps.owner,now,this.deps.leaseSeconds);
    if(!item)return false;
    let token:string;
    try{token=this.deps.codec.derive(item);}catch{await this.deps.repository.finish(item,{kind:'permanent',code:'key-version-unavailable'},now);return true;}
    if(!this.deps.codec.matches(token,item.tokenHash)){await this.deps.repository.finish(item,{kind:'permanent',code:'token-integrity'},now);return true;}
    const link=`${this.deps.baseUrl}/redefinir-acesso#token=${encodeURIComponent(token)}`;
    const expiry=item.expiresAt.toISOString();
    let stopped=false;let leaseLost=false;let renewal:Promise<void>|undefined;let renewalTimer:NodeJS.Timeout|undefined;
    const renew=()=>{renewal=(async()=>{try{if(!await this.deps.repository.renew(item,this.deps.now?.()??new Date(),this.deps.leaseSeconds))leaseLost=true;}catch{leaseLost=true;}finally{if(!stopped&&!leaseLost)renewalTimer=setTimeout(renew,Math.max(1000,this.deps.leaseSeconds*500));}})();};
    renewalTimer=setTimeout(renew,Math.max(1000,this.deps.leaseSeconds*500));
    let result:EmailDeliveryResult;
    try{result=await this.deps.email.send({to:item.to,subject:'Recupere seu acesso ao Burgoweb',text:`Burgoweb\n\nUse este link somente para redefinir sua senha. Ele expira em ${expiry}. Ao concluir, você poderá encerrar as demais sessões.\n\n${link}`,html:`<p><strong>Burgoweb</strong></p><p>Use este link somente para redefinir sua senha.</p><p>Ele expira em <time>${escapeHtml(expiry)}</time>. Ao concluir, você poderá encerrar as demais sessões.</p><p><a href="${escapeHtml(link)}">Redefinir minha senha</a></p>`,idempotencyKey:item.outboxId});}
    finally{stopped=true;if(renewalTimer)clearTimeout(renewalTimer);await renewal;}
    if(leaseLost)return true;
    const finishedAt=this.deps.now?.()??new Date();
    const retry=result.kind==='transient'&&item.attemptNumber<this.deps.maxAttempts?new Date(finishedAt.getTime()+Math.min(300000,2**item.attemptNumber*1000)):undefined;
    await this.deps.repository.finish(item,result,finishedAt,retry);
    return true;
  }
}
