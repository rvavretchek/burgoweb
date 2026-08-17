ALTER TABLE burgoweb_global.tenant_registry ADD COLUMN IF NOT EXISTS time_zone text NOT NULL DEFAULT 'America/Sao_Paulo';
ALTER TABLE burgoweb_global.tenant_registry DROP CONSTRAINT IF EXISTS tenant_registry_time_zone_check;
ALTER TABLE burgoweb_global.tenant_registry ADD CONSTRAINT tenant_registry_time_zone_check CHECK (time_zone ~ '^[A-Za-z_+-]+(/[A-Za-z_+-]+){1,2}$');
