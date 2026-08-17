import { randomUUID } from 'node:crypto';
import type { Pool } from 'pg';
import type { ClaimedInvitationEmail,EmailDeliveryResult,InvitationOutboxRepository } from '@burgoweb/application';

export class PostgresInvitationOutbox implements InvitationOutboxRepository {
  constructor(private readonly pool:Pool) {}

  async claim(owner:string,now:Date,leaseSeconds:number) {
    const client=await this.pool.connect();
    try {
      await client.query('BEGIN');
      const claimed=await client.query(`WITH candidate AS(
        SELECT o.id,o.attempt_count,o.status
        FROM burgoweb_global.invitation_outbox o
        JOIN burgoweb_global.invitations i ON i.id=o.invitation_id
        WHERE ((o.status='pending' AND o.available_at<=$1) OR (o.status='leased' AND o.leased_until<$1))
          AND i.state='pending' AND i.expires_at>$1
        ORDER BY o.available_at,o.created_at
        FOR UPDATE OF o SKIP LOCKED LIMIT 1
      ), closed AS (
        UPDATE burgoweb_global.invitation_delivery_attempts a
        SET state='failed',error_code='lease-expired',finished_at=$1
        FROM candidate
        WHERE candidate.status='leased' AND a.outbox_id=candidate.id
          AND a.attempt_number=candidate.attempt_count AND a.state='started'
      ), leased AS (
        UPDATE burgoweb_global.invitation_outbox o
        SET status='leased',lease_owner=$2,leased_until=$1+($3*interval '1 second'),
          attempt_count=attempt_count+1,updated_at=$1
        FROM candidate WHERE o.id=candidate.id RETURNING o.*
      ) SELECT l.id outbox_id,l.attempt_count,l.lease_owner,i.*
        FROM leased l JOIN burgoweb_global.invitations i ON i.id=l.invitation_id`,[now,owner,leaseSeconds]);
      if(!claimed.rows[0]) { await client.query('COMMIT'); return undefined; }
      const row=claimed.rows[0];
      await client.query(`INSERT INTO burgoweb_global.invitation_delivery_attempts(id,outbox_id,attempt_number,state,started_at) VALUES($1,$2,$3,'started',$4)`,[randomUUID(),row.outbox_id,row.attempt_count,now]);
      await client.query('COMMIT');
      return {invitationId:row.id,outboxId:row.outbox_id,tenantId:row.tenant_id,personId:row.person_id,relationshipId:row.relationship_id,email:row.recipient_email_normalized,issuedAt:row.created_at,keyVersion:row.key_version,purpose:'invitation' as const,tokenHash:row.invitation_token_hash.trim(),expiresAt:row.expires_at,to:row.recipient_email_normalized,role:row.role_kind,attemptNumber:row.attempt_count,leaseOwner:row.lease_owner};
    } catch(error) { await client.query('ROLLBACK'); throw error; }
    finally { client.release(); }
  }

  async renew(item:ClaimedInvitationEmail,now:Date,leaseSeconds:number) {
    return Boolean((await this.pool.query(`UPDATE burgoweb_global.invitation_outbox SET leased_until=$3+($4*interval '1 second'),updated_at=$3 WHERE id=$1 AND lease_owner=$2 AND status='leased'`,[item.outboxId,item.leaseOwner,now,leaseSeconds])).rowCount);
  }

  async finish(item:ClaimedInvitationEmail,result:EmailDeliveryResult,now:Date,next?:Date) {
    const state=result.kind==='accepted'?'accepted':result.kind==='ambiguous'?'ambiguous':'failed';
    const status=result.kind==='accepted'?'accepted':result.kind==='ambiguous'?'ambiguous':next?'pending':'dead';
    const reference=result.kind==='accepted'?result.providerReference:null;
    const code=result.kind==='accepted'?null:result.code.slice(0,80);
    const client=await this.pool.connect();
    try {
      await client.query('BEGIN');
      const changed=await client.query(`UPDATE burgoweb_global.invitation_outbox
        SET status=CASE WHEN status='dead' THEN 'dead' ELSE $4 END,
          available_at=CASE WHEN status='dead' THEN available_at ELSE COALESCE($5,available_at) END,
          leased_until=NULL,lease_owner=NULL,
          provider_reference=CASE WHEN status='dead' THEN provider_reference ELSE $6 END,
          last_error_code=CASE WHEN status='dead' THEN last_error_code ELSE $7 END,updated_at=$3
        WHERE id=$1 AND lease_owner=$2 AND status IN('leased','dead')`,[item.outboxId,item.leaseOwner,now,status,next,reference,code]);
      if(changed.rowCount) await client.query(`UPDATE burgoweb_global.invitation_delivery_attempts SET state=$4,provider_reference=$5,error_code=$6,finished_at=$3 WHERE outbox_id=$1 AND attempt_number=$2 AND state='started'`,[item.outboxId,item.attemptNumber,now,state,reference,code]);
      await client.query('COMMIT');
    } catch(error) { await client.query('ROLLBACK'); throw error; }
    finally { client.release(); }
  }
}
