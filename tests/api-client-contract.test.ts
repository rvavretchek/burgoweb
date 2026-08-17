import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

describe('cliente OpenAPI gerado', () => {
  it('permanece sincronizado com o contrato publicado', () => {
    const result = spawnSync(process.execPath, ['scripts/generate-api-client.mjs', '--check'], { encoding: 'utf8' });
    expect(result.status, result.stderr).toBe(0);
  });
});
