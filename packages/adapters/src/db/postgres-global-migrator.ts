import { readdir, readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import type { Pool } from 'pg';

const TRY_LOCK = `SELECT pg_try_advisory_lock(hashtext('burgoweb-global-migrations')) AS locked`;
const UNLOCK = `SELECT pg_advisory_unlock(hashtext('burgoweb-global-migrations'))`;

export class PostgresGlobalMigrator {
  constructor(private readonly pool: Pool, private readonly migrationPath = 'migrations/global') {}
  async migrate(): Promise<void> {
    const client = await this.pool.connect();
    let locked = false;
    try {
      const deadline = Date.now() + 30_000;
      while (!locked) {
        locked = (await client.query(TRY_LOCK)).rows[0].locked;
        if (locked) break;
        if (Date.now() > deadline) throw new Error('Não foi possível obter o lock de migration a tempo.');
        await new Promise(resolve => setTimeout(resolve, 250));
      }
      const paths = extname(this.migrationPath) === '.sql'
        ? [this.migrationPath]
        : (await readdir(this.migrationPath)).filter(name => /^\d+_.+\.sql$/.test(name)).sort().map(name => join(this.migrationPath, name));
      for (const path of paths) await client.query(await readFile(path, 'utf8'));
    } finally {
      if (!locked) { client.release(); }
      else {
        try { await client.query(UNLOCK); client.release(); }
        // Unlock failed: the session may still hold the lock. Destroy this pooled
        // connection instead of returning it, so no other caller inherits a stuck lock.
        catch (error) { client.release(error as Error); }
      }
    }
  }
}
