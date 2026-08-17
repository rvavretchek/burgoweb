import { readFile } from 'node:fs/promises';
import { describe, expect, test } from 'vitest';

describe('Story 1.9 - contrato da migration de capacidades delegadas', () => {
  test('é aditiva, sem suspensão, versionada e persiste efeitos atômicos', async () => {
    const sql = await readFile('migrations/tenant/007_capability_delegation.sql', 'utf8');
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS capability_grant');
    expect(sql).toContain("state IN('scheduled','active','expired','revoked')");
    expect(sql).not.toContain("'suspended'");
    expect(sql).toContain('capability_grant_active_unique');
    expect(sql).toContain('capability_grant_transition');
    expect(sql).toContain('capability_grant_projection');
    expect(sql).toContain('capability_notification_outbox');
    expect(sql).toContain('INSERT INTO schema_version(version, applied_at) VALUES (7');
  });
});
