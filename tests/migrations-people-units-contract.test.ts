import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

describe('migration tenant 004', () => {
  it('é aditiva, idempotente e preserva identidade institucional', async () => {
    const sql = await readFile('migrations/tenant/004_people_units_relationships.sql', 'utf8');
    expect(sql).toContain('ALTER TABLE person ADD COLUMN IF NOT EXISTS public_id');
    expect(sql).toContain('ALTER TABLE person ALTER COLUMN public_id SET DEFAULT gen_random_uuid()');
    expect(sql).toContain('ALTER TABLE person ALTER COLUMN public_id SET NOT NULL');
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS unit');
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS person_unit_relationship');
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS institutional_idempotency');
    expect(sql).toContain('CREATE UNIQUE INDEX IF NOT EXISTS unit_identifier_normalized_unique');
    expect(sql).toContain('CREATE UNIQUE INDEX IF NOT EXISTS person_email_normalized_unique');
    expect(sql).toContain("CHECK(state IN('pending_verification','active','ended'))");
    expect(sql).toContain("people-units-relationships.manage");
    expect(sql).toContain('INSERT INTO schema_version(version, applied_at) VALUES (4');
    expect(sql).not.toMatch(/DROP TABLE|TRUNCATE|DELETE FROM person/i);
  });

  it('todos os gates de compatibilidade exigem schema 004', async () => {
    for (const path of [
      'packages/adapters/src/db/postgres-tenant-migrator.ts',
      'packages/adapters/src/db/postgres-provisioning-repository.ts',
      'packages/adapters/src/db/postgres-identity-repository.ts',
      'packages/adapters/src/db/postgres-verification-repository.ts',
    ]) {
      const source = await readFile(path, 'utf8');
      expect(source, path).not.toMatch(/migration_version\s*(?:=|!==)\s*3|migration_version=3|version=3/);
    }
  });

  it('declara payloads de alteração e encerramento no OpenAPI', async () => {
    const source = await readFile('apps/api/src/openapi.ts', 'utf8');
    for (const schema of ['UpdatePersonInput','UpdateUnitInput','UpdateRelationshipInput','EndRelationshipInput']) {
      expect(source).toContain(`$ref:'#/components/schemas/${schema}'`);
      expect(source).toContain(`${schema}:{type:'object',additionalProperties:false`);
    }
  });
});
