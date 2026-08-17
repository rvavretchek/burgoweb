import { randomUUID } from 'node:crypto';
import { Pool } from 'pg';
import { MaterializeCapabilityGrants, MaterializeFinancialResponsibles, MaterializeRoleAssignments, ProcessCapabilityNotification, ProcessFinancialResponsibleNotification, ProcessInvitationEmail, ProcessRecoveryEmail, ProcessRoleNotification, ProcessVerificationEmail } from '@burgoweb/application';
import { HmacInvitationTokenCodec, HmacRecoveryTokenCodec, HmacVerificationTokenCodec, HttpEmailPort, MailpitEmailPort, PostgresCapabilityGrantRepository, PostgresCapabilityNotificationOutbox, PostgresFinancialResponsibleNotificationOutbox, PostgresFinancialResponsibleRepository, PostgresGlobalMigrator, PostgresInvitationOutbox, PostgresRecoveryOutbox, PostgresRoleAssignmentRepository, PostgresRoleNotificationOutbox, PostgresVerificationOutbox } from '@burgoweb/adapters';
import { loadEmailDeliveryConfig, loadInvitationConfig, loadRecoveryConfig, loadVerificationConfig } from '@burgoweb/config';

export async function startWorker(env: NodeJS.ProcessEnv = process.env): Promise<() => Promise<void>> {
  if (!env.BURGOWEB_DATABASE_URL) throw new Error('Configuração runtime ausente: BURGOWEB_DATABASE_URL.');
  const pool = new Pool({ connectionString: env.BURGOWEB_DATABASE_URL, max: 5 });
  pool.on('error', () => undefined);
  try {
    await new PostgresGlobalMigrator(pool).migrate();
    if (env.BURGOWEB_EMAIL_WORKER_DISABLED === 'true') {
      const idle = setInterval(() => undefined, 60_000);
      return async () => { clearInterval(idle); await pool.end(); };
    }
    const verification = loadVerificationConfig(env);
    const recovery = loadRecoveryConfig(env),invitation=loadInvitationConfig(env);const delivery = env.BURGOWEB_EMAIL_TRANSPORT === 'mailpit' ? undefined : loadEmailDeliveryConfig(env);
    const codec = new HmacVerificationTokenCodec({ currentVersion: verification.currentKeyVersion, keys: verification.tokenKeys });
    const email = env.BURGOWEB_EMAIL_TRANSPORT === 'mailpit'
      ? new MailpitEmailPort({ endpoint: env.BURGOWEB_MAILPIT_SEND_URL ?? 'http://127.0.0.1:8025/api/v1/send', from: env.BURGOWEB_EMAIL_FROM ?? 'nao-responda@burgoweb.local' })
      : new HttpEmailPort({ from: delivery!.emailFrom, primary: { name: 'brevo', endpoint: 'https://api.brevo.com/v3/smtp/email', apiKey: delivery!.primaryApiKey }, fallback: delivery!.fallbackApiKey ? { name: 'resend', endpoint: 'https://api.resend.com/emails', apiKey: delivery!.fallbackApiKey } : undefined });
    const job = new ProcessVerificationEmail({ repository: new PostgresVerificationOutbox(pool), codec, baseUrl: verification.baseUrl, leaseSeconds: verification.leaseSeconds, maxAttempts: verification.maxAttempts, owner: randomUUID(), email });
    const recoveryJob=new ProcessRecoveryEmail({repository:new PostgresRecoveryOutbox(pool),codec:new HmacRecoveryTokenCodec({currentVersion:recovery.currentKeyVersion,keys:recovery.tokenKeys}),baseUrl:recovery.baseUrl,leaseSeconds:verification.leaseSeconds,maxAttempts:verification.maxAttempts,owner:randomUUID(),email});
    const invitationJob=new ProcessInvitationEmail({repository:new PostgresInvitationOutbox(pool),codec:new HmacInvitationTokenCodec({currentVersion:invitation.currentKeyVersion,keys:invitation.tokenKeys}),baseUrl:invitation.baseUrl,leaseSeconds:invitation.leaseSeconds,maxAttempts:invitation.maxAttempts,owner:randomUUID(),email});
    const roleLifecycleJob=new MaterializeRoleAssignments(new PostgresRoleAssignmentRepository(pool));
    const roleNotificationJob=new ProcessRoleNotification({repository:new PostgresRoleNotificationOutbox(pool),email,owner:randomUUID(),leaseSeconds:verification.leaseSeconds,maxAttempts:verification.maxAttempts});
    const capabilityLifecycleJob=new MaterializeCapabilityGrants(new PostgresCapabilityGrantRepository(pool));
    const capabilityNotificationJob=new ProcessCapabilityNotification({repository:new PostgresCapabilityNotificationOutbox(pool),email,owner:randomUUID(),leaseSeconds:verification.leaseSeconds,maxAttempts:verification.maxAttempts});
    const financialResponsibleLifecycleJob=new MaterializeFinancialResponsibles(new PostgresFinancialResponsibleRepository(pool));
    const financialResponsibleNotificationJob=new ProcessFinancialResponsibleNotification({repository:new PostgresFinancialResponsibleNotificationOutbox(pool),email,owner:randomUUID(),leaseSeconds:verification.leaseSeconds,maxAttempts:verification.maxAttempts});
    let stopping = false; let timer: NodeJS.Timeout | undefined; let turn = 0;const jobs=[job,recoveryJob,invitationJob,roleNotificationJob,{execute:async()=>Boolean(await roleLifecycleJob.execute())},capabilityNotificationJob,{execute:async()=>Boolean(await capabilityLifecycleJob.execute())},financialResponsibleNotificationJob,{execute:async()=>Boolean(await financialResponsibleLifecycleJob.execute())}];
    const run = async () => { if (stopping) return; try {turn=(turn+1)%jobs.length;let worked=false;for(let offset=0;offset<jobs.length&&!worked;offset++)worked=await jobs[(turn+offset)%jobs.length]!.execute(); timer = setTimeout(run, worked ? 10 : 1000); } catch { timer = setTimeout(run, 2000); } };
    void run();
    return async () => { stopping = true; if (timer) clearTimeout(timer); await pool.end(); };
  } catch (error) { await pool.end(); throw error; }
}
