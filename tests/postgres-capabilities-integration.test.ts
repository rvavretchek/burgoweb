import { readFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { Pool } from 'pg';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { PostgresCapabilityGrantRepository, PostgresGlobalMigrator, PostgresRoleAssignmentRepository, PostgresTenantMigrator } from '../packages/adapters/src/index.js';

describe.runIf(process.env.BURGOWEB_INTEGRATION==='1').sequential('Story 1.9 - PostgreSQL 18 real',()=>{
 let pool:Pool;const schema=`tenant_${randomUUID().replaceAll('-','')}`,tenantId=randomUUID(),tenantPublicId=randomUUID(),accountId=randomUUID(),actorPersonId=randomUUID(),authorityId=randomUUID(),membershipId=randomUUID(),auxiliarPersonId=randomUUID(),auxiliarAuthorityId=randomUUID(),outsiderPersonId=randomUUID(),auxiliarAccountId=randomUUID(),auxiliarMembershipId=randomUUID();
 beforeAll(async()=>{
  if(!process.env.BURGOWEB_INTEGRATION_DATABASE_URL)throw new Error('BURGOWEB_INTEGRATION_DATABASE_URL é obrigatória para este teste.');
  pool=new Pool({connectionString:process.env.BURGOWEB_INTEGRATION_DATABASE_URL});
  await new PostgresGlobalMigrator(pool).migrate();
  await pool.query(`INSERT INTO burgoweb_global.accounts(id,email_normalized,state,email_verified_at,created_at) VALUES($1,$2,'active',now(),now())`,[accountId,`${accountId}@example.com`]);
  await pool.query(`INSERT INTO burgoweb_global.tenant_registry(id,public_id,schema_name,display_name,state,migration_version,created_at) VALUES($1,$2,$3,'Integração Capacidades','active',8,now())`,[tenantId,tenantPublicId,schema]);
  await new PostgresTenantMigrator(pool).createAndMigrate(schema,{personId:actorPersonId,authorityId,fullName:'Síndica Integração',acceptedAt:new Date()});
  await pool.query(`UPDATE ${schema}.authority_assignment SET state='active',activated_at=now() WHERE id=$1`,[authorityId]);
  await pool.query(`UPDATE ${schema}.role_assignment SET state='active' WHERE id=$1`,[authorityId]);
  await pool.query(`UPDATE ${schema}.role_authorization_projection SET state='active' WHERE assignment_id=$1`,[authorityId]);
  await pool.query(`INSERT INTO burgoweb_global.account_tenant_memberships(id,account_id,tenant_id,person_id,authority_id,state,valid_from,authorization_version) VALUES($1,$2,$3,$4,$5,'active',now(),1)`,[membershipId,accountId,tenantId,actorPersonId,authorityId]);
  await pool.query(`INSERT INTO ${schema}.person(id,public_id,full_name,state,version,created_at) VALUES($1,$2,'Auxiliar Alvo','active',1,now())`,[auxiliarPersonId,auxiliarPersonId]);
  await pool.query(`INSERT INTO ${schema}.role_assignment(id,public_id,person_id,role_kind,scope_kind,valid_from,state,granted_by_person_id,version,created_at,updated_at) VALUES($1,$1,$2,'administrative-assistant','tenant',now(),'active',$3,1,now(),now())`,[auxiliarAuthorityId,auxiliarPersonId,actorPersonId]);
  await pool.query(`INSERT INTO ${schema}.authority_assignment(id,person_id,state,created_at,role_kind,capabilities,authorization_version,activated_at) VALUES($1,$2,'active',now(),'administrative-assistant',ARRAY['dashboard.read'],1,now())`,[auxiliarAuthorityId,auxiliarPersonId]);
  await pool.query(`INSERT INTO burgoweb_global.accounts(id,email_normalized,state,email_verified_at,created_at) VALUES($1,$2,'active',now(),now())`,[auxiliarAccountId,`${auxiliarAccountId}@example.com`]);
  await pool.query(`INSERT INTO burgoweb_global.account_tenant_memberships(id,account_id,tenant_id,person_id,authority_id,state,valid_from,authorization_version) VALUES($1,$2,$3,$4,$5,'active',now(),1)`,[auxiliarMembershipId,auxiliarAccountId,tenantId,auxiliarPersonId,auxiliarAuthorityId]);
  await pool.query(`INSERT INTO ${schema}.person(id,public_id,full_name,state,version,created_at) VALUES($1,$2,'Sem Papel','active',1,now())`,[outsiderPersonId,outsiderPersonId]);
 },60_000);
 afterAll(async()=>{await pool?.end();});

 test('concede, revoga e persiste efeitos atômicos (transição, auditoria, projeção, outbox)',async()=>{
  const repository=new PostgresCapabilityGrantRepository(pool);
  const context={accountId,personId:actorPersonId,membershipId,tenantId,publicId:tenantPublicId,schemaName:schema,displayName:'Integração Capacidades',timeZone:'America/Sao_Paulo',authorizationVersion:1,capabilities:['capabilities.grant']};
  const granted=await repository.grant(context,{personPublicId:auxiliarPersonId,capabilityId:'roles.suspend',validFrom:new Date(Date.now()-1000).toISOString(),validUntil:null,confirmed:true,idempotencyKey:'integration-capability-grant',requestId:randomUUID()});
  expect(granted).toMatchObject({state:'active',capabilityId:'roles.suspend',version:1});
  const revoked=await repository.revoke(context,{publicId:granted.publicId,expectedVersion:1,confirmed:true,requestId:randomUUID()});
  expect(revoked).toMatchObject({state:'revoked',version:2});
  await expect(repository.revoke(context,{publicId:granted.publicId,expectedVersion:1,confirmed:true,requestId:randomUUID()})).rejects.toMatchObject({name:'CapabilityConflict',current:expect.objectContaining({state:'revoked',version:2})});
  const effects=await pool.query(`SELECT (SELECT count(*)::int FROM ${schema}.capability_grant_transition WHERE grant_id=grant_row.id) transitions,(SELECT count(*)::int FROM ${schema}.institutional_audit_event WHERE target_id=grant_row.id) audits,(SELECT count(*)::int FROM ${schema}.capability_notification_outbox WHERE grant_id=grant_row.id) outbox,(SELECT state FROM ${schema}.capability_grant_projection WHERE grant_id=grant_row.id) projected_state FROM ${schema}.capability_grant grant_row WHERE grant_row.public_id=$1`,[granted.publicId]);
  expect(effects.rows[0]).toEqual({transitions:2,audits:2,outbox:2,projected_state:'revoked'});
 });

 test('nega concessão a Pessoa sem Papel administrative-assistant vigente',async()=>{
  const repository=new PostgresCapabilityGrantRepository(pool);
  const context={accountId,personId:actorPersonId,membershipId,tenantId,publicId:tenantPublicId,schemaName:schema,displayName:'Integração Capacidades',timeZone:'America/Sao_Paulo',authorizationVersion:1,capabilities:['capabilities.grant']};
  await expect(repository.grant(context,{personPublicId:outsiderPersonId,capabilityId:'invitations.manage',validFrom:new Date(Date.now()-1000).toISOString(),validUntil:null,confirmed:true,idempotencyKey:'integration-capability-ineligible',requestId:randomUUID()})).rejects.toMatchObject({name:'AuthorizationDenied'});
 });

 test('materializa concessões agendadas com efeitos atômicos',async()=>{
  const repository=new PostgresCapabilityGrantRepository(pool);
  const context={accountId,personId:actorPersonId,membershipId,tenantId,publicId:tenantPublicId,schemaName:schema,displayName:'Integração Capacidades',timeZone:'America/Sao_Paulo',authorizationVersion:1,capabilities:['capabilities.grant']};
  const boundary=new Date(Date.now()+60_000);
  const granted=await repository.grant(context,{personPublicId:auxiliarPersonId,capabilityId:'invitations.manage',validFrom:boundary.toISOString(),validUntil:null,confirmed:true,idempotencyKey:'integration-capability-scheduled',requestId:randomUUID()});
  expect(granted.state).toBe('scheduled');
  expect(await repository.materialize(new Date(boundary.getTime()+1))).toBe(1);
  const effects=await pool.query(`SELECT grant_row.state,grant_row.version,transition.from_state,transition.to_state,projection.state projected_state FROM ${schema}.capability_grant grant_row JOIN ${schema}.capability_grant_transition transition ON transition.grant_id=grant_row.id AND transition.to_state='active' JOIN ${schema}.capability_grant_projection projection ON projection.grant_id=grant_row.id WHERE grant_row.public_id=$1`,[granted.publicId]);
  expect(effects.rows[0]).toMatchObject({state:'active',from_state:'scheduled',to_state:'active',projected_state:'active'});
 });

 test('capacidade delegada realmente altera as capacidades resolvidas no TenantContext do Auxiliar',async()=>{
  const { PostgresIdentityRepository } = await import('../packages/adapters/src/db/postgres-identity-repository.js');
  const identity=new PostgresIdentityRepository(pool,'integration-audit-key');
  const before=await identity.resolveContext(auxiliarAccountId,tenantPublicId,new Date(),'roles.suspend',randomUUID());
  expect(before).toBeUndefined();
  const capabilityRepository=new PostgresCapabilityGrantRepository(pool);
  const syndicContext={accountId,personId:actorPersonId,membershipId,tenantId,publicId:tenantPublicId,schemaName:schema,displayName:'Integração Capacidades',timeZone:'America/Sao_Paulo',authorizationVersion:1,capabilities:['capabilities.grant']};
  await capabilityRepository.grant(syndicContext,{personPublicId:auxiliarPersonId,capabilityId:'roles.suspend',validFrom:new Date(Date.now()-1000).toISOString(),validUntil:null,confirmed:true,idempotencyKey:'integration-capability-context',requestId:randomUUID()});
  const after=await identity.resolveContext(auxiliarAccountId,tenantPublicId,new Date(),'roles.suspend',randomUUID());
  expect(after?.capabilities).toContain('roles.suspend');
 });

 test('migration 007 é aditiva e idempotente ao reaplicar',async()=>{
  const freshSchema=`tenant_${randomUUID().replaceAll('-','')}`;
  const client=await pool.connect();
  try{
   await client.query(`CREATE SCHEMA ${freshSchema}`);
   await client.query('BEGIN');
   await client.query(`SET LOCAL search_path TO ${freshSchema},pg_catalog`);
   for(const file of ['001_identity_pending.sql','002_activate_initial_authority.sql','003_authorization_context.sql','004_people_units_relationships.sql','005_invitations_capability.sql','006_role_lifecycle.sql'])
    await client.query(await readFile(`migrations/tenant/${file}`,'utf8'));
   const migration007=await readFile('migrations/tenant/007_capability_delegation.sql','utf8');
   await client.query(migration007);
   const firstVersion=await client.query(`SELECT count(*)::int AS count FROM schema_version WHERE version=7`);
   expect(firstVersion.rows[0].count).toBe(1);
   await client.query(migration007);
   const secondVersion=await client.query(`SELECT count(*)::int AS count FROM schema_version WHERE version=7`);
   expect(secondVersion.rows[0].count).toBe(1);
   const table=await client.query(`SELECT to_regclass('${freshSchema}.capability_grant') AS regclass`);
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

 test('duas concessões concorrentes com a mesma Idempotency-Key retornam o mesmo resultado sem duplicar',async()=>{
  const repository=new PostgresCapabilityGrantRepository(pool);
  const targetPersonId=randomUUID(),targetAuthorityId=randomUUID();
  await pool.query(`INSERT INTO ${schema}.person(id,public_id,full_name,state,version,created_at) VALUES($1,$2,'Auxiliar Concorrência','active',1,now())`,[targetPersonId,targetPersonId]);
  await pool.query(`INSERT INTO ${schema}.role_assignment(id,public_id,person_id,role_kind,scope_kind,valid_from,state,granted_by_person_id,version,created_at,updated_at) VALUES($1,$1,$2,'administrative-assistant','tenant',now(),'active',$3,1,now(),now())`,[targetAuthorityId,targetPersonId,actorPersonId]);
  const context={accountId,personId:actorPersonId,membershipId,tenantId,publicId:tenantPublicId,schemaName:schema,displayName:'Integração Capacidades',timeZone:'America/Sao_Paulo',authorizationVersion:1,capabilities:['capabilities.grant']};
  const draft={personPublicId:targetPersonId,capabilityId:'roles.suspend',validFrom:new Date(Date.now()-1000).toISOString(),validUntil:null,confirmed:true as const,idempotencyKey:'integration-capability-concurrent',requestId:randomUUID()};
  const [first,second]=await Promise.all([repository.grant(context,draft),repository.grant(context,draft)]);
  expect(first.publicId).toBe(second.publicId);
  expect(first.version).toBe(second.version);
  const count=await pool.query(`SELECT count(*)::int AS count FROM ${schema}.capability_grant WHERE person_id=$1 AND capability_id='roles.suspend'`,[targetPersonId]);
  expect(count.rows[0].count).toBe(1);
 });

 test('capacidade delegada autoriza suspensão real via authorize() de Papéis e deixa de autorizar imediatamente após a revogação',async()=>{
  const roleRepository=new PostgresRoleAssignmentRepository(pool);
  const capabilityRepository=new PostgresCapabilityGrantRepository(pool);
  const delegatePersonId=randomUUID(),delegateAuthorityId=randomUUID(),delegateAccountId=randomUUID(),delegateMembershipId=randomUUID(),targetPersonId=randomUUID();
  await pool.query(`INSERT INTO ${schema}.person(id,public_id,full_name,state,version,created_at) VALUES($1,$2,'Auxiliar Revalidação','active',1,now())`,[delegatePersonId,delegatePersonId]);
  await pool.query(`INSERT INTO ${schema}.role_assignment(id,public_id,person_id,role_kind,scope_kind,valid_from,state,granted_by_person_id,version,created_at,updated_at) VALUES($1,$1,$2,'administrative-assistant','tenant',now(),'active',$3,1,now(),now())`,[delegateAuthorityId,delegatePersonId,actorPersonId]);
  await pool.query(`INSERT INTO ${schema}.authority_assignment(id,person_id,state,created_at,role_kind,capabilities,authorization_version,activated_at) VALUES($1,$2,'active',now(),'administrative-assistant',ARRAY['dashboard.read'],1,now())`,[delegateAuthorityId,delegatePersonId]);
  await pool.query(`INSERT INTO burgoweb_global.accounts(id,email_normalized,state,email_verified_at,created_at) VALUES($1,$2,'active',now(),now())`,[delegateAccountId,`${delegateAccountId}@example.com`]);
  await pool.query(`INSERT INTO burgoweb_global.account_tenant_memberships(id,account_id,tenant_id,person_id,authority_id,state,valid_from,authorization_version) VALUES($1,$2,$3,$4,$5,'active',now(),1)`,[delegateMembershipId,delegateAccountId,tenantId,delegatePersonId,delegateAuthorityId]);
  await pool.query(`INSERT INTO ${schema}.person(id,public_id,full_name,state,version,created_at) VALUES($1,$2,'Conselheira Revalidação','active',1,now())`,[targetPersonId,targetPersonId]);
  const syndicContext={accountId,personId:actorPersonId,membershipId,tenantId,publicId:tenantPublicId,schemaName:schema,displayName:'Integração Capacidades',timeZone:'America/Sao_Paulo',authorizationVersion:1,capabilities:['capabilities.grant','roles.grant','roles.restore']};
  const granted=await roleRepository.grant(syndicContext,{personPublicId:targetPersonId,role:'councilor',scope:{type:'tenant'},validFrom:new Date(Date.now()-1000).toISOString(),validUntil:null,timeZone:'America/Sao_Paulo',confirmed:true,idempotencyKey:'integration-revalidation-target',requestId:randomUUID()});
  const capabilityGrant=await capabilityRepository.grant(syndicContext,{personPublicId:delegatePersonId,capabilityId:'roles.suspend',validFrom:new Date(Date.now()-1000).toISOString(),validUntil:null,confirmed:true,idempotencyKey:'integration-revalidation-capability',requestId:randomUUID()});
  const delegateContext={accountId:delegateAccountId,personId:delegatePersonId,membershipId:delegateMembershipId,tenantId,publicId:tenantPublicId,schemaName:schema,displayName:'Integração Capacidades',timeZone:'America/Sao_Paulo',authorizationVersion:1,capabilities:['dashboard.read','roles.read','role.administrative-assistant','roles.suspend']};
  const suspended=await roleRepository.transition(delegateContext,{publicId:granted.publicId,transition:'suspend',expectedVersion:1,reason:'Suspensão delegada antes da revogação.',requestId:randomUUID()});
  expect(suspended.state).toBe('suspended');
  await capabilityRepository.revoke(syndicContext,{publicId:capabilityGrant.publicId,expectedVersion:1,confirmed:true,requestId:randomUUID()});
  const restored=await roleRepository.transition(syndicContext,{publicId:granted.publicId,transition:'restore',expectedVersion:2,confirmed:true,requestId:randomUUID()});
  expect(restored.state).toBe('active');
  await expect(roleRepository.transition(delegateContext,{publicId:granted.publicId,transition:'suspend',expectedVersion:3,reason:'Tentativa pós-revogação.',requestId:randomUUID()})).rejects.toMatchObject({name:'AuthorizationDenied'});
 });
});
