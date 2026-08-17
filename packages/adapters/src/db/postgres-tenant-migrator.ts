import { readdir, readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import type { Pool } from 'pg';
import type { TenantSeed } from '@burgoweb/application';

const SAFE_SCHEMA = /^tenant_[a-f0-9]{32}$/;

export class PostgresTenantMigrator {
  constructor(private readonly pool: Pool, private readonly migrationPath = 'migrations/tenant', private readonly failpoint?: (stage: string) => void) {}

  private async migrationFiles(): Promise<string[]> {
    if (extname(this.migrationPath) === '.sql') return [this.migrationPath];
    return (await readdir(this.migrationPath)).filter(name => /^\d+_.+\.sql$/.test(name)).sort().map(name => join(this.migrationPath, name));
  }

  private migrationVersion(path: string): number {
    const match = /(?:^|[\\/])(\d+)_/.exec(path);
    if (!match) throw new Error(`Migration tenant sem versão: ${path}`);
    return Number(match[1]);
  }

  async createAndMigrate(schemaName: string, seed?: TenantSeed): Promise<void> {
    if (!SAFE_SCHEMA.test(schemaName)) throw new Error('Nome interno de schema inválido.');
    const migrations = await this.migrationFiles();
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(`CREATE SCHEMA IF NOT EXISTS ${schemaName}`);
      this.failpoint?.('tenant.after-schema');
      await client.query(`SET LOCAL search_path TO ${schemaName}, pg_catalog`);
      const hasLedger = Boolean((await client.query(`SELECT to_regclass('schema_version') AS relation`)).rows[0]?.relation);
      const currentVersion = hasLedger ? Number((await client.query('SELECT COALESCE(MAX(version),0) AS version FROM schema_version')).rows[0].version) : 0;
      for (const path of migrations) if (this.migrationVersion(path) > currentVersion) await client.query(await readFile(path, 'utf8'));
      this.failpoint?.('tenant.after-migration');
      if (seed) {
        await client.query('INSERT INTO person(id, full_name, created_at) VALUES ($1,$2,$3) ON CONFLICT (id) DO NOTHING', [seed.personId, seed.fullName, seed.acceptedAt]);
        const upgraded = Boolean((await client.query(`SELECT to_regclass('authority_assignment') AS relation`)).rows[0]?.relation);
        if (upgraded) {
          await client.query(`INSERT INTO authority_assignment(id,person_id,state,created_at,role_kind,capabilities) VALUES($1,$2,'pending_verification',$3,'syndic',ARRAY['dashboard.read','people-units-relationships.manage','invitations.manage']) ON CONFLICT(id) DO NOTHING`,[seed.authorityId,seed.personId,seed.acceptedAt]);
          const hasRoleLifecycle = Boolean((await client.query(`SELECT to_regclass('role_assignment') AS relation`)).rows[0]?.relation);
          if (hasRoleLifecycle) {
            await client.query(`INSERT INTO role_assignment(id,public_id,person_id,role_kind,scope_kind,valid_from,state,granted_by_person_id,created_at,updated_at) VALUES($1,$1,$2,'syndic','tenant',$3,'scheduled',$2,$3,$3) ON CONFLICT(id) DO NOTHING`,[seed.authorityId,seed.personId,seed.acceptedAt]);
            await client.query(`INSERT INTO role_authorization_projection(assignment_id,public_id,state,role_kind,scope_kind,valid_from,version) VALUES($1,$1,'scheduled','syndic','tenant',$2,1) ON CONFLICT(assignment_id) DO NOTHING`,[seed.authorityId,seed.acceptedAt]);
          }
        } else {
          await client.query(`INSERT INTO pending_authority(id,person_id,state,created_at) VALUES($1,$2,'pending_verification',$3) ON CONFLICT(id) DO NOTHING`,[seed.authorityId,seed.personId,seed.acceptedAt]);
        }
        this.failpoint?.('tenant.after-seed');
      }
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally { client.release(); }
  }

  async migrateRegisteredTenants(): Promise<void> { const migrations=await this.migrationFiles(); const latestVersion=Math.max(...migrations.map(path=>this.migrationVersion(path))); const tenants=await this.pool.query(`SELECT id,schema_name FROM burgoweb_global.tenant_registry WHERE state IN ('pending_verification','active') ORDER BY id`); for(const tenant of tenants.rows){await this.createAndMigrate(tenant.schema_name);await this.pool.query(`UPDATE burgoweb_global.tenant_registry SET migration_version=$2 WHERE id=$1`,[tenant.id,latestVersion]);} }

  async compensate(schemaName: string): Promise<boolean> {
    if (!SAFE_SCHEMA.test(schemaName)) throw new Error('Nome interno de schema inválido.');
    await this.pool.query(`DROP SCHEMA IF EXISTS ${schemaName} CASCADE`);
    return true;
  }

  async decoy(): Promise<void> {
    for (const path of await this.migrationFiles()) await readFile(path, 'utf8');
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('SELECT 1');
      await client.query('ROLLBACK');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally { client.release(); }
  }
}
