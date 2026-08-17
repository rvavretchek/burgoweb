ALTER TABLE burgoweb_global.sessions ADD COLUMN IF NOT EXISTS public_id uuid;
UPDATE burgoweb_global.sessions SET public_id = gen_random_uuid() WHERE public_id IS NULL;
ALTER TABLE burgoweb_global.sessions ALTER COLUMN public_id SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS sessions_public_id_unique ON burgoweb_global.sessions(public_id);

CREATE TABLE IF NOT EXISTS burgoweb_global.password_recovery_tokens (
  id uuid PRIMARY KEY,
  outbox_id uuid NOT NULL UNIQUE,
  account_id uuid NOT NULL REFERENCES burgoweb_global.accounts(id),
  request_id uuid NOT NULL,
  purpose text NOT NULL CHECK (purpose='password-recovery'),
  key_version text NOT NULL,
  token_hash char(64) NOT NULL UNIQUE,
  issued_at timestamptz NOT NULL,
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  cancelled_at timestamptz,
  CHECK (expires_at > issued_at),
  CHECK (used_at IS NULL OR cancelled_at IS NULL)
);
CREATE INDEX IF NOT EXISTS recovery_tokens_account_idx ON burgoweb_global.password_recovery_tokens(account_id,expires_at DESC);

CREATE TABLE IF NOT EXISTS burgoweb_global.recovery_email_outbox (
  id uuid PRIMARY KEY,
  recovery_id uuid NOT NULL UNIQUE REFERENCES burgoweb_global.password_recovery_tokens(id),
  status text NOT NULL CHECK(status IN ('pending','leased','accepted','dead','ambiguous')),
  available_at timestamptz NOT NULL,
  leased_until timestamptz,
  lease_owner text,
  attempt_count integer NOT NULL DEFAULT 0 CHECK(attempt_count>=0),
  provider_reference text,
  last_error_code text,
  correlation_id uuid NOT NULL,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
);
ALTER TABLE burgoweb_global.recovery_email_outbox ADD COLUMN IF NOT EXISTS recipient text;
UPDATE burgoweb_global.recovery_email_outbox o
SET recipient = a.email_normalized
FROM burgoweb_global.password_recovery_tokens t
JOIN burgoweb_global.accounts a ON a.id = t.account_id
WHERE o.recovery_id = t.id AND o.recipient IS NULL;
ALTER TABLE burgoweb_global.recovery_email_outbox ALTER COLUMN recipient SET NOT NULL;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='recovery_tokens_outbox_fk' AND conrelid='burgoweb_global.password_recovery_tokens'::regclass) THEN
    ALTER TABLE burgoweb_global.password_recovery_tokens ADD CONSTRAINT recovery_tokens_outbox_fk FOREIGN KEY(outbox_id) REFERENCES burgoweb_global.recovery_email_outbox(id) DEFERRABLE INITIALLY DEFERRED;
  END IF;
END $$;
CREATE INDEX IF NOT EXISTS recovery_outbox_claim_idx ON burgoweb_global.recovery_email_outbox(status,available_at,created_at);
