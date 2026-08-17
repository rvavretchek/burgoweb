export interface SecurityConfig { pepper: string; pepperVersion: string; previousPeppers: Record<string, string> }
export interface SessionConfig { secret: string; absoluteTtlSeconds: number; idleTtlSeconds: number; touchIntervalSeconds: number; rateLimitKey: string }
export interface RecoveryConfig {
  baseUrl: string; tokenTtlSeconds: number; currentKeyVersion: string; tokenKeys: Record<string,string>;
  requestLimit: number; requestOriginLimit: number; requestWindowSeconds: number;
  confirmationLimit: number; confirmationOriginLimit: number; confirmationWindowSeconds: number;
}
export interface InvitationConfig {baseUrl:string;tokenTtlSeconds:number;leaseSeconds:number;maxAttempts:number;mutationLimit:number;acceptanceLimit:number;rateWindowSeconds:number;currentKeyVersion:string;tokenKeys:Record<string,string>}
export interface RuntimeConfig { databaseUrl: string; host: string; port: number; security: SecurityConfig; session: SessionConfig; verification: VerificationConfig; recovery: RecoveryConfig; invitation:InvitationConfig }

export interface VerificationConfig {
  baseUrl: string;
  tokenTtlSeconds: number;
  leaseSeconds: number;
  maxAttempts: number;
  currentKeyVersion: string;
  tokenKeys: Record<string, string>;
}

export interface EmailDeliveryConfig { emailFrom: string; primaryApiKey: string; fallbackApiKey?: string }

function positiveInteger(value: string | undefined, fallback: number, name: string): number {
  const parsed = Number(value ?? fallback);
  if (!Number.isInteger(parsed) || parsed < 1) throw new Error(`Configuração runtime incoerente: ${name}.`);
  return parsed;
}

function boundedPositiveInteger(value: string | undefined, fallback: number, name: string, maximum: number): number {
  const parsed = positiveInteger(value, fallback, name);
  if (parsed > maximum) throw new Error(`Runtime configuration exceeds the safe limit: ${name}.`);
  return parsed;
}

export function loadVerificationConfig(env: NodeJS.ProcessEnv = process.env): VerificationConfig {
  const baseUrl = env.BURGOWEB_VERIFICATION_BASE_URL;
  const currentKeyVersion = env.BURGOWEB_VERIFICATION_TOKEN_KEY_VERSION;
  const currentKey = env.BURGOWEB_VERIFICATION_TOKEN_KEY;
  if (!baseUrl || !currentKeyVersion || !currentKey || currentKey.length < 32) throw new Error('Configuração de verificação ausente ou incoerente.');
  let parsed: URL;
  try { parsed = new URL(baseUrl); } catch { throw new Error('Configuração de verificação: URL inválida.'); }
  const localDevelopment = env.BURGOWEB_ALLOW_INSECURE_LOCAL_ORIGIN === 'true' && parsed.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(parsed.hostname);
  if ((!localDevelopment && parsed.protocol !== 'https:') || parsed.username || parsed.password || parsed.pathname !== '/' || parsed.search || parsed.hash) throw new Error('Configuração de verificação: URL pública deve ser uma origem HTTPS.');
  const tokenKeys: Record<string, string> = { [currentKeyVersion]: currentKey };
  const hasPreviousKey = Boolean(env.BURGOWEB_VERIFICATION_PREVIOUS_TOKEN_KEY);
  const hasPreviousVersion = Boolean(env.BURGOWEB_VERIFICATION_PREVIOUS_TOKEN_KEY_VERSION);
  if (hasPreviousKey !== hasPreviousVersion) throw new Error('Configuração de verificação: rotação de chave parcialmente configurada.');
  if (hasPreviousKey && hasPreviousVersion) {
    const previousKey = env.BURGOWEB_VERIFICATION_PREVIOUS_TOKEN_KEY!;
    const previousVersion = env.BURGOWEB_VERIFICATION_PREVIOUS_TOKEN_KEY_VERSION!;
    if (previousVersion === currentKeyVersion) throw new Error('Configuração de verificação: versão de chave anterior colide com a versão atual.');
    if (previousKey.length < 32) throw new Error('Configuração de verificação: chave anterior incoerente.');
    tokenKeys[previousVersion] = previousKey;
  }
  return {
    baseUrl: parsed.origin,
    tokenTtlSeconds: positiveInteger(env.BURGOWEB_VERIFICATION_TOKEN_TTL_SECONDS, 3600, 'TOKEN_TTL_SECONDS'),
    leaseSeconds: positiveInteger(env.BURGOWEB_EMAIL_LEASE_SECONDS, 30, 'EMAIL_LEASE_SECONDS'),
    maxAttempts: positiveInteger(env.BURGOWEB_EMAIL_MAX_ATTEMPTS, 5, 'EMAIL_MAX_ATTEMPTS'),
    currentKeyVersion,
    tokenKeys,
  };
}

