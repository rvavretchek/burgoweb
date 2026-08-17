import { describe, expect, it, vi } from 'vitest';
import {
  AcceptInvitation,
  CancelInvitation,
  CreateInvitation,
  InvitationUnavailable,
  InvitationValidation,
  MANAGE_INVITATIONS,
  PreviewInvitation,
  ReissueInvitation,
  GetInvitation,
  type InvitationRepository,
  type TenantContext,
} from '../packages/application/src/index.js';

const context: TenantContext = Object.freeze({
  accountId:'00000000-0000-4000-8000-000000000001',personId:'00000000-0000-4000-8000-000000000002',membershipId:'00000000-0000-4000-8000-000000000003',tenantId:'00000000-0000-4000-8000-000000000004',
  publicId:'00000000-0000-4000-8000-000000000005',schemaName:'tenant_0123456789abcdef0123456789abcdef',displayName:'Sol',timeZone:'America/Sao_Paulo',authorizationVersion:2,capabilities:[MANAGE_INVITATIONS],
});

const base={personPublicId:'00000000-0000-4000-8000-000000000010',relationshipPublicId:'00000000-0000-4000-8000-000000000011',email:' ANA@EXAMPLE.COM ',role:'resident' as const,validForSeconds:86400,requestId:'r1'};
function repo(overrides:Partial<InvitationRepository>={}):InvitationRepository{return {
  preview:vi.fn(async(_c,x)=>({recipientName:'Ana',email:x.email,condominiumName:'Sol',relationshipPublicId:x.relationshipPublicId,role:x.role,validForSeconds:x.validForSeconds})),
  create:vi.fn(async(_c,x)=>({publicId:'invite-1',email:x.email,role:x.role,state:'pending' as const,deliveryState:'pending' as const,expiresAt:new Date('2026-08-08'),version:1})),
  reissue:vi.fn(async()=>({publicId:'invite-1',email:'ana@example.com',role:'resident' as const,state:'pending' as const,deliveryState:'pending' as const,expiresAt:new Date('2026-08-08'),version:2})),
  cancel:vi.fn(async()=>({publicId:'invite-1',email:'ana@example.com',role:'resident' as const,state:'cancelled' as const,deliveryState:'dead' as const,expiresAt:new Date('2026-08-08'),version:2})),
  accept:vi.fn(async()=>({state:'accepted' as const,tenantPublicId:context.publicId,role:'resident' as const})),list:vi.fn(async()=>({items:[]})),get:vi.fn(async()=>({publicId:'invite-1',email:'ana@example.com',role:'resident' as const,state:'pending' as const,deliveryState:'pending' as const,expiresAt:new Date('2026-08-08'),version:1})),...overrides};}

describe('convites',()=>{
  it('normaliza a entrada e produz prévia antes da criação',async()=>{const p=repo();const result=await new PreviewInvitation(p).execute(context,base);expect(result.email).toBe('ana@example.com');expect(p.preview).toHaveBeenCalledWith(context,expect.objectContaining({email:'ana@example.com'}));});
  it('nega Síndico, Papel arbitrário, TTL inseguro e ator sem capacidade',()=>{const p=repo();expect(()=>new CreateInvitation(p).execute(context,{...base,role:'syndic' as any,idempotencyKey:'k',confirmed:true})).toThrow(InvitationValidation);expect(()=>new CreateInvitation(p).execute(context,{...base,role:'owner' as any,idempotencyKey:'k',confirmed:true})).toThrow(InvitationValidation);expect(()=>new CreateInvitation(p).execute(context,{...base,validForSeconds:1,idempotencyKey:'k',confirmed:true})).toThrow(InvitationValidation);expect(()=>new CreateInvitation(p).execute({...context,capabilities:[]},{...base,idempotencyKey:'k',confirmed:true})).toThrow(InvitationValidation);});
  it('cria somente após confirmação explícita e com idempotência',async()=>{const p=repo();expect(()=>new CreateInvitation(p).execute(context,{...base,idempotencyKey:'k',confirmed:false})).toThrow(InvitationValidation);await new CreateInvitation(p).execute(context,{...base,idempotencyKey:'k',confirmed:true});expect(p.create).toHaveBeenCalledWith(context,expect.objectContaining({email:'ana@example.com',idempotencyKey:'k'}));});
  it('reenvia e cancela somente com versão positiva',async()=>{const p=repo();await new ReissueInvitation(p).execute(context,{publicId:'i',expectedVersion:1,idempotencyKey:'k',requestId:'r'});await new CancelInvitation(p).execute(context,{publicId:'i',expectedVersion:2,requestId:'r'});expect(()=>new CancelInvitation(p).execute(context,{publicId:'i',expectedVersion:0,requestId:'r'})).toThrow(InvitationValidation);});
  it('aceita por token sem transportar tenant, Papel ou Pessoa do cliente',async()=>{const accept=vi.fn(async()=>({state:'accepted' as const,tenantPublicId:context.publicId,role:'councilor' as const}));const p=repo({accept});const result=await new AcceptInvitation(p).execute({token:'opaque-token',accountId:context.accountId,requestId:'r'});expect(accept).toHaveBeenCalledWith({token:'opaque-token',accountId:context.accountId,requestId:'r'});expect(result.nextAction).toBe('open-condominium');});
  it('exige senha de 12 caracteres para Conta nova e orienta autenticação após o aceite',async()=>{const accept=vi.fn(repo().accept);const useCase=new AcceptInvitation(repo({accept}));await expect(useCase.execute({token:'opaque-token',password:'curta',requestId:'r'})).rejects.toBeInstanceOf(InvitationValidation);expect(accept).not.toHaveBeenCalled();await expect(useCase.execute({token:'opaque-token',password:'senha segura',requestId:'r'})).resolves.toMatchObject({nextAction:'login'});});
  it('usa indisponibilidade uniforme para token terminal',async()=>{const p=repo({accept:vi.fn(async()=>undefined)});await expect(new AcceptInvitation(p).execute({token:'x'.repeat(32),accountId:context.accountId,requestId:'r'})).rejects.toBeInstanceOf(InvitationUnavailable);});
  it('detalha convite somente pela projeção autorizada',async()=>{const get=vi.fn(async()=>({publicId:'invite-1',email:'ana@example.com',role:'resident' as const,state:'pending' as const,deliveryState:'pending' as const,expiresAt:new Date(),version:1}));const p=repo({get});await new GetInvitation(p).execute(context,'invite-1');expect(get).toHaveBeenCalledWith(context,'invite-1');});
});
