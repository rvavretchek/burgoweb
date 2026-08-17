import { AuthorizationDenied, resolveCivilInstant } from './roles.js';
import type { TenantContext } from '../tenancy/tenancy.js';

export interface CapabilityCatalogEntry {
  readonly id: string;
  readonly domain: string;
  readonly action: string;
  readonly grants: string;
  readonly denies: string;
  readonly available: boolean;
}

export const CAPABILITY_CATALOG: readonly CapabilityCatalogEntry[] = Object.freeze([
  Object.freeze({ id: 'people-units-relationships.manage', domain: 'Pessoas, Unidades e Vínculos', action: 'Cadastrar e editar', grants: 'Cadastrar, editar e encerrar Pessoas, Unidades e Vínculos.', denies: 'Já é concedida institucionalmente a todo Auxiliar Administrativo; não é uma delegação real nesta versão do Burgoweb.', available: false }),
  Object.freeze({ id: 'invitations.manage', domain: 'Convites', action: 'Convidar e gerir', grants: 'Criar, cancelar, reenviar e corrigir Convites.', denies: 'Já é concedida institucionalmente a todo Auxiliar Administrativo; não é uma delegação real nesta versão do Burgoweb.', available: false }),
  Object.freeze({ id: 'roles.suspend', domain: 'Papéis', action: 'Suspender em urgência', grants: 'Suspender temporariamente o Papel subordinado de outra Pessoa.', denies: 'Não permite restaurar, revogar permanentemente, afetar o Síndico nem suspender o próprio Papel.', available: true }),
  Object.freeze({ id: 'financial-responsibles.manage', domain: 'Responsáveis Financeiros', action: 'Atribuir e remover', grants: 'Atribuir e remover Responsáveis Financeiros por Unidade.', denies: 'Não eleva Papel, não concede acesso a outras Unidades e não expõe dados ou telas financeiras ainda inexistentes.', available: true }),
  Object.freeze({ id: 'financial.entries.manage', domain: 'Financeiro', action: 'Lançamentos', grants: 'Registrar e corrigir lançamentos financeiros.', denies: 'Ainda não disponível nesta versão do Burgoweb.', available: false }),
  Object.freeze({ id: 'financial.obligations.manage', domain: 'Financeiro', action: 'Obrigações', grants: 'Gerar e acompanhar obrigações por Unidade.', denies: 'Ainda não disponível nesta versão do Burgoweb.', available: false }),
  Object.freeze({ id: 'financial.movements.manage', domain: 'Financeiro', action: 'Movimentos', grants: 'Registrar movimentos e realizações parciais.', denies: 'Ainda não disponível nesta versão do Burgoweb.', available: false }),
  Object.freeze({ id: 'financial.closures.manage', domain: 'Financeiro', action: 'Fechamentos', grants: 'Conferir e fechar período financeiro.', denies: 'Ainda não disponível nesta versão do Burgoweb.', available: false }),
  Object.freeze({ id: 'publications.manage', domain: 'Publicações', action: 'Preparar e publicar', grants: 'Preparar, pré-visualizar e publicar versões imutáveis.', denies: 'Ainda não disponível nesta versão do Burgoweb.', available: false }),
  Object.freeze({ id: 'publications.suspensions.manage', domain: 'Publicações', action: 'Tratamento de suspensões', grants: 'Suspender publicação e tratar SLA.', denies: 'Ainda não disponível nesta versão do Burgoweb.', available: false }),
  Object.freeze({ id: 'attachments.originals.manage', domain: 'Anexos', action: 'Originais privados', grants: 'Enviar, consultar e remover anexos originais.', denies: 'Ainda não disponível nesta versão do Burgoweb.', available: false }),
  Object.freeze({ id: 'pendencies.manage', domain: 'Pendências', action: 'Ciclo de vida', grants: 'Criar, conduzir e comentar Pendências internas.', denies: 'Ainda não disponível nesta versão do Burgoweb.', available: false }),
  Object.freeze({ id: 'exports.manage', domain: 'Exportações', action: 'Gerar e validar', grants: 'Gerar exportação financeira ou institucional.', denies: 'Ainda não disponível nesta versão do Burgoweb.', available: false }),
  Object.freeze({ id: 'data-subject-requests.manage', domain: 'Solicitações de titulares', action: 'Analisar e responder', grants: 'Registrar, analisar e responder solicitações sobre dados pessoais.', denies: 'Ainda não disponível nesta versão do Burgoweb.', available: false }),
] as const);
const CATALOG_BY_ID = new Map(CAPABILITY_CATALOG.map(entry => [entry.id, entry]));
export function isKnownCapability(id: unknown): id is string { return typeof id === 'string' && CATALOG_BY_ID.has(id); }
export function isAvailableCapability(id: unknown): id is string { return isKnownCapability(id) && CATALOG_BY_ID.get(id)!.available; }

