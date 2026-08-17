DO $$
BEGIN
  IF to_regclass('pending_authority') IS NOT NULL AND to_regclass('authority_assignment') IS NULL THEN
    ALTER TABLE pending_authority RENAME TO authority_assignment;
  END IF;
END $$;

ALTER TABLE authority_assignment DROP CONSTRAINT IF EXISTS pending_authority_state_check;
ALTER TABLE authority_assignment DROP CONSTRAINT IF EXISTS authority_assignment_state_check;
ALTER TABLE authority_assignment DROP CONSTRAINT IF EXISTS authority_assignment_role_check;
ALTER TABLE authority_assignment ADD COLUMN IF NOT EXISTS role_kind text NOT NULL DEFAULT 'syndic';
ALTER TABLE authority_assignment ADD COLUMN IF NOT EXISTS activated_at timestamptz;
ALTER TABLE authority_assignment ADD CONSTRAINT authority_assignment_state_check CHECK (state IN ('pending_verification','active'));
ALTER TABLE authority_assignment ADD CONSTRAINT authority_assignment_role_check CHECK (role_kind = 'syndic');
CREATE UNIQUE INDEX IF NOT EXISTS authority_assignment_initial_unique ON authority_assignment(person_id, role_kind);
INSERT INTO schema_version(version, applied_at) VALUES (2, CURRENT_TIMESTAMP) ON CONFLICT (version) DO NOTHING;
