import { readFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { Pool } from 'pg';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { PostgresFinancialResponsibleRepository, PostgresGlobalMigrator, PostgresTenantMigrator } from '../packages/adapters/src/index.js';

describe.runIf(process.env.BURGOWEB_INTEGRATION==='1').sequential('Story 1.10 - PostgreSQL 18 real',()=>{
 let pool:Pool;const schema=`tenant_${randomUUID().replaceAll('-','')}`,tenantId=randomUUID(),tenantPublicId=randomUUID(),accountId=randomUUID(),actorPersonId=randomUUID(),authorityId=randomUUID(),membershipId=randomUUID(),unitId=randomUUID(),beneficiaryPersonId=randomUUID(),relationshipId=randomUUID(),outsiderPersonId=randomUUID();
 beforeAll(async()=>{
  if(!process.env.BURGOWEB_INTEGRATION_DATABASE_URL)throw new Error('BURGOWEB_INTEGRATION_DATABASE_URL é obrigatória para este teste.');
  pool=new Pool({connectionString:process.env.BURGOWEB_INTEGRATION_DATABASE_URL});
  await new PostgresGlobalMigrator(pool).migrate();
  await pool.query(`INSERT INTO burgoweb_global.accounts(id,email_normalized,state,email_verified_at,created_at) VALUES($1,$2,'active',now(),now())`,[accountId,`${accountId}@example.com`]);
  await pool.query(`INSERT INTO burgoweb_global.tenant_registry(id,public_id,schema_name,display_name,state,migration_version,created_at) VALUES($1,$2,$3,'Integração Responsáveis Financeiros','active',8,now())`,[tenantId,tenantPublicId,schema]);
  await new PostgresTenantMigrator(pool).createAndMigrate(schema,{personId:actorPersonId,authorityId,fullName:'Síndica Integração',acceptedAt:new Date()});
  await pool.query(`UPDATE ${schema}.authority_assignment SET state='active',activated_at=now() WHERE id=$1`,[authorityId]);
  await pool.query(`UPDATE ${schema}.role_assignment SET state='active' WHERE id=$1`,[authorityId]);
  await pool.query(`UPDATE ${schema}.role_authorization_projection SET state='active' WHERE assignment_id=$1`,[authorityId]);
  await pool.query(`INSERT INTO burgoweb_global.account_tenant_memberships(id,account_id,tenant_id,person_id,authority_id,state,valid_from,authorization_version) VALUES($1,$2,$3,$4,$5,'active',now(),1)`,[membershipId,accountId,tenantId,actorPersonId,authorityId]);
  await pool.query(`INSERT INTO ${schema}.unit(id,public_id,identifier,identifier_normalized,state,version,created_at,created_by) VALUES($1,$2,'101','101','active',1,now(),$3)`,[unitId,unitId,actorPersonId]);
  await pool.query(`INSERT INTO ${schema}.person(id,public_id,full_name,state,version,created_at) VALUES($1,$2,'Beneficiária Financeira','active',1,now())`,[beneficiaryPersonId,beneficiaryPersonId]);
  await pool.query(`INSERT INTO ${schema}.person_unit_relationship(id,public_id,person_id,unit_id,relation_kind,starts_on,state,version,created_at,created_by) VALUES($1,$2,$3,$4,'resident',current_date-1,'active',1,now(),$5)`,[relationshipId,relationshipId,beneficiaryPersonId,unitId,actorPersonId]);
  await pool.query(`INSERT INTO ${schema}.person(id,public_id,full_name,state,version,created_at) VALUES($1,$2,'Sem Vínculo','active',1,now())`,[outsiderPersonId,outsiderPersonId]);
 },60_000);
 afterAll(async()=>{await pool?.end();});

 test('atribui, remove e persiste efeitos atômicos (transição, auditoria, projeção, outbox)',async()=>{
  const repository=new PostgresFinancialResponsibleRepository(pool);
  const context={accountId,personId:actorPersonId,membershipId,tenantId,publicId:tenantPublicId,schemaName:schema,displayName:'Integração Responsáveis Financeiros',timeZone:'America/Sao_Paulo',authorizationVersion:1,capabilities:['financial-responsibles.manage']};
  const assigned=await repository.assign(context,{personPublicId:beneficiaryPersonId,unitPublicId:unitId,validFrom:new Date(Date.now()-1000).toISOString(),validUntil:null,confirmed:true,idempotencyKey:'integration-financial-responsible-assign',requestId:randomUUID()});
  expect(assigned).toMatchObject({state:'active',personPublicId:beneficiaryPersonId,unitPublicId:unitId,relationshipPublicId:relationshipId,version:1});
  const removed=await repository.remove(context,{publicId:assigned.publicId,expectedVersion:1,confirmed:true,requestId:randomUUID()});
  expect(removed).toMatchObject({state:'revoked',version:2});
  await expect(repository.remove(context,{publicId:assigned.publicId,expectedVersion:1,confirmed:true,requestId:randomUUID()})).rejects.toMatchObject({name:'FinancialResponsibleConflict',current:expect.objectContaining({state:'revoked',version:2})});
  const effects=await pool.query(`SELECT (SELECT count(*)::int FROM ${schema}.financial_responsible_transition WHERE assignment_id=assignment.id) transitions,(SELECT count(*)::int FROM ${schema}.institutional_audit_event WHERE target_id=assignment.id) audits,(SELECT count(*)::int FROM ${schema}.financial_responsible_notification_outbox WHERE assignment_id=assignment.id) outbox,(SELECT state FROM ${schema}.financial_responsible_projection WHERE assignment_id=assignment.id) projected_state FROM ${schema}.financial_responsible_assignment assignment WHERE assignment.public_id=$1`,[assigned.publicId]);
  expect(effects.rows[0]).toEqual({transitions:2,audits:2,outbox:2,projected_state:'revoked'});
 });

 test('nega atribuição a Pessoa sem Vínculo compatível com a Unidade',async()=>{
  const repository=new PostgresFinancialResponsibleRepository(pool);
  const context={accountId,personId:actorPersonId,membershipId,tenantId,publicId:tenantPublicId,schemaName:schema,displayName:'Integração Responsáveis Financeiros',timeZone:'America/Sao_Paulo',authorizationVersion:1,capabilities:['financial-responsibles.manage']};
  await expect(repository.assign(context,{personPublicId:outsiderPersonId,unitPublicId:unitId,validFrom:new Date(Date.now()-1000).toISOString(),validUntil:null,confirmed:true,idempotencyKey:'integration-financial-responsible-no-relationship',requestId:randomUUID()})).rejects.toMatchObject({name:'AuthorizationDenied'});
 });

 test('materializa atribuições agendadas com efeitos atômicos',async()=>{
  const repository=new PostgresFinancialResponsibleRepository(pool);
  const context={accountId,personId:actorPersonId,membershipId,tenantId,publicId:tenantPublicId,schemaName:schema,displayName:'Integração Responsáveis Financeiros',timeZone:'America/Sao_Paulo',authorizationVersion:1,capabilities:['financial-responsibles.manage']};
  const boundary=new Date(Date.now()+60_000);
  const assigned=await repository.assign(context,{personPublicId:beneficiaryPersonId,unitPublicId:unitId,validFrom:boundary.toISOString(),validUntil:null,confirmed:true,idempotencyKey:'integration-financial-responsible-scheduled',requestId:randomUUID()});
  expect(assigned.state).toBe('scheduled');
  expect(await repository.materialize(new Date(boundary.getTime()+1))).toBe(1);
  const effects=await pool.query(`SELECT assignment.state,assignment.version,transition.from_state,transition.to_state,projection.state projected_state FROM ${schema}.financial_responsible_assignment assignment JOIN ${schema}.financial_responsible_transition transition ON transition.assignment_id=assignment.id AND transition.to_state='active' JOIN ${schema}.financial_responsible_projection projection ON projection.assignment_id=assignment.id WHERE assignment.public_id=$1`,[assigned.publicId]);
  expect(effects.rows[0]).toMatchObject({state:'active',from_state:'scheduled',to_state:'active',projected_state:'active'});
 });

 test('encerrar o Vínculo de origem invalida a atribuição na próxima materialização (AC10)',async()=>{
  const repository=new PostgresFinancialResponsibleRepository(pool);
  const context={accountId,personId:actorPersonId,membershipId,tenantId,publicId:tenantPublicId,schemaName:schema,displayName:'Integração Responsáveis Financeiros',timeZone:'America/Sao_Paulo',authorizationVersion:1,capabilities:['financial-responsibles.manage']};
  const localUnitId=randomUUID(),localPersonId=randomUUID(),localRelationshipId=randomUUID();
  await pool.query(`INSERT INTO ${schema}.unit(id,public_id,identifier,identifier_normalized,state,version,created_at,created_by) VALUES($1,$2,'202','202','active',1,now(),$3)`,[localUnitId,localUnitId,actorPersonId]);
  await pool.query(`INSERT INTO ${schema}.person(id,public_id,full_name,state,version,created_at) VALUES($1,$2,'Vínculo Encerrado','active',1,now())`,[localPersonId,localPersonId]);
  await pool.query(`INSERT INTO ${schema}.person_unit_relationship(id,public_id,person_id,unit_id,relation_kind,starts_on,state,version,created_at,created_by) VALUES($1,$2,$3,$4,'resident',current_date-10,'active',1,now(),$5)`,[localRelationshipId,localRelationshipId,localPersonId,localUnitId,actorPersonId]);
  const assigned=await repository.assign(context,{personPublicId:localPersonId,unitPublicId:localUnitId,validFrom:new Date(Date.now()-1000).toISOString(),validUntil:null,confirmed:true,idempotencyKey:'integration-financial-responsible-relationship-ended',requestId:randomUUID()});
  expect(assigned.state).toBe('active');
  await pool.query(`UPDATE ${schema}.person_unit_relationship SET state='ended' WHERE id=$1`,[localRelationshipId]);
  expect(await repository.materialize(new Date())).toBe(1);
  const after=await pool.query(`SELECT state,version FROM ${schema}.financial_responsible_assignment WHERE public_id=$1`,[assigned.publicId]);
  expect(after.rows[0]).toMatchObject({state:'revoked',version:'2'});
 });

 test('duas atribuições concorrentes com a mesma Idempotency-Key retornam o mesmo resultado sem duplicar',async()=>{
  const repository=new PostgresFinancialResponsibleRepository(pool);
  const localUnitId=randomUUID(),localPersonId=randomUUID(),localRelationshipId=randomUUID();
  await pool.query(`INSERT INTO ${schema}.unit(id,public_id,identifier,identifier_normalized,state,version,created_at,created_by) VALUES($1,$2,'303','303','active',1,now(),$3)`,[localUnitId,localUnitId,actorPersonId]);
  await pool.query(`INSERT INTO ${schema}.person(id,public_id,full_name,state,version,created_at) VALUES($1,$2,'Concorrência','active',1,now())`,[localPersonId,localPersonId]);
  await pool.query(`INSERT INTO ${schema}.person_unit_relationship(id,public_id,person_id,unit_id,relation_kind,starts_on,state,version,created_at,created_by) VALUES($1,$2,$3,$4,'resident',current_date-1,'active',1,now(),$5)`,[localRelationshipId,localRelationshipId,localPersonId,localUnitId,actorPersonId]);
  const context={accountId,personId:actorPersonId,membershipId,tenantId,publicId:tenantPublicId,schemaName:schema,displayName:'Integração Responsáveis Financeiros',timeZone:'America/Sao_Paulo',authorizationVersion:1,capabilities:['financial-responsibles.manage']};
  const draft={personPublicId:localPersonId,unitPublicId:localUnitId,validFrom:new Date(Date.now()-1000).toISOString(),validUntil:null,confirmed:true as const,idempotencyKey:'integration-financial-responsible-concurrent',requestId:randomUUID()};
  const [first,second]=await Promise.all([repository.assign(context,draft),repository.assign(context,draft)]);
  expect(first.publicId).toBe(second.publicId);
  expect(first.version).toBe(second.version);
  const count=await pool.query(`SELECT count(*)::int AS count FROM ${schema}.financial_responsible_assignment WHERE person_id=$1 AND unit_id=$2`,[localPersonId,localUnitId]);
  expect(count.rows[0].count).toBe(1);
 });

 test('capacidade financial-responsibles.manage delegada a um Auxiliar autoriza atribuição real',async()=>{
  const { PostgresCapabilityGrantRepository } = await import('../packages/adapters/src/db/postgres-capability-grant-repository.js');
  const repository=new PostgresFinancialResponsibleRepository(pool);
  const capabilityRepository=new PostgresCapabilityGrantRepository(pool);
  const delegatePersonId=randomUUID(),delegateAuthorityId=randomUUID(),delegateAccountId=randomUUID(),delegateMembershipId=randomUUID(),localUnitId=randomUUID(),localPersonId=randomUUID(),localRelationshipId=randomUUID();
  await pool.query(`INSERT INTO ${schema}.person(id,public_id,full_name,state,version,created_at) VALUES($1,$2,'Auxiliar Delegado','active',1,now())`,[delegatePersonId,delegatePersonId]);
  await pool.query(`INSERT INTO ${schema}.role_assignment(id,public_id,person_id,role_kind,scope_kind,valid_from,state,granted_by_person_id,version,created_at,updated_at) VALUES($1,$1,$2,'administrative-assistant','tenant',now(),'active',$3,1,now(),now())`,[delegateAuthorityId,delegatePersonId,actorPersonId]);
  await pool.query(`INSERT INTO ${schema}.authority_assignment(id,person_id,state,created_at,role_kind,capabilities,authorization_version,activated_at) VALUES($1,$2,'active',now(),'administrative-assistant',ARRAY['dashboard.read'],1,now())`,[delegateAuthorityId,delegatePersonId]);
  await pool.query(`INSERT INTO burgoweb_global.accounts(id,email_normalized,state,email_verified_at,created_at) VALUES($1,$2,'active',now(),now())`,[delegateAccountId,`${delegateAccountId}@example.com`]);
  await pool.query(`INSERT INTO burgoweb_global.account_tenant_memberships(id,account_id,tenant_id,person_id,authority_id,state,valid_from,authorization_version) VALUES($1,$2,$3,$4,$5,'active',now(),1)`,[delegateMembershipId,delegateAccountId,tenantId,delegatePersonId,delegateAuthorityId]);
  await pool.query(`INSERT INTO ${schema}.unit(id,public_id,identifier,identifier_normalized,state,version,created_at,created_by) VALUES($1,$2,'404','404','active',1,now(),$3)`,[localUnitId,localUnitId,actorPersonId]);
  await pool.query(`INSERT INTO ${schema}.person(id,public_id,full_name,state,version,created_at) VALUES($1,$2,'Beneficiária Delegada','active',1,now())`,[localPersonId,localPersonId]);
  await pool.query(`INSERT INTO ${schema}.person_unit_relationship(id,public_id,person_id,unit_id,relation_kind,starts_on,state,version,created_at,created_by) VALUES($1,$2,$3,$4,'resident',current_date-1,'active',1,now(),$5)`,[localRelationshipId,localRelationshipId,localPersonId,localUnitId,actorPersonId]);
  const syndicContext={accountId,personId:actorPersonId,membershipId,tenantId,publicId:tenantPublicId,schemaName:schema,displayName:'Integração Responsáveis Financeiros',timeZone:'America/Sao_Paulo',authorizationVersion:1,capabilities:['capabilities.grant','financial-responsibles.manage']};
  await capabilityRepository.grant(syndicContext,{personPublicId:delegatePersonId,capabilityId:'financial-responsibles.manage',validFrom:new Date(Date.now()-1000).toISOString(),validUntil:null,confirmed:true,idempotencyKey:'integration-financial-responsible-delegated-capability',requestId:randomUUID()});
  const delegateContext={accountId:delegateAccountId,personId:delegatePersonId,membershipId:delegateMembershipId,tenantId,publicId:tenantPublicId,schemaName:schema,displayName:'Integração Responsáveis Financeiros',timeZone:'America/Sao_Paulo',authorizationVersion:1,capabilities:['dashboard.read','role.administrative-assistant','financial-responsibles.manage']};
  const assigned=await repository.assign(delegateContext,{personPublicId:localPersonId,unitPublicId:localUnitId,validFrom:new Date(Date.now()-1000).toISOString(),validUntil:null,confirmed:true,idempotencyKey:'integration-financial-responsible-via-delegate',requestId:randomUUID()});
  expect(assigned).toMatchObject({state:'active',personPublicId:localPersonId,unitPublicId:localUnitId});
 });

 test('migration 008 é aditiva e idempotente ao reaplicar',async()=>{
  const freshSchema=`tenant_${randomUUID().replaceAll('-','')}`;
  const client=await pool.connect();
  try{
   await client.query(`CREATE SCHEMA ${freshSchema}`);
   await client.query('BEGIN');
   await client.query(`SET LOCAL search_path TO ${freshSchema},pg_catalog`);
   for(const file of ['001_identity_pending.sql','002_activate_initial_authority.sql','003_authorization_context.sql','004_people_units_relationships.sql','005_invitations_capability.sql','006_role_lifecycle.sql','007_capability_delegation.sql'])
    await client.query(await readFile(`migrations/tenant/${file}`,'utf8'));
   const migration008=await readFile('migrations/tenant/008_financial_responsibles.sql','utf8');
   await client.query(migration008);
   const firstVersion=await client.query(`SELECT count(*)::int AS count FROM schema_version WHERE version=8`);
   expect(firstVersion.rows[0].count).toBe(1);
   await client.query(migration008);
   const secondVersion=await client.query(`SELECT count(*)::int AS count FROM schema_version WHERE version=8`);
   expect(secondVersion.rows[0].count).toBe(1);
   const table=await client.query(`SELECT to_regclass('${freshSchema}.financial_responsible_assignment') AS regclass`);
   await client.query('COMMIT');
   expect(table.rows[0].regclass).not.toBeNull();
  }catch(error){
   await client.query('ROLLBACK').catch(()=>undefined);
   throw error;
  }finally{
   await client.query(`DROP SCHEMA IF EXISTS ${freshSchema} CASCADE`);
   client.release();
  }
 });
});
