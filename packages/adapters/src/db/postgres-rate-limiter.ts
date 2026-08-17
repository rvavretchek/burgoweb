import { createHmac } from 'node:crypto';
import type { Pool } from 'pg';
import type { PublicMutationRateLimiter } from '@burgoweb/application';

export class PostgresRateLimiter implements PublicMutationRateLimiter {
  constructor(private readonly pool: Pool, private readonly key = 'test-only-rate-limit-key') {}
  async consume(operation: string, signals: string[], now: Date, limit: number, windowSeconds: number): Promise<boolean> {
    const windowMs = windowSeconds * 1000; const window = new Date(Math.floor(now.getTime() / windowMs) * windowMs); const expires = new Date(window.getTime() + windowMs * 2);
    const subjects=signals.map(value=>createHmac('sha256',this.key).update(value.trim().toLowerCase()).digest('hex'));
    const client=await this.pool.connect();try{await client.query('BEGIN');await client.query(`SELECT pg_advisory_xact_lock(hashtext($1))`,[`${operation}:${subjects[0]??'anonymous'}`]);const counts=[];for(const[index,subject]of subjects.entries())counts.push(await client.query(`INSERT INTO burgoweb_global.rate_limit_buckets(operation,subject_hash,window_started_at,expires_at,count) VALUES ($1,$2,$3,$4,1) ON CONFLICT(operation,subject_hash,window_started_at) DO UPDATE SET count=burgoweb_global.rate_limit_buckets.count+1,expires_at=GREATEST(burgoweb_global.rate_limit_buckets.expires_at,EXCLUDED.expires_at) RETURNING count`,[`${operation}.${index}`,subject,window,expires]));if(Math.random()<0.01)await client.query(`DELETE FROM burgoweb_global.rate_limit_buckets WHERE ctid IN (SELECT ctid FROM burgoweb_global.rate_limit_buckets WHERE expires_at<$1 LIMIT 100)`,[now]);await client.query('COMMIT');return counts.every(result=>result.rows[0].count<=limit);}catch(error){await client.query('ROLLBACK');throw error;}finally{client.release();}
  }
}
