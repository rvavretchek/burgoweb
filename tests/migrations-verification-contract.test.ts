import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

describe('migrations incrementais da verificação', () => {
  it('modela token hash-only, outbox, tentativas, rate limit e estados ativos no global', async () => {
    const sql = await readFile('migrations/global/002_email_verification_activation.sql', 'utf8');
    expect(sql).toContain('verification_tokens');
    expect(sql).toContain('token_hash');
    expect(sql).not.toMatch(/raw_token|token_plain|token_cipher/i);
    expect(sql).toContain('email_outbox');
    expect(sql).toContain('email_delivery_attempts');
    expect(sql).toContain('rate_limit_buckets');
    expect(sql).toContain("'active'");
  });

  it('preserva e ativa a autoridade tenant com versão 2', async () => {
    const sql = await readFile('migrations/tenant/002_activate_initial_authority.sql', 'utf8');
    expect(sql).toContain('authority_assignment');
    expect(sql).toContain("'syndic'");
    expect(sql).toContain('VALUES (2');
  });

  it('migrators executam diretórios ordenados sob advisory lock', async () => {
    const global = await readFile('packages/adapters/src/db/postgres-global-migrator.ts', 'utf8');
    const tenant = await readFile('packages/adapters/src/db/postgres-tenant-migrator.ts', 'utf8');
    expect(global).toContain('advisory_lock');
    expect(global).toContain('readdir');
    expect(tenant).toContain('readdir');
  });
});

describe('migrations incrementais de sessão e autoridade', () => {
  it('modela sessões hash-only e projeção global correlacionada na versão 3', async () => {
    const sql = await readFile('migrations/global/003_sessions_memberships.sql', 'utf8');
    expect(sql).toContain('sessions'); expect(sql).toContain('token_hash'); expect(sql).toContain('csrf_hash');
    expect(sql).not.toMatch(/raw_token|plain_token/i); expect(sql).toContain('account_tenant_memberships');
    expect(sql).toContain('person_id'); expect(sql).toContain('authority_id');
  });
  it('torna capacidades e versão de autorização explícitas no tenant', async () => {
    const sql = await readFile('migrations/tenant/003_authorization_context.sql', 'utf8');
    expect(sql).toContain('capabilities'); expect(sql).toContain('authorization_version'); expect(sql).toContain('VALUES (3');
  });
});
