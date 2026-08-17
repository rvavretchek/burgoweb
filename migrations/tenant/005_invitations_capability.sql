ALTER TABLE authority_assignment DROP CONSTRAINT IF EXISTS authority_assignment_role_check;
ALTER TABLE authority_assignment ADD CONSTRAINT authority_assignment_role_check CHECK(role_kind IN('syndic','administrative-assistant','councilor','resident'));
DROP INDEX IF EXISTS authority_assignment_initial_unique;
CREATE UNIQUE INDEX IF NOT EXISTS authority_assignment_initial_unique ON authority_assignment(person_id, role_kind) WHERE state='active';
WITH changed AS (UPDATE authority_assignment SET capabilities=array_append(capabilities,'invitations.manage'),authorization_version=authorization_version+1 WHERE role_kind='syndic' AND state='active' AND NOT('invitations.manage'=ANY(capabilities)) RETURNING id,authorization_version)
UPDATE burgoweb_global.account_tenant_memberships membership SET authorization_version=changed.authorization_version FROM changed WHERE membership.authority_id=changed.id;
INSERT INTO schema_version(version, applied_at) VALUES (5, CURRENT_TIMESTAMP) ON CONFLICT (version) DO NOTHING;
