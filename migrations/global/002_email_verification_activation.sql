ALTER TABLE burgoweb_global.accounts DROP CONSTRAINT IF EXISTS accounts_state_check;
ALTER TABLE burgoweb_global.accounts ADD CONSTRAINT accounts_state_check CHECK (state IN ('pending_verification','active','disabled'));
ALTER TABLE burgoweb_global.accounts ADD COLUMN IF NOT EXISTS email_verified_at timestamptz;

ALTER TABLE burgoweb_global.tenant_registry DROP CONSTRAINT IF EXISTS tenant_registry_state_check;
ALTER TABLE burgoweb_global.tenant_registry ADD CONSTRAINT tenant_registry_state_check CHECK (state IN ('provisioning','pending_verification','active','quarantined','compensated'));

ALTER TABLE burgoweb_global.pending_authorities DROP CONSTRAINT IF EXISTS pending_authorities_state_check;
ALTER TABLE burgoweb_global.pending_authorities ADD CONSTRAINT pending_authorities_state_check CHECK (state IN ('pending_verification','active'));
ALTER TABLE burgoweb_global.pending_authorities ADD COLUMN IF NOT EXISTS activated_at timestamptz;

CREATE TABLE IF NOT EXISTS burgoweb_global.verification_tokens (
  id uuid PRIMARY KEY,
  outbox_id uuid NOT NULL UNIQUE,
  account_id uuid NOT NULL REFERENCES burgoweb_global.accounts(id),
  request_id uuid NOT NULL REFERENCES burgoweb_global.provisioning_requests(id),
  purpose text NOT NULL CHECK (purpose = 'email-verification'),
  key_version text NOT NULL,
  token_hash char(64) NOT NULL UNIQUE,
  issued_at timestamptz NOT NULL,
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  cancelled_at timestamptz,
  CHECK (expires_at > issued_at),
  CHECK (used_at IS NULL OR cancelled_at IS NULL)
);
CREATE INDEX IF NOT EXISTS verification_tokens_request_idx ON burgoweb_global.verification_tokens(request_id, purpose, expires_at DESC);

CREATE TABLE IF NOT EXISTS burgoweb_global.email_outbox (
  id uuid PRIMARY KEY,
  verification_id uuid NOT NULL UNIQUE REFERENCES burgoweb_global.verification_tokens(id),
  event_type text NOT NULL CHECK (event_type = 'email-verification.requested.v1'),
  status text NOT NULL CHECK (status IN ('pending','leased','accepted','dead','ambiguous')),
  available_at timestamptz NOT NULL,
  leased_until timestamptz,
  lease_owner text,
  attempt_count integer NOT NULL DEFAULT 0 CHECK (attempt_count >= 0),
  provider_reference text,
  last_error_code text,
  correlation_id uuid NOT NULL,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
);
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='verification_tokens_outbox_fk' AND conrelid='burgoweb_global.verification_tokens'::regclass) THEN
    ALTER TABLE burgoweb_global.verification_tokens ADD CONSTRAINT verification_tokens_outbox_fk FOREIGN KEY (outbox_id) REFERENCES burgoweb_global.email_outbox(id) DEFERRABLE INITIALLY DEFERRED;
  END IF;
END $$;
CREATE INDEX IF NOT EXISTS email_outbox_claim_idx ON burgoweb_global.email_outbox(status, available_at, created_at);

CREATE TABLE IF NOT EXISTS burgoweb_global.email_delivery_attempts (
  id uuid PRIMARY KEY,
  outbox_id uuid NOT NULL REFERENCES burgoweb_global.email_outbox(id),
  attempt_number integer NOT NULL,
  provider text NOT NULL,
  state text NOT NULL CHECK (state IN ('started','accepted','failed','ambiguous')),
  provider_reference text,
  error_code text,
  started_at timestamptz NOT NULL,
  finished_at timestamptz,
  UNIQUE (outbox_id, attempt_number)
);

CREATE TABLE IF NOT EXISTS burgoweb_global.rate_limit_buckets (
  operation text NOT NULL,
  subject_hash char(64) NOT NULL,
  window_started_at timestamptz NOT NULL,
  expires_at timestamptz NOT NULL,
  count integer NOT NULL CHECK (count > 0),
  PRIMARY KEY (operation, subject_hash, window_started_at)
);
CREATE INDEX IF NOT EXISTS rate_limit_buckets_expiry_idx ON burgoweb_global.rate_limit_buckets(expires_at);

CREATE UNIQUE INDEX IF NOT EXISTS audit_event_request_type_unique
  ON burgoweb_global.audit_events(request_id, event_type)
  WHERE event_type IN ('provisioning.pending','email-verification.activated');
