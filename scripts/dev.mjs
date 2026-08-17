import { randomBytes } from 'node:crypto';
import { spawn, spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { tmpdir } from 'node:os';

const root = resolve('.');
const databasePassword = randomBytes(24).toString('base64url');
const passwordPepper = randomBytes(32).toString('base64url');
const verificationTokenKey = randomBytes(32).toString('base64url');
const recoveryTokenKey = randomBytes(32).toString('base64url');
const invitationTokenKey = randomBytes(32).toString('base64url');
const composeFile = `${root.replace(/^([A-Za-z]):/, (_, drive) => `/mnt/${drive.toLowerCase()}`).replaceAll('\\', '/')}/infra/compose/compose.dev.yml`;
const composeEnv = {
  ...process.env,
  BURGOWEB_DEV_DB_PASSWORD: databasePassword,
  WSLENV: [process.env.WSLENV, 'BURGOWEB_DEV_DB_PASSWORD'].filter(Boolean).join(':'),
};
const children = new Set();
let stopping = false;

function run(command, args, options = {}) {
  return new Promise((complete, reject) => {
    const child = spawn(command, args, { cwd: root, stdio: 'inherit', ...options });
    child.once('error', reject);
    child.once('exit', (code) => code === 0 ? complete() : reject(new Error(`${command} encerrou com código ${code ?? 'desconhecido'}.`)));
  });
}

async function waitFor(url, label) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // Serviço ainda iniciando.
    }
    await new Promise((resolveWait) => setTimeout(resolveWait, 500));
  }
  throw new Error(`${label} não ficou disponível em 30 segundos.`);
}

async function stop(exitCode = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) {
    if (child.exitCode !== null || !child.pid) continue;
    if (process.platform === 'win32') spawnSync('taskkill.exe', ['/PID', String(child.pid), '/T', '/F'], { stdio: 'ignore', windowsHide: true });
    else child.kill('SIGTERM');
  }
  try {
    await run('wsl.exe', ['-d', 'Ubuntu', '--exec', 'docker', 'compose', '-f', composeFile, 'down'], { env: composeEnv });
  } catch (error) {
    console.error(`Não foi possível encerrar o PostgreSQL de desenvolvimento: ${error.message}`);
    exitCode = 1;
  }
  process.exit(exitCode);
}

process.once('SIGINT', () => void stop(0));
process.once('SIGTERM', () => void stop(0));

try {
  console.log('Iniciando PostgreSQL 18 no Docker/WSL...');
  try {
    await run('wsl.exe', ['-d', 'Ubuntu', '--exec', 'docker', 'compose', '-f', composeFile, 'down', '--remove-orphans'], { env: composeEnv });
  } catch {
    // Ausência de ambiente anterior é esperada.
  }
  await run('wsl.exe', ['-d', 'Ubuntu', '--exec', 'docker', 'compose', '-f', composeFile, 'up', '-d', '--wait'], { env: composeEnv });

  const api = spawn(process.execPath, [resolve('apps/api/node_modules/tsx/dist/cli.mjs'), '--tsconfig', 'apps/api/tsconfig.json', 'apps/api/src/index.ts'], {
    cwd: root,
    stdio: 'inherit',
    env: {
      ...process.env,
      BURGOWEB_DATABASE_URL: `postgresql://burgoweb:${databasePassword}@127.0.0.1:55432/burgoweb_dev`,
      BURGOWEB_PASSWORD_PEPPER: passwordPepper,
      BURGOWEB_PASSWORD_PEPPER_VERSION: 'development-ephemeral-v1',
      BURGOWEB_API_HOST: '127.0.0.1',
      BURGOWEB_API_PORT: '3001',
      BURGOWEB_VERIFICATION_BASE_URL: 'http://localhost:3000',
      BURGOWEB_ALLOW_INSECURE_LOCAL_ORIGIN: 'true',
      BURGOWEB_VERIFICATION_TOKEN_KEY: verificationTokenKey,
      BURGOWEB_VERIFICATION_TOKEN_KEY_VERSION: 'development-ephemeral-v1',
      BURGOWEB_RECOVERY_TOKEN_KEY: recoveryTokenKey,
      BURGOWEB_RECOVERY_TOKEN_KEY_VERSION: 'development-ephemeral-v1',
      BURGOWEB_INVITATION_TOKEN_KEY: invitationTokenKey,
      BURGOWEB_INVITATION_TOKEN_KEY_VERSION: 'development-ephemeral-v1',
    },
  });
  const web = spawn(process.execPath, [resolve('node_modules/vite/bin/vite.js'), 'apps/web', '--port', '3000', '--strictPort'], {
    cwd: root,
    stdio: 'inherit',
    env: { ...process.env, BURGOWEB_VITE_CACHE_DIR: resolve(tmpdir(), 'burgoweb-vite-cache') },
  });
  const worker = spawn(process.execPath, [resolve('apps/worker/node_modules/tsx/dist/cli.mjs'), '--tsconfig', 'apps/worker/tsconfig.json', 'apps/worker/src/index.ts'], {
    cwd: root,
    stdio: 'inherit',
    env: { ...process.env, BURGOWEB_DATABASE_URL: `postgresql://burgoweb:${databasePassword}@127.0.0.1:55432/burgoweb_dev`, BURGOWEB_VERIFICATION_BASE_URL: 'http://localhost:3000', BURGOWEB_ALLOW_INSECURE_LOCAL_ORIGIN: 'true', BURGOWEB_VERIFICATION_TOKEN_KEY: verificationTokenKey, BURGOWEB_VERIFICATION_TOKEN_KEY_VERSION: 'development-ephemeral-v1', BURGOWEB_RECOVERY_TOKEN_KEY: recoveryTokenKey, BURGOWEB_RECOVERY_TOKEN_KEY_VERSION: 'development-ephemeral-v1', BURGOWEB_INVITATION_TOKEN_KEY: invitationTokenKey, BURGOWEB_INVITATION_TOKEN_KEY_VERSION: 'development-ephemeral-v1', BURGOWEB_EMAIL_TRANSPORT: 'mailpit', BURGOWEB_MAILPIT_SEND_URL: 'http://127.0.0.1:8025/api/v1/send', BURGOWEB_EMAIL_FROM: 'nao-responda@burgoweb.local' },
  });
  children.add(api); children.add(web); children.add(worker);
  for (const child of children) {
    child.once('error', (error) => { console.error(error); void stop(1); });
    child.once('exit', (code) => { if (!stopping) void stop(code ?? 1); });
  }
  await Promise.all([
    waitFor('http://127.0.0.1:3001/api/v1/openapi.json', 'API'),
    waitFor('http://localhost:3000/comecar', 'Frontend'),
    waitFor('http://127.0.0.1:8025/api/v1/info', 'Mailpit'),
  ]);
  console.log('Burgoweb pronto: http://localhost:3000/comecar');
  console.log('Caixa de e-mails local: http://localhost:8025');
} catch (error) {
  console.error(`Falha ao iniciar o ambiente: ${error.message}`);
  await stop(1);
}
