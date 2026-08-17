import { readFile } from 'node:fs/promises';
import { describe, expect, test } from 'vitest';

describe('Story 1.10 - contrato da migration de Responsáveis Financeiros', () => {
  test('é aditiva, sem suspensão, versionada e persiste efeitos atômicos', async () => {
    const sql = await readFile('migrations/tenant/008_financial_responsibles.sql', 'utf8');
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS financial_responsible_assignment');
    expect(sql).toContain("state IN('scheduled','active','expired','revoked')");
    expect(sql).not.toContain("'suspended'");
    expect(sql).toContain('financial_responsible_active_unique');
    expect(sql).toContain('financial_responsible_transition');
    expect(sql).toContain('financial_responsible_projection');
    expect(sql).toContain('financial_responsible_notification_outbox');
    expect(sql).toContain('source_relationship_id uuid NOT NULL REFERENCES person_unit_relationship(id)');
    expect(sql).toContain('INSERT INTO schema_version(version, applied_at) VALUES (8');
  });
});