export type CapabilityGrantState = 'scheduled' | 'active' | 'expired' | 'revoked';
export type CapabilityGrantTransition = 'activate' | 'expire' | 'revoke';
export interface CapabilityGrantRecord { publicId:string; personPublicId:string; capabilityId:string; validFrom:Date; validUntil:Date|null; state:CapabilityGrantState; grantedBy:{publicId:string}; version:number }
export interface CapabilityGrantPage { items:CapabilityGrantRecord[]; nextCursor?:string; catalog?:readonly CapabilityCatalogEntry[]; viewerCapabilities?:readonly string[] }
export interface CapabilityDraft { personPublicId:string; capabilityId:string; validFrom:string; validUntil?:string|null }
export interface CapabilityListOptions { selfOnly?:boolean }
export interface CapabilityGrantRepository {
  list(context:TenantContext,cursor?:string,options?:CapabilityListOptions):Promise<CapabilityGrantPage>;
  grant(context:TenantContext,command:CapabilityDraft&{confirmed:true;idempotencyKey:string;requestId:string}):Promise<CapabilityGrantRecord>;
  revoke(context:TenantContext,command:{publicId:string;expectedVersion:number;confirmed:true;requestId:string}):Promise<CapabilityGrantRecord>;
  materialize(now?:Date):Promise<number>;
}
export class CapabilityValidation extends Error { constructor(message:string){super(message);this.name='CapabilityValidation';} }
export class CapabilityConflict extends Error { constructor(readonly current:unknown){super('Revise o estado atual.');this.name='CapabilityConflict';} }

const transitionMap:Record<CapabilityGrantState,Partial<Record<CapabilityGrantTransition,CapabilityGrantState>>>={
  scheduled:{activate:'active',expire:'expired',revoke:'revoked'}, active:{expire:'expired',revoke:'revoked'}, expired:{}, revoked:{},
};
export function transitionCapabilityGrant(state:CapabilityGrantState,transition:CapabilityGrantTransition){const next=transitionMap[state][transition];if(!next)throw new CapabilityValidation('Transição de capacidade inválida.');return next;}