export function loadEmailDeliveryConfig(env: NodeJS.ProcessEnv = process.env): EmailDeliveryConfig {
  const emailFrom = env.BURGOWEB_EMAIL_FROM;
  const primaryApiKey = env.BURGOWEB_EMAIL_PRIMARY_API_KEY;
  if (!emailFrom || !primaryApiKey) throw new Error('Configuração de entrega de e-mail ausente ou incoerente.');
  return { emailFrom, primaryApiKey, fallbackApiKey: env.BURGOWEB_EMAIL_FALLBACK_API_KEY || undefined };
}
export function loadInvitationConfig(env:NodeJS.ProcessEnv=process.env):InvitationConfig{const baseUrl=env.BURGOWEB_INVITATION_BASE_URL??env.BURGOWEB_VERIFICATION_BASE_URL,currentKeyVersion=env.BURGOWEB_INVITATION_TOKEN_KEY_VERSION,currentKey=env.BURGOWEB_INVITATION_TOKEN_KEY;if(!baseUrl||!currentKeyVersion||!currentKey||currentKey.length<32)throw new Error('Configuração de Convites ausente ou incoerente.');let parsed:URL;try{parsed=new URL(baseUrl);}catch{throw new Error('Configuração de Convites: URL inválida.');}const local=env.BURGOWEB_ALLOW_INSECURE_LOCAL_ORIGIN==='true'&&parsed.protocol==='http:'&&['localhost','127.0.0.1'].includes(parsed.hostname);if((!local&&parsed.protocol!=='https:')||parsed.username||parsed.password||parsed.pathname!=='/'||parsed.search||parsed.hash)throw new Error('Configuração de Convites: URL pública deve ser uma origem HTTPS.');return{baseUrl:parsed.origin,tokenTtlSeconds:boundedPositiveInteger(env.BURGOWEB_INVITATION_TOKEN_TTL_SECONDS,86400,'INVITATION_TOKEN_TTL_SECONDS',604800),leaseSeconds:positiveInteger(env.BURGOWEB_EMAIL_LEASE_SECONDS,30,'EMAIL_LEASE_SECONDS'),maxAttempts:positiveInteger(env.BURGOWEB_EMAIL_MAX_ATTEMPTS,5,'EMAIL_MAX_ATTEMPTS'),mutationLimit:boundedPositiveInteger(env.BURGOWEB_INVITATION_MUTATION_LIMIT,20,'INVITATION_MUTATION_LIMIT',1000),acceptanceLimit:boundedPositiveInteger(env.BURGOWEB_INVITATION_ACCEPTANCE_LIMIT,10,'INVITATION_ACCEPTANCE_LIMIT',1000),rateWindowSeconds:boundedPositiveInteger(env.BURGOWEB_INVITATION_RATE_WINDOW_SECONDS,300,'INVITATION_RATE_WINDOW_SECONDS',86400),currentKeyVersion,tokenKeys:{[currentKeyVersion]:currentKey}};}

export function loadSecurityConfig(env: NodeJS.ProcessEnv = process.env): SecurityConfig {
  const pepper = env.BURGOWEB_PASSWORD_PEPPER;
  const pepperVersion = env.BURGOWEB_PASSWORD_PEPPER_VERSION;
  if (!pepper || pepper.length < 32 || !pepperVersion?.trim()) throw new Error('Configuração de credencial ausente ou incoerente.');
  const previousPeppers: Record<string, string> = {};
  const previousVersion = env.BURGOWEB_PASSWORD_PREVIOUS_PEPPER_VERSION; const previous = env.BURGOWEB_PASSWORD_PREVIOUS_PEPPER;
  if (Boolean(previousVersion) !== Boolean(previous)) throw new Error('ConfiguraÃ§Ã£o de credencial: rotaÃ§Ã£o parcial.');
  if (previousVersion && previous) { if (previous.length < 32 || previousVersion === pepperVersion) throw new Error('ConfiguraÃ§Ã£o de credencial: pepper anterior incoerente.'); previousPeppers[previousVersion] = previous; }
  return { pepper, pepperVersion, previousPeppers };
}

export function loadSessionConfig(env: NodeJS.ProcessEnv = process.env): SessionConfig {
  const secret = env.BURGOWEB_SESSION_SECRET; const rateLimitKey = env.BURGOWEB_RATE_LIMIT_KEY;
  if (!secret || secret.length < 32 || !rateLimitKey || rateLimitKey.length < 32) throw new Error('ConfiguraÃ§Ã£o de sessÃ£o ausente ou incoerente.');
  const absoluteTtlSeconds = boundedPositiveInteger(env.BURGOWEB_SESSION_ABSOLUTE_TTL_SECONDS, 28_800, 'SESSION_ABSOLUTE_TTL_SECONDS', 31_536_000);
  const idleTtlSeconds = boundedPositiveInteger(env.BURGOWEB_SESSION_IDLE_TTL_SECONDS, 1_800, 'SESSION_IDLE_TTL_SECONDS', 86_400);
  const touchIntervalSeconds = boundedPositiveInteger(env.BURGOWEB_SESSION_TOUCH_INTERVAL_SECONDS, 300, 'SESSION_TOUCH_INTERVAL_SECONDS', 3_600);
  if (idleTtlSeconds > absoluteTtlSeconds || touchIntervalSeconds >= idleTtlSeconds) throw new Error('ConfiguraÃ§Ã£o de sessÃ£o: TTLs incoerentes.');
  return { secret, absoluteTtlSeconds, idleTtlSeconds, touchIntervalSeconds, rateLimitKey };
}

