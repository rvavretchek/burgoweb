import { spawnSync } from 'node:child_process';
import { rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

const fixture = resolve('apps/web/src/.boundary-review-fixture.ts');

function check(source: string) {
  writeFileSync(fixture, source);
  return spawnSync(process.execPath, ['scripts/check-boundaries.mjs'], { encoding: 'utf8' });
}

describe('guardrail de fronteiras', () => {
  afterEach(() => rmSync(fixture, { force: true }));

  it('rejeita import relativo de backend', () => {
    const result = check("import '../../api/src/index';");
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('../../api/src/index');
  }, 15_000);

  it('rejeita alias de pacote interno de aplicação', () => {
    const result = check("import '@burgoweb/application';");
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('@burgoweb/application');
  }, 15_000);
});