const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const requireUuid=(value:unknown,name:string)=>{if(typeof value!=='string'||!uuid.test(value))throw new CapabilityValidation(name);return value;};
export function validateCapabilityDraft(input:CapabilityDraft,timeZone:string):CapabilityDraft{
  requireUuid(input.personPublicId,'personPublicId');
  if(!isKnownCapability(input.capabilityId))throw new CapabilityValidation('capabilityId');
  if(!isAvailableCapability(input.capabilityId))throw new CapabilityValidation('capabilityUnavailable');
  const from=resolveCivilInstantOrThrow(input.validFrom,timeZone),until=input.validUntil?resolveCivilInstantOrThrow(input.validUntil,timeZone):null;
  if(until&&until<=from)throw new CapabilityValidation('validUntil');
  return {...input,validFrom:from.toISOString(),validUntil:until?until.toISOString():undefined};
}
function resolveCivilInstantOrThrow(local:unknown,timeZone:string):Date{
  try{return resolveCivilInstant(local,timeZone);}catch(error){throw new CapabilityValidation(error instanceof Error?error.message:'validFromOffset');}
}
const need=(context:TenantContext,capability:string)=>{if(!context.capabilities.includes(capability))throw new AuthorizationDenied();};
export const GRANT_CAPABILITY_CAPABILITY='capabilities.grant';
export class ListCapabilityGrants { constructor(private repository:CapabilityGrantRepository){} async execute(context:TenantContext,cursor?:string){const canListAll=context.capabilities.includes(GRANT_CAPABILITY_CAPABILITY);if(!canListAll)need(context,'roles.read');const page=await this.repository.list(context,cursor,canListAll?undefined:{selfOnly:true});return {...page,catalog:CAPABILITY_CATALOG,viewerCapabilities:context.capabilities};} }
export class GrantCapability { constructor(private repository:CapabilityGrantRepository){} execute(context:TenantContext,command:CapabilityDraft&{confirmed:boolean;idempotencyKey:string;requestId:string}){need(context,GRANT_CAPABILITY_CAPABILITY);if(command.confirmed!==true||!command.idempotencyKey?.trim())throw new CapabilityValidation('confirmation');return this.repository.grant(context,{...validateCapabilityDraft(command,context.timeZone),confirmed:true,idempotencyKey:command.idempotencyKey.trim(),requestId:command.requestId});} }
export class RevokeCapability { constructor(private repository:CapabilityGrantRepository){} execute(context:TenantContext,command:{publicId:string;expectedVersion:number;confirmed?:boolean;requestId:string}){need(context,GRANT_CAPABILITY_CAPABILITY);requireUuid(command.publicId,'publicId');if(!Number.isInteger(command.expectedVersion)||command.expectedVersion<1)throw new CapabilityValidation('expectedVersion');if(command.confirmed!==true)throw new CapabilityValidation('confirmed');return this.repository.revoke(context,{...command,confirmed:true});} }
export class MaterializeCapabilityGrants { constructor(private repository:CapabilityGrantRepository){} execute(now?:Date){return this.repository.materialize(now);} }

export interface ClaimedCapabilityNotification { id:string; to:string; grantPublicId:string; state:CapabilityGrantState; attemptNumber:number; leaseOwner:string }
export interface CapabilityNotificationOutbox { claim(owner:string,now:Date,leaseSeconds:number):Promise<ClaimedCapabilityNotification|undefined>; finish(item:ClaimedCapabilityNotification,result:import('../verification/ports.js').EmailDeliveryResult,now:Date,nextAttemptAt?:Date):Promise<void> }
export class ProcessCapabilityNotification { constructor(private deps:{repository:CapabilityNotificationOutbox;email:import('../verification/ports.js').EmailPort;owner:string;leaseSeconds:number;maxAttempts:number;now?:()=>Date}){} async execute(){const now=(this.deps.now??(()=>new Date()))(),item=await this.deps.repository.claim(this.deps.owner,now,this.deps.leaseSeconds);if(!item)return false;const result=await this.deps.email.send({to:item.to,subject:'Atualização de capacidade no Burgoweb',text:`Sua capacidade delegada agora está: ${item.state}. Entre no Burgoweb para consultar os detalhes.`,html:`<p>Sua capacidade delegada foi atualizada.</p><p>Estado: <strong>${item.state}</strong>.</p><p>Entre no Burgoweb para consultar os detalhes.</p>`,idempotencyKey:item.id});const retry=result.kind==='transient'&&item.attemptNumber<this.deps.maxAttempts?new Date(now.getTime()+Math.min(300000,2**item.attemptNumber*1000)):undefined;await this.deps.repository.finish(item,result,new Date(),retry);return true;} }

export interface EffectiveCapabilityGrant { capabilityId:string; state:CapabilityGrantState; validFrom:Date; validUntil:Date|null }
export function resolveEffectiveDelegatedCapabilities(grants:readonly EffectiveCapabilityGrant[],now:Date):string[]{
  const capabilities=new Set<string>();
  for(const grant of grants){if(grant.state!=='active'||grant.validFrom>now||(grant.validUntil&&grant.validUntil<=now))continue;capabilities.add(grant.capabilityId);}
  return [...capabilities].sort();
}
