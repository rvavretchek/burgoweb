ALTER TABLE authority_assignment ADD COLUMN IF NOT EXISTS aggregate_authorization_version bigint NOT NULL DEFAULT 1 CHECK(aggregate_authorization_version>0);
UPDATE authority_assignment SET capabilities=(SELECT array_agg(DISTINCT capability ORDER BY capability) FROM unnest(capabilities||ARRAY['roles.read','roles.preview','roles.grant','roles.suspend','roles.restore','roles.revoke']) capability),authorization_version=authorization_version+1 WHERE role_kind='syndic';

CREATE TABLE IF NOT EXISTS role_assignment (
  id uuid PRIMARY KEY,
  public_id uuid NOT NULL UNIQUE,
  person_id uuid NOT NULL REFERENCES person(id),
  source_relationship_id uuid REFERENCES person_unit_relationship(id),
  role_kind text NOT NULL CHECK(role_kind IN('syndic','administrative-assistant','councilor','resident')),
  scope_kind text NOT NULL CHECK(scope_kind IN('tenant','unit')),
  scope_unit_id uuid REFERENCES unit(id),
  valid_from timestamptz NOT NULL,
  valid_until timestamptz,
  state text NOT NULL CHECK(state IN('scheduled','active','suspended','expired','revoked')),
  granted_by_person_id uuid NOT NULL REFERENCES person(id),
  restricted_reason text CHECK(restricted_reason IS NULL OR char_length(restricted_reason) BETWEEN 8 AND 500),
  version bigint NOT NULL DEFAULT 1 CHECK(version>0),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK(valid_until IS NULL OR valid_until>valid_from),
  CHECK((scope_kind='tenant' AND scope_unit_id IS NULL) OR (scope_kind='unit' AND scope_unit_id IS NOT NULL))
);
CREATE INDEX IF NOT EXISTS role_assignment_effective_idx ON role_assignment(person_id,state,valid_from,valid_until);
CREATE INDEX IF NOT EXISTS role_assignment_relationship_idx ON role_assignment(source_relationship_id) WHERE source_relationship_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS role_assignment_transition (
  id uuid PRIMARY KEY, assignment_id uuid NOT NULL REFERENCES role_assignment(id),
  from_state text, to_state text NOT NULL, actor_person_id uuid NOT NULL REFERENCES person(id),
  restricted_reason text, occurred_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  request_id text NOT NULL, UNIQUE(assignment_id,to_state,occurred_at)
);
CREATE TABLE IF NOT EXISTS role_authorization_projection (
  assignment_id uuid PRIMARY KEY REFERENCES role_assignment(id), public_id uuid NOT NULL,
  state text NOT NULL, role_kind text NOT NULL, scope_kind text NOT NULL,
  valid_from timestamptz NOT NULL, valid_until timestamptz, version bigint NOT NULL,
  projected_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS role_command_idempotency (
  actor_person_id uuid NOT NULL REFERENCES person(id), operation text NOT NULL,
  key_hash char(64) NOT NULL, request_hash char(64) NOT NULL, response_body jsonb,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP, expires_at timestamptz NOT NULL,
  PRIMARY KEY(actor_person_id,operation,key_hash)
);
CREATE TABLE IF NOT EXISTS role_notification_outbox (
  id uuid PRIMARY KEY, assignment_id uuid NOT NULL REFERENCES role_assignment(id),
  transition text NOT NULL, payload jsonb NOT NULL, status text NOT NULL DEFAULT 'pending' CHECK(status IN('pending','leased','sent','dead')),
  available_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP, leased_until timestamptz,
  lease_owner text, attempt_count integer NOT NULL DEFAULT 0, last_error_code text,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- authority_assignment nunca registrou quem concedeu o Papel; para as linhas migradas abaixo
-- granted_by_person_id é preenchido com o próprio person_id (decisão de produto documentada em
-- 1-8-conceder-suspender-e-revogar-papeis.md, Review Findings) porque não há dado real de
-- concedente para restaurar. Atribuições criadas após esta migration sempre recebem o
-- concedente real (ver postgres-invitation-repository.ts e postgres-role-assignment-repository.ts).
INSERT INTO role_assignment(id,public_id,person_id,source_relationship_id,role_kind,scope_kind,valid_from,valid_until,state,granted_by_person_id,version,created_at,updated_at)
SELECT id,id,person_id,source_relationship_id,role_kind,'tenant',COALESCE(activated_at,created_at),NULL,
  CASE state WHEN 'active' THEN 'active' WHEN 'ended' THEN 'expired' ELSE 'scheduled' END,
  person_id,authorization_version,created_at,COALESCE(activated_at,created_at)
FROM authority_assignment ON CONFLICT(id) DO NOTHING;

INSERT INTO role_authorization_projection(assignment_id,public_id,state,role_kind,scope_kind,valid_from,valid_until,version)
SELECT id,public_id,state,role_kind,scope_kind,valid_from,valid_until,version FROM role_assignment ON CONFLICT(assignment_id) DO NOTHING;

UPDATE burgoweb_global.account_tenant_memberships membership SET authorization_version=authority.authorization_version
FROM authority_assignment authority WHERE membership.authority_id=authority.id;

INSERT INTO schema_version(version, applied_at) VALUES (6, CURRENT_TIMESTAMP) ON CONFLICT (version) DO NOTHING;
