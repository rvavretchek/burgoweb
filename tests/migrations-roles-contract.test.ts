import { readFile } from 'node:fs/promises';
import { describe, expect, test } from 'vitest';

describe('Story 1.8 - contrato da migration de Papéis', () => {
  test('é aditiva, temporal, versionada e persiste efeitos atômicos', async () => {
    const sql = await readFile('migrations/tenant/006_role_lifecycle.sql', 'utf8');
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS role_assignment');
    expect(sql).toContain('valid_from timestamptz');
    expect(sql).toContain("'scheduled','active','suspended','expired','revoked'");
    expect(sql).toContain('role_assignment_transition');
    expect(sql).toContain('role_authorization_projection');
    expect(sql).toContain('role_notification_outbox');
    expect(sql).toContain('INSERT INTO schema_version(version, applied_at) VALUES (6');
  });
});