export function loadRecoveryConfig(env: NodeJS.ProcessEnv = process.env): RecoveryConfig {
  const baseUrl=env.BURGOWEB_RECOVERY_BASE_URL??env.BURGOWEB_VERIFICATION_BASE_URL;const currentKeyVersion=env.BURGOWEB_RECOVERY_TOKEN_KEY_VERSION;const currentKey=env.BURGOWEB_RECOVERY_TOKEN_KEY;
  if(!baseUrl||!currentKeyVersion||!currentKey||currentKey.length<32)throw new Error('Configuração de recuperação ausente ou incoerente.');let parsed:URL;try{parsed=new URL(baseUrl);}catch{throw new Error('Configuração de recuperação: URL inválida.');}
  const local=env.BURGOWEB_ALLOW_INSECURE_LOCAL_ORIGIN==='true'&&parsed.protocol==='http:'&&['localhost','127.0.0.1'].includes(parsed.hostname);if((!local&&parsed.protocol!=='https:')||parsed.username||parsed.password||parsed.pathname!=='/'||parsed.search||parsed.hash)throw new Error('Configuração de recuperação: URL pública deve ser uma origem HTTPS.');
  const tokenKeys:Record<string,string>={[currentKeyVersion]:currentKey};const previousVersion=env.BURGOWEB_RECOVERY_PREVIOUS_TOKEN_KEY_VERSION;const previous=env.BURGOWEB_RECOVERY_PREVIOUS_TOKEN_KEY;if(Boolean(previousVersion)!==Boolean(previous))throw new Error('Configuração de recuperação: rotação parcial.');if(previousVersion&&previous){if(previous.length<32||previousVersion===currentKeyVersion)throw new Error('Configuração de recuperação: chave anterior incoerente.');tokenKeys[previousVersion]=previous;}
  return{baseUrl:parsed.origin,tokenTtlSeconds:boundedPositiveInteger(env.BURGOWEB_RECOVERY_TOKEN_TTL_SECONDS,900,'RECOVERY_TOKEN_TTL_SECONDS',86400),currentKeyVersion,tokenKeys,
    requestLimit:boundedPositiveInteger(env.BURGOWEB_RECOVERY_REQUEST_LIMIT,5,'RECOVERY_REQUEST_LIMIT',100),requestOriginLimit:boundedPositiveInteger(env.BURGOWEB_RECOVERY_REQUEST_ORIGIN_LIMIT,50,'RECOVERY_REQUEST_ORIGIN_LIMIT',1000),requestWindowSeconds:boundedPositiveInteger(env.BURGOWEB_RECOVERY_REQUEST_WINDOW_SECONDS,300,'RECOVERY_REQUEST_WINDOW_SECONDS',86400),
    confirmationLimit:boundedPositiveInteger(env.BURGOWEB_RECOVERY_CONFIRMATION_LIMIT,10,'RECOVERY_CONFIRMATION_LIMIT',100),confirmationOriginLimit:boundedPositiveInteger(env.BURGOWEB_RECOVERY_CONFIRMATION_ORIGIN_LIMIT,100,'RECOVERY_CONFIRMATION_ORIGIN_LIMIT',1000),confirmationWindowSeconds:boundedPositiveInteger(env.BURGOWEB_RECOVERY_CONFIRMATION_WINDOW_SECONDS,300,'RECOVERY_CONFIRMATION_WINDOW_SECONDS',86400)};
}

export function loadRuntimeConfig(env: NodeJS.ProcessEnv = process.env): RuntimeConfig {
  const databaseUrl = env.BURGOWEB_DATABASE_URL;
  if (!databaseUrl) throw new Error('Configuração runtime ausente: BURGOWEB_DATABASE_URL.');
  let parsed: URL;
  try { parsed = new URL(databaseUrl); } catch { throw new Error('Configuração runtime incoerente: BURGOWEB_DATABASE_URL.'); }
  if (!['postgres:', 'postgresql:'].includes(parsed.protocol)) throw new Error('Configuração runtime incoerente: banco deve ser PostgreSQL.');
  const port = Number(env.BURGOWEB_API_PORT ?? '3001');
  if (!Number.isInteger(port) || port < 1 || port > 65_535) throw new Error('Configuração runtime incoerente: BURGOWEB_API_PORT.');
  return { databaseUrl, host: env.BURGOWEB_API_HOST ?? '127.0.0.1', port, security: loadSecurityConfig(env), session: loadSessionConfig(env), verification: loadVerificationConfig(env), recovery: loadRecoveryConfig(env),invitation:loadInvitationConfig(env) };
}
