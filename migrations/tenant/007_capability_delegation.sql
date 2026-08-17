-- capability_id não tem CHECK enumerando valores: o catálogo fechado vive em
-- packages/application/src/authorization/capabilities.ts (CAPABILITY_CATALOG) e é validado lá.
-- Duplicar a lista aqui divergiria com o tempo (mesmo problema encontrado e corrigido na Story 1.8
-- para o catálogo de Papéis, onde a mesma lista existia em 3 lugares).
CREATE TABLE IF NOT EXISTS capability_grant (
  id uuid PRIMARY KEY,
  public_id uuid NOT NULL UNIQUE,
  person_id uuid NOT NULL REFERENCES person(id),
  capability_id text NOT NULL,
  valid_from timestamptz NOT NULL,
  valid_until timestamptz,
  state text NOT NULL CHECK(state IN('scheduled','active','expired','revoked')),
  granted_by_person_id uuid NOT NULL REFERENCES person(id),
  version bigint NOT NULL DEFAULT 1 CHECK(version>0),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK(valid_until IS NULL OR valid_until>valid_from)
);
CREATE INDEX IF NOT EXISTS capability_grant_effective_idx ON capability_grant(person_id,state,valid_from,valid_until);
-- Impede duas concessões simultâneas vigentes da mesma capacidade para a mesma Pessoa
-- (lacuna equivalente encontrada em Papéis na Story 1.8; corrigida aqui desde o início).
CREATE UNIQUE INDEX IF NOT EXISTS capability_grant_active_unique ON capability_grant(person_id,capability_id) WHERE state IN('scheduled','active');

CREATE TABLE IF NOT EXISTS capability_grant_transition (
  id uuid PRIMARY KEY,
  grant_id uuid NOT NULL REFERENCES capability_grant(id),
  from_state text,
  to_state text NOT NULL,
  actor_person_id uuid NOT NULL REFERENCES person(id),
  occurred_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  request_id text NOT NULL,
  UNIQUE(grant_id,to_state,occurred_at)
);

CREATE TABLE IF NOT EXISTS capability_grant_projection (
  grant_id uuid PRIMARY KEY REFERENCES capability_grant(id),
  public_id uuid NOT NULL,
  state text NOT NULL,
  capability_id text NOT NULL,
  valid_from timestamptz NOT NULL,
  valid_until timestamptz,
  version bigint NOT NULL,
  projected_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS capability_notification_outbox (
  id uuid PRIMARY KEY,
  grant_id uuid NOT NULL REFERENCES capability_grant(id),
  transition text NOT NULL,
  payload jsonb NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK(status IN('pending','leased','sent','dead')),
  available_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  leased_until timestamptz,
  lease_owner text,
  attempt_count integer NOT NULL DEFAULT 0,
  last_error_code text,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO schema_version(version, applied_at) VALUES (7, CURRENT_TIMESTAMP) ON CONFLICT (version) DO NOTHING;
