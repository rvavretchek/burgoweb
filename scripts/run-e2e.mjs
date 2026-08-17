import { spawn } from 'node:child_process';
import { delimiter, resolve } from 'node:path';

const cypressCli = resolve('node_modules/cypress/bin/cypress');
const nodeModules = resolve('node_modules');
const env = { ...process.env, NODE_PATH: [nodeModules, process.env.NODE_PATH].filter(Boolean).join(delimiter) };

delete env.ELECTRON_RUN_AS_NODE;

const serverEntry = resolve('scripts/serve-built.mjs');
const server = spawn(process.execPath, [serverEntry], {
  env: { ...env, PORT: '3000' },
  stdio: 'inherit',
});

async function waitForServer() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (server.exitCode !== null) throw new Error(`Servidor E2E encerrou com código ${server.exitCode}.`);
    try {
      const response = await fetch('http://localhost:3000/');
      if (response.ok) return;
    } catch {
      // O servidor ainda está iniciando.
    }
    await new Promise((resolveWait) => setTimeout(resolveWait, 500));
  }
  throw new Error('Servidor E2E não ficou disponível em 30 segundos.');
}

let result = 1;
try {
  await waitForServer();
  result = await new Promise((complete, reject) => {
    const child = spawn(process.execPath, [cypressCli, 'run', ...process.argv.slice(2)], {
      env,
      stdio: 'inherit',
    });
    child.once('error', reject);
    child.once('exit', (code) => complete(code ?? 1));
  });
} finally {
  if (server.exitCode === null) {
    server.kill();
    await new Promise((complete) => server.once('exit', complete));
  }
}

process.exit(result);
