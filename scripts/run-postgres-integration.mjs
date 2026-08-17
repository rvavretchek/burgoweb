import { spawn } from 'node:child_process';

const root = process.cwd();
const run = (command, args, env = process.env) => new Promise((resolve, reject) => {
  const child = spawn(command, args, { cwd: root, env, stdio: 'inherit', shell: false });
  child.once('error', reject);
  child.once('exit', code => resolve(code ?? 1));
});

let code;
if (process.env.BURGOWEB_INTEGRATION === '1') {
  code = await run(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'test:integration:raw']);
} else if (process.platform === 'win32') {
  console.log('PostgreSQL: usando a instância Windows isolada configurada pelo projeto.');
  code = await run('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', 'scripts/run-postgres-integration.ps1']);
} else {
  console.log('PostgreSQL: usando Testcontainers; defina BURGOWEB_INTEGRATION_DATABASE_URL para um servidor externo.');
  code = await run('npm', ['run', 'test:integration:raw'], { ...process.env, BURGOWEB_INTEGRATION: '1' });
}

process.exit(code);
