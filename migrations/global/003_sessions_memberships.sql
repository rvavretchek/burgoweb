CREATE TABLE IF NOT EXISTS burgoweb_global.sessions (
  id uuid PRIMARY KEY,
  token_hash char(64) NOT NULL UNIQUE,
  csrf_hash char(64) NOT NULL,
  account_id uuid NOT NULL REFERENCES burgoweb_global.accounts(id),
  created_at timestamptz NOT NULL,
  last_seen_at timestamptz NOT NULL,
  absolute_expires_at timestamptz NOT NULL,
  idle_ttl_seconds integer NOT NULL CHECK (idle_ttl_seconds > 0),
  revoked_at timestamptz,
  revoked_reason text,
  CHECK (absolute_expires_at > created_at),
  CHECK ((revoked_at IS NULL) = (revoked_reason IS NULL))
);
CREATE INDEX IF NOT EXISTS sessions_account_active_idx ON burgoweb_global.sessions(account_id, absolute_expires_at) WHERE revoked_at IS NULL;
CREATE TABLE IF NOT EXISTS burgoweb_global.session_csrf_tokens (
  session_id uuid NOT NULL REFERENCES burgoweb_global.sessions(id) ON DELETE CASCADE,
  csrf_hash char(64) NOT NULL,
  created_at timestamptz NOT NULL,
  PRIMARY KEY (session_id, csrf_hash)
);

CREATE TABLE IF NOT EXISTS burgoweb_global.account_tenant_memberships (
  id uuid PRIMARY KEY,
  account_id uuid NOT NULL REFERENCES burgoweb_global.accounts(id),
  tenant_id uuid NOT NULL REFERENCES burgoweb_global.tenant_registry(id),
  person_id uuid NOT NULL,
  authority_id uuid NOT NULL,
  state text NOT NULL CHECK (state IN ('active','suspended','ended')),
  valid_from timestamptz NOT NULL,
  valid_until timestamptz,
  authorization_version bigint NOT NULL DEFAULT 1 CHECK (authorization_version > 0),
  UNIQUE (account_id, tenant_id, authority_id),
  CHECK (valid_until IS NULL OR valid_until > valid_from)
);
CREATE INDEX IF NOT EXISTS memberships_account_active_idx ON burgoweb_global.account_tenant_memberships(account_id, tenant_id) WHERE state='active';
CREATE UNIQUE INDEX IF NOT EXISTS memberships_one_active_account_tenant_idx ON burgoweb_global.account_tenant_memberships(account_id, tenant_id) WHERE state='active';

DO $$
DECLARE tenant record; membership record;
BEGIN
  FOR tenant IN SELECT id, schema_name FROM burgoweb_global.tenant_registry WHERE schema_name ~ '^tenant_[a-f0-9]{32}$' LOOP
    FOR membership IN SELECT pa.id AS authority_id, pa.account_id, pa.activated_at FROM burgoweb_global.pending_authorities pa WHERE pa.tenant_id=tenant.id AND pa.state='active' LOOP
      EXECUTE format('INSERT INTO burgoweb_global.account_tenant_memberships(id,account_id,tenant_id,person_id,authority_id,state,valid_from) SELECT $1,$2,$3,aa.person_id,$4,''active'',COALESCE($5,aa.activated_at,now()) FROM %I.authority_assignment aa WHERE aa.id=$4 AND aa.state=''active'' ON CONFLICT(account_id,tenant_id,authority_id) DO NOTHING', tenant.schema_name)
        USING membership.authority_id, membership.account_id, tenant.id, membership.authority_id, membership.activated_at;
    END LOOP;
  END LOOP;
END $$;
