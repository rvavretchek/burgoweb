import type { TenantContext } from './tenancy.js';

export const MANAGE_INSTITUTIONAL_RECORDS = 'people-units-relationships.manage';
export type CivilDate = `${number}-${number}-${number}`;
export type InstitutionalState = 'active' | 'ended';
export interface Page<T> { readonly items: readonly T[]; readonly nextCursor?: string }
export interface PersonRecord { readonly publicId: string; readonly fullName: string; readonly email?: string; readonly state: InstitutionalState; readonly version: number }
export interface UnitRecord { readonly publicId: string; readonly identifier: string; readonly state: InstitutionalState; readonly version: number }
export interface RelationshipRecord { readonly publicId: string; readonly personPublicId: string; readonly unitPublicId: string; readonly relationKind: string; readonly startsOn: CivilDate; readonly endsOn?: CivilDate; readonly state: InstitutionalState; readonly version: number }
export interface MutationMetadata { readonly idempotencyKey: string; readonly requestId: string }
export interface CreatePersonCommand extends MutationMetadata { readonly fullName: string; readonly email?: string }
export interface CreateUnitCommand extends MutationMetadata { readonly identifier: string }
export interface CreateRelationshipCommand extends MutationMetadata { readonly personPublicId: string; readonly unitPublicId: string; readonly relationKind: string; readonly startsOn: CivilDate | string; readonly endsOn?: CivilDate | string }
export interface UpdatePersonCommand { readonly publicId: string; readonly fullName: string; readonly email?: string; readonly expectedVersion: number; readonly reason?: string; readonly requestId: string }
export interface UpdateUnitCommand { readonly publicId: string; readonly identifier: string; readonly expectedVersion: number; readonly reason?: string; readonly requestId: string }
export interface UpdateRelationshipCommand { readonly publicId: string; readonly relationKind: string; readonly startsOn: CivilDate | string; readonly endsOn?: CivilDate | string; readonly expectedVersion: number; readonly reason?: string; readonly requestId: string }
export interface EndRelationshipCommand { readonly publicId: string; readonly effectiveOn: CivilDate | string; readonly expectedVersion: number; readonly reason?: string; readonly requestId: string }

export interface PeopleUnitsRepository {
  createPerson(context: TenantContext, command: CreatePersonCommand): Promise<PersonRecord>;
  createUnit(context: TenantContext, command: CreateUnitCommand): Promise<UnitRecord>;
  createRelationship(context: TenantContext, command: CreateRelationshipCommand): Promise<RelationshipRecord>;
  updatePerson(context: TenantContext, command: UpdatePersonCommand): Promise<PersonRecord>;
  updateUnit(context: TenantContext, command: UpdateUnitCommand): Promise<UnitRecord>;
  updateRelationship(context: TenantContext, command: UpdateRelationshipCommand): Promise<RelationshipRecord>;
  endRelationship(context: TenantContext, command: EndRelationshipCommand): Promise<RelationshipRecord>;
  listPeople(context: TenantContext, cursor?: string): Promise<Page<PersonRecord>>;
  listUnits(context: TenantContext, cursor?: string): Promise<Page<UnitRecord>>;
  listRelationships(context: TenantContext, cursor?: string): Promise<Page<RelationshipRecord>>;
}

export class InstitutionalAccessDenied extends Error {}
export class InstitucionalConflict extends Error { constructor(message: string, readonly current?: unknown) { super(message); } }
export class InstitutionalValidation extends Error { constructor(message: string, readonly field?: string) { super(message); } }
export class InstitutionalNotFound extends Error {}
export function normalizeInstitutionalEmail(value: string) { return value.trim().toLowerCase(); }
export function normalizeUnitIdentifier(value: string) { return value.trim().replace(/\s+/g, ' ').toLocaleLowerCase('pt-BR'); }
function text(value: unknown, label: string, max = 160): string { if(typeof value!=='string')throw new InstitutionalValidation(`${label} inválido.`); const result=value.trim().replace(/\s+/g,' '); if(!result||result.length>max)throw new InstitutionalValidation(`${label} inválido.`); return result; }
function optionalEmail(value: unknown): string | undefined {
  if (value === undefined || value === '') return undefined;
  const normalized = normalizeInstitutionalEmail(text(value, 'E-mail', 254));
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) throw new InstitutionalValidation('E-mail inválido.', 'email');
  return normalized;
}
function civilDate(value: string, label: string): CivilDate { if(!/^\d{4}-\d{2}-\d{2}$/.test(value)){throw new InstitutionalValidation(`${label} deve ser uma data civil no formato AAAA-MM-DD.`);}const [year,month,day]=value.split('-').map(Number);const date=new Date(Date.UTC(year,month-1,day));if(date.getUTCFullYear()!==year||date.getUTCMonth()!==month-1||date.getUTCDate()!==day)throw new InstitutionalValidation(`${label} inválida.`);return value as CivilDate; }
function metadata<T extends MutationMetadata>(command:T){if(!command.idempotencyKey.trim()||command.idempotencyKey.length>200)throw new InstitutionalValidation('Idempotency-Key inválida.');return command;}
function authorize(context:TenantContext){if(!context.capabilities.includes(MANAGE_INSTITUTIONAL_RECORDS))throw new InstitutionalAccessDenied();}
function expectedVersion(version:number){if(!Number.isSafeInteger(version)||version<1)throw new InstitutionalValidation('Versão esperada inválida.');}

