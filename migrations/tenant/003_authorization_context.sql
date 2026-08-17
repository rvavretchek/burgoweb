ALTER TABLE authority_assignment ADD COLUMN IF NOT EXISTS capabilities text[] NOT NULL DEFAULT ARRAY['dashboard.read']::text[];
ALTER TABLE authority_assignment ADD COLUMN IF NOT EXISTS authorization_version bigint NOT NULL DEFAULT 1;
ALTER TABLE authority_assignment DROP CONSTRAINT IF EXISTS authority_assignment_authorization_version_check;
ALTER TABLE authority_assignment ADD CONSTRAINT authority_assignment_authorization_version_check CHECK (authorization_version > 0);
INSERT INTO schema_version(version, applied_at) VALUES (3, CURRENT_TIMESTAMP) ON CONFLICT (version) DO NOTHING;
