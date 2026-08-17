import { readFileSync } from 'node:fs';
import { access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(import.meta.dirname, '..');

describe('greenfield monorepo boundaries', () => {
  it.each([
    'apps/web',
    'apps/api',
    'apps/worker',
    'packages/application',
    'packages/adapters',
    'packages/api-client',
    'packages/config',
    'packages/test-support',
    'migrations/global',
    'migrations/tenant',
    'infra/compose',
    'infra/salt',
    'infra/observability',
  ])('contains the required boundary %s', async (path) => {
    await expect(access(resolve(root, path))).resolves.toBeUndefined();
  });

  it.each(['application', 'adapters', 'api-client', 'config', 'test-support'])(
    'registers @burgoweb/%s as an actual workspace package',
    (name) => {
      const manifest = JSON.parse(readFileSync(resolve(root, `packages/${name}/package.json`), 'utf8'));
      expect(manifest.name).toBe(`@burgoweb/${name}`);
      expect(manifest.exports).toBe('./src/index.ts');
    },
  );

  it('pins the validated TanStack Start and Router pair', () => {
    const packageJson = JSON.parse(readFileSync(resolve(root, 'apps/web/package.json'), 'utf8'));
    expect(packageJson.dependencies['@tanstack/react-start']).toBe('1.168.30');
    expect(packageJson.dependencies['@tanstack/react-router']).toBe('1.170.18');
  });
});
