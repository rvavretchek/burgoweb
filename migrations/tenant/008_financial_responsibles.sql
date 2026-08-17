-- Atribuição de Responsável Financeiro por Unidade (FR-42, AD-8): capacidade própria
-- (financial-responsibles.manage), distinta de people-units-relationships.manage, controlada
-- pelo catálogo em packages/application/src/authorization/capabilities.ts (mesma decisão da
-- Story 1.9 de manter o catálogo de capacidades fora do banco).
CREATE TABLE IF NOT EXISTS financial_responsible_assignment (
  id uuid PRIMARY KEY,
  public_id uuid NOT NULL UNIQUE,
  person_id uuid NOT NULL REFERENCES person(id),
  unit_id uuid NOT NULL REFERENCES unit(id),
  source_relationship_id uuid NOT NULL REFERENCES person_unit_relationship(id),
  valid_from timestamptz NOT NULL,
  valid_until timestamptz,
  state text NOT NULL CHECK(state IN('scheduled','active','expired','revoked')),
  granted_by_person_id uuid NOT NULL REFERENCES person(id),
  version bigint NOT NULL DEFAULT 1 CHECK(version>0),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK(valid_until IS NULL OR valid_until>valid_from)
);
CREATE INDEX IF NOT EXISTS financial_responsible_effective_idx ON financial_responsible_assignment(person_id,state,valid_from,valid_until);
CREATE INDEX IF NOT EXISTS financial_responsible_unit_idx ON financial_responsible_assignment(unit_id,state,valid_from,valid_until);
CREATE INDEX IF NOT EXISTS financial_responsible_relationship_idx ON financial_responsible_assignment(source_relationship_id);
-- Impede duas atribuições simultâneas vigentes da mesma Pessoa para a mesma Unidade
-- (mesmo padrão proativo de capability_grant_active_unique, Story 1.9).
CREATE UNIQUE INDEX IF NOT EXISTS financial_responsible_active_unique ON financial_responsible_assignment(person_id,unit_id) WHERE state IN('scheduled','active');

CREATE TABLE IF NOT EXISTS financial_responsible_transition (
  id uuid PRIMARY KEY,
  assignment_id uuid NOT NULL REFERENCES financial_responsible_assignment(id),
  from_state text,
  to_state text NOT NULL,
  actor_person_id uuid NOT NULL REFERENCES person(id),
  occurred_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  request_id text NOT NULL,
  UNIQUE(assignment_id,to_state,occurred_at)
);

CREATE TABLE IF NOT EXISTS financial_responsible_projection (
  assignment_id uuid PRIMARY KEY REFERENCES financial_responsible_assignment(id),
  public_id uuid NOT NULL,
  unit_id uuid NOT NULL,
  state text NOT NULL,
  valid_from timestamptz NOT NULL,
  valid_until timestamptz,
  version bigint NOT NULL,
  projected_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS financial_responsible_notification_outbox (
  id uuid PRIMARY KEY,
  assignment_id uuid NOT NULL REFERENCES financial_responsible_assignment(id),
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

INSERT INTO schema_version(version, applied_at) VALUES (8, CURRENT_TIMESTAMP) ON CONFLICT (version) DO NOTHING;