export class CreatePerson { constructor(private readonly repository:PeopleUnitsRepository){} execute(context:TenantContext,input:CreatePersonCommand){authorize(context);const command=metadata({...input,fullName:text(input.fullName,'Nome completo'),email:optionalEmail(input.email)});return this.repository.createPerson(context,command);} }
export class CreateUnit { constructor(private readonly repository:PeopleUnitsRepository){} execute(context:TenantContext,input:CreateUnitCommand){authorize(context);const command=metadata({...input,identifier:text(input.identifier,'Identificação')});return this.repository.createUnit(context,command);} }
export class CreateRelationship { constructor(private readonly repository:PeopleUnitsRepository){} execute(context:TenantContext,input:CreateRelationshipCommand){authorize(context);const startsOn=civilDate(input.startsOn,'Início');const endsOn=input.endsOn?civilDate(input.endsOn,'Fim'):undefined;if(endsOn&&endsOn<=startsOn)throw new InstitutionalValidation('O fim é exclusivo e deve ser posterior ao início.');const command=metadata({...input,personPublicId:text(input.personPublicId,'Pessoa'),unitPublicId:text(input.unitPublicId,'Unidade'),relationKind:text(input.relationKind,'Natureza da relação',80),startsOn,endsOn});return this.repository.createRelationship(context,command);} }
export class UpdatePerson { constructor(private readonly repository:PeopleUnitsRepository){} execute(context:TenantContext,input:UpdatePersonCommand){authorize(context);expectedVersion(input.expectedVersion);return this.repository.updatePerson(context,{...input,fullName:text(input.fullName,'Nome completo'),email:optionalEmail(input.email)});} }
export class UpdateUnit { constructor(private readonly repository:PeopleUnitsRepository){} execute(context:TenantContext,input:UpdateUnitCommand){authorize(context);expectedVersion(input.expectedVersion);return this.repository.updateUnit(context,{...input,identifier:text(input.identifier,'Identificação')});} }
export class UpdateRelationship { constructor(private readonly repository:PeopleUnitsRepository){} execute(context:TenantContext,input:UpdateRelationshipCommand){authorize(context);expectedVersion(input.expectedVersion);const startsOn=civilDate(input.startsOn,'Início');const endsOn=input.endsOn?civilDate(input.endsOn,'Fim'):undefined;if(endsOn&&endsOn<=startsOn)throw new InstitutionalValidation('O fim é exclusivo e deve ser posterior ao início.');return this.repository.updateRelationship(context,{...input,relationKind:text(input.relationKind,'Natureza da relação',80),startsOn,endsOn});} }
export class EndRelationship { constructor(private readonly repository:PeopleUnitsRepository){} execute(context:TenantContext,input:EndRelationshipCommand){authorize(context);expectedVersion(input.expectedVersion);return this.repository.endRelationship(context,{...input,effectiveOn:civilDate(input.effectiveOn,'Data efetiva')});} }
export class ListPeople { constructor(private readonly repository:PeopleUnitsRepository){} execute(context:TenantContext,cursor?:string){authorize(context);return this.repository.listPeople(context,cursor);} }
export class ListUnits { constructor(private readonly repository:PeopleUnitsRepository){} execute(context:TenantContext,cursor?:string){authorize(context);return this.repository.listUnits(context,cursor);} }
export class ListRelationships { constructor(private readonly repository:PeopleUnitsRepository){} execute(context:TenantContext,cursor?:string){authorize(context);return this.repository.listRelationships(context,cursor);} }
