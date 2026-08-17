import { AuthorizationDenied, resolveCivilInstant } from '../authorization/roles.js';
import type { TenantContext } from '../tenancy/tenancy.js';

export type FinancialResponsibleState = 'scheduled' | 'active' | 'expired' | 'revoked';
export type FinancialResponsibleTransition = 'activate' | 'expire' | 'revoke';
export interface FinancialResponsibleRecord { publicId:string; personPublicId:string; unitPublicId:string; relationshipPublicId:string; validFrom:Date; validUntil:Date|null; state:FinancialResponsibleState; grantedBy:{publicId:string}; version:number }
export interface FinancialResponsiblePage { items:FinancialResponsibleRecord[]; nextCursor?:string; viewerCapabilities?:readonly string[] }
export interface FinancialResponsibleDraft { personPublicId:string; unitPublicId:string; validFrom:string; validUntil?:string|null }
export interface FinancialResponsibleListOptions { selfOnly?:boolean }
export interface FinancialResponsibleRepository {
  list(context:TenantContext,cursor?:string,options?:FinancialResponsibleListOptions):Promise<FinancialResponsiblePage>;
  assign(context:TenantContext,command:FinancialResponsibleDraft&{confirmed:true;idempotencyKey:string;requestId:string}):Promise<FinancialResponsibleRecord>;
  remove(context:TenantContext,command:{publicId:string;expectedVersion:number;confirmed:true;requestId:string}):Promise<FinancialResponsibleRecord>;
  materialize(now?:Date):Promise<number>;
}
export class FinancialResponsibleValidation extends Error { constructor(message:string){super(message);this.name='FinancialResponsibleValidation';} }
export class FinancialResponsibleConflict extends Error { constructor(readonly current:unknown){super('Revise o estado atual.');this.name='FinancialResponsibleConflict';} }

const transitionMap:Record<FinancialResponsibleState,Partial<Record<FinancialResponsibleTransition,FinancialResponsibleState>>>={
  scheduled:{activate:'active',expire:'expired',revoke:'revoked'}, active:{expire:'expired',revoke:'revoked'}, expired:{}, revoked:{},
};
export function transitionFinancialResponsible(state:FinancialResponsibleState,transition:FinancialResponsibleTransition){const next=transitionMap[state][transition];if(!next)throw new FinancialResponsibleValidation('Transição de Responsável Financeiro inválida.');return next;}

const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const requireUuid=(value:unknown,name:string)=>{if(typeof value!=='string'||!uuid.test(value))throw new FinancialResponsibleValidation(name);return value;};
export function validateFinancialResponsibleDraft(input:FinancialResponsibleDraft,timeZone:string):FinancialResponsibleDraft{
  requireUuid(input.personPublicId,'personPublicId');
  requireUuid(input.unitPublicId,'unitPublicId');
  const from=resolveCivilInstantOrThrow(input.validFrom,timeZone),until=input.validUntil?resolveCivilInstantOrThrow(input.validUntil,timeZone):null;
  if(until&&until<=from)throw new FinancialResponsibleValidation('validUntil');
  return {...input,validFrom:from.toISOString(),validUntil:until?until.toISOString():undefined};
}
function resolveCivilInstantOrThrow(local:unknown,timeZone:string):Date{
  try{return resolveCivilInstant(local,timeZone);}catch(error){throw new FinancialResponsibleValidation(error instanceof Error?error.message:'validFromOffset');}
}
const need=(context:TenantContext,capability:string)=>{if(!context.capabilities.includes(capability))throw new AuthorizationDenied();};
export const MANAGE_FINANCIAL_RESPONSIBLES_CAPABILITY='financial-responsibles.manage';
export class ListFinancialResponsibles { constructor(private repository:FinancialResponsibleRepository){} async execute(context:TenantContext,cursor?:string){const canListAll=context.capabilities.includes(MANAGE_FINANCIAL_RESPONSIBLES_CAPABILITY);if(!canListAll)need(context,'dashboard.read');const page=await this.repository.list(context,cursor,canListAll?undefined:{selfOnly:true});return {...page,viewerCapabilities:context.capabilities};} }
export class AssignFinancialResponsible { constructor(private repository:FinancialResponsibleRepository){} execute(context:TenantContext,command:FinancialResponsibleDraft&{confirmed:boolean;idempotencyKey:string;requestId:string}){need(context,MANAGE_FINANCIAL_RESPONSIBLES_CAPABILITY);if(command.confirmed!==true||!command.idempotencyKey?.trim())throw new FinancialResponsibleValidation('confirmation');return this.repository.assign(context,{...validateFinancialResponsibleDraft(command,context.timeZone),confirmed:true,idempotencyKey:command.idempotencyKey.trim(),requestId:command.requestId});} }
export class RemoveFinancialResponsible { constructor(private repository:FinancialResponsibleRepository){} execute(context:TenantContext,command:{publicId:string;expectedVersion:number;confirmed?:boolean;requestId:string}){need(context,MANAGE_FINANCIAL_RESPONSIBLES_CAPABILITY);requireUuid(command.publicId,'publicId');if(!Number.isInteger(command.expectedVersion)||command.expectedVersion<1)throw new FinancialResponsibleValidation('expectedVersion');if(command.confirmed!==true)throw new FinancialResponsibleValidation('confirmed');return this.repository.remove(context,{...command,confirmed:true});} }
export class MaterializeFinancialResponsibles { constructor(private repository:FinancialResponsibleRepository){} execute(now?:Date){return this.repository.materialize(now);} }

export interface ClaimedFinancialResponsibleNotification { id:string; to:string; assignmentPublicId:string; state:FinancialResponsibleState; attemptNumber:number; leaseOwner:string }
export interface FinancialResponsibleNotificationOutbox { claim(owner:string,now:Date,leaseSeconds:number):Promise<ClaimedFinancialResponsibleNotification|undefined>; finish(item:ClaimedFinancialResponsibleNotification,result:import('../verification/ports.js').EmailDeliveryResult,now:Date,nextAttemptAt?:Date):Promise<void> }
export class ProcessFinancialResponsibleNotification { constructor(private deps:{repository:FinancialResponsibleNotificationOutbox;email:import('../verification/ports.js').EmailPort;owner:string;leaseSeconds:number;maxAttempts:number;now?:()=>Date}){} async execute(){const now=(this.deps.now??(()=>new Date()))(),item=await this.deps.repository.claim(this.deps.owner,now,this.deps.leaseSeconds);if(!item)return false;const result=await this.deps.email.send({to:item.to,subject:'Atualização de Responsável Financeiro no Burgoweb',text:`Sua atribuição de Responsável Financeiro agora está: ${item.state}. Entre no Burgoweb para consultar os detalhes.`,html:`<p>Sua atribuição de Responsável Financeiro foi atualizada.</p><p>Estado: <strong>${item.state}</strong>.</p><p>Entre no Burgoweb para consultar os detalhes.</p>`,idempotencyKey:item.id});const retry=result.kind==='transient'&&item.attemptNumber<this.deps.maxAttempts?new Date(now.getTime()+Math.min(300000,2**item.attemptNumber*1000)):undefined;await this.deps.repository.finish(item,result,new Date(),retry);return true;} }
