CREATE TABLE IF NOT EXISTS person (id uuid PRIMARY KEY, full_name text NOT NULL, created_at timestamptz NOT NULL);
CREATE TABLE IF NOT EXISTS pending_authority (id uuid PRIMARY KEY, person_id uuid NOT NULL REFERENCES person(id), state text NOT NULL CHECK (state = 'pending_verification'), created_at timestamptz NOT NULL);
CREATE TABLE IF NOT EXISTS schema_version (version integer PRIMARY KEY, applied_at timestamptz NOT NULL);
INSERT INTO schema_version(version, applied_at) VALUES (1, CURRENT_TIMESTAMP) ON CONFLICT (version) DO NOTHING;
