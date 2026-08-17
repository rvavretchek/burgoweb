CREATE TABLE IF NOT EXISTS burgoweb_global.invitations (
  id uuid PRIMARY KEY, public_id uuid NOT NULL UNIQUE,
  tenant_id uuid NOT NULL REFERENCES burgoweb_global.tenant_registry(id), tenant_schema_name text NOT NULL,
  person_id uuid NOT NULL, relationship_id uuid NOT NULL,
  issuer_account_id uuid NOT NULL REFERENCES burgoweb_global.accounts(id), issuer_membership_id uuid NOT NULL REFERENCES burgoweb_global.account_tenant_memberships(id),
  recipient_email_normalized text NOT NULL,
  role_kind text NOT NULL CHECK(role_kind IN('administrative-assistant','councilor','resident')),
  purpose text NOT NULL DEFAULT 'invitation' CHECK(purpose='invitation'), invitation_token_hash char(64) NOT NULL UNIQUE, key_version text NOT NULL,
  state text NOT NULL DEFAULT 'pending' CHECK(state IN('pending','accepted','cancelled','expired','superseded')),
  expires_at timestamptz NOT NULL, accepted_at timestamptz, accepted_account_id uuid REFERENCES burgoweb_global.accounts(id), superseded_by uuid REFERENCES burgoweb_global.invitations(id),
  version bigint NOT NULL DEFAULT 1 CHECK(version>0), created_at timestamptz NOT NULL, updated_at timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS invitation_tenant_created_idx ON burgoweb_global.invitations(tenant_id,created_at,id);
CREATE UNIQUE INDEX IF NOT EXISTS invitation_pending_target_unique ON burgoweb_global.invitations(tenant_id,person_id,relationship_id,role_kind) WHERE state='pending';
CREATE UNIQUE INDEX IF NOT EXISTS memberships_one_active_person_tenant_idx ON burgoweb_global.account_tenant_memberships(tenant_id,person_id) WHERE state='active';
CREATE TABLE IF NOT EXISTS burgoweb_global.invitation_outbox (id uuid PRIMARY KEY,invitation_id uuid NOT NULL REFERENCES burgoweb_global.invitations(id),status text NOT NULL DEFAULT 'pending' CHECK(status IN('pending','leased','accepted','dead','ambiguous')),available_at timestamptz NOT NULL,leased_until timestamptz,lease_owner text,attempt_count integer NOT NULL DEFAULT 0,provider_reference text,last_error_code text,created_at timestamptz NOT NULL,updated_at timestamptz NOT NULL);
CREATE INDEX IF NOT EXISTS invitation_outbox_claim_idx ON burgoweb_global.invitation_outbox(status,available_at,created_at);
CREATE TABLE IF NOT EXISTS burgoweb_global.invitation_delivery_attempts(id uuid PRIMARY KEY,outbox_id uuid NOT NULL REFERENCES burgoweb_global.invitation_outbox(id),attempt_number integer NOT NULL,state text NOT NULL CHECK(state IN('started','accepted','failed','ambiguous')),provider_reference text,error_code text,started_at timestamptz NOT NULL,finished_at timestamptz,UNIQUE(outbox_id,attempt_number));
CREATE TABLE IF NOT EXISTS burgoweb_global.invitation_idempotency(account_id uuid NOT NULL,tenant_id uuid NOT NULL,operation text NOT NULL,key_hash char(64) NOT NULL,request_hash char(64) NOT NULL,response_body jsonb,created_at timestamptz NOT NULL,expires_at timestamptz NOT NULL,PRIMARY KEY(account_id,tenant_id,operation,key_hash));

-- Retomável: uma execução interrompida ou reaplicada também reconcilia convites que
-- venceram enquanto ainda estavam materializados como pending.
WITH expired AS (
  UPDATE burgoweb_global.invitations
  SET state='expired',version=version+1,updated_at=CURRENT_TIMESTAMP
  WHERE state='pending' AND expires_at<=CURRENT_TIMESTAMP
  RETURNING id
)
UPDATE burgoweb_global.invitation_outbox
SET status='dead',leased_until=NULL,lease_owner=NULL,last_error_code='expired',updated_at=CURRENT_TIMESTAMP
WHERE invitation_id IN (SELECT id FROM expired) AND status IN('pending','leased');
