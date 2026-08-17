import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { beforeAll, describe, expect, it } from 'vitest';

interface ServerEntry {
  fetch(request: Request): Promise<Response>;
}

async function loadServer(): Promise<ServerEntry> {
  const module = await import(pathToFileURL(resolve('apps/web/dist/server/server.js')).href);
  return module.default as ServerEntry;
}

describe('TanStack Start SSR smoke', () => {
  beforeAll(async () => {
    if (!process.env.npm_execpath) throw new Error('npm_execpath ausente para o smoke SSR.');
    execFileSync(process.execPath, [process.env.npm_execpath, 'run', 'build', '--workspace', '@burgoweb/web'], { stdio: 'pipe' });
  }, 120_000);

  it.each([
    ['/', 'Seu condomínio organizado e transparente'],
    ['/comecar', 'Crie sua Conta e seu Condomínio'],
    ['/verificar-email', 'Confirme o controle do seu e-mail'],
  ])('renderiza %s no servidor', async (path, expectedText) => {
    const server = await loadServer();
    const response = await server.fetch(new Request(`http://localhost${path}`));
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('text/html');
    expect(html).toContain('lang="pt-BR"');
    expect(html).toContain(expectedText);
    expect(html).toContain('<script');
  }, 30_000);
});
