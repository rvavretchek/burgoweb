import { describe, expect, it } from 'vitest';
import { apiEntrypoint } from '../apps/api/src/index';
import { workerEntrypoint } from '../apps/worker/src/index';

describe('entrypoints independentes', () => {
  it('mantém o shell da API no namespace versionado', () => {
    expect(apiEntrypoint).toEqual({ name: 'burgoweb-api', basePath: '/api/v1' });
  });

  it('habilita o job de verificação no worker independente', () => {
    expect(workerEntrypoint.jobsEnabled).toBe(true);
  });
});
