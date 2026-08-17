$ErrorActionPreference = 'Stop'
$postgresRoot = if ($env:BURGOWEB_LOCAL_POSTGRES_ROOT) { $env:BURGOWEB_LOCAL_POSTGRES_ROOT } else { 'C:\tmp\burgoweb-pg18' }
$postgresBin = Join-Path $postgresRoot 'bin'
$psql = Join-Path $postgresBin 'psql.exe'
$createdb = Join-Path $postgresBin 'createdb.exe'
$dropdb = Join-Path $postgresBin 'dropdb.exe'
$port = if ($env:BURGOWEB_LOCAL_POSTGRES_PORT) { $env:BURGOWEB_LOCAL_POSTGRES_PORT } else { '55432' }
$user = if ($env:BURGOWEB_LOCAL_POSTGRES_USER) { $env:BURGOWEB_LOCAL_POSTGRES_USER } else { 'postgres' }
$password = if ($env:BURGOWEB_LOCAL_POSTGRES_PASSWORD) { $env:BURGOWEB_LOCAL_POSTGRES_PASSWORD } else { 'test-only-password' }
$database = 'burgoweb_integration_' + ([guid]::NewGuid().ToString('N'))
foreach ($binary in @($psql, $createdb, $dropdb)) { if (-not (Test-Path -LiteralPath $binary)) { throw "PostgreSQL 18 local não encontrado em $postgresBin. Configure BURGOWEB_LOCAL_POSTGRES_ROOT." } }
$service = Get-Service -Name 'postgresql-x64-18-burgoweb' -ErrorAction SilentlyContinue
if ($service -and $service.Status -ne 'Running') { Start-Service -Name $service.Name }
$env:PGPASSWORD = $password
try {
  & $psql -h 127.0.0.1 -p $port -U $user -d postgres -v ON_ERROR_STOP=1 -Atc "select current_setting('server_version_num')::int >= 180000" | Select-String -SimpleMatch 't' | Out-Null
  & $createdb -h 127.0.0.1 -p $port -U $user --encoding=UTF8 --template=template0 $database
  $env:BURGOWEB_INTEGRATION = '1'
  $env:BURGOWEB_INTEGRATION_DATABASE_URL = "postgresql://${user}:${password}@127.0.0.1:${port}/${database}"
  npm run test:integration:raw
  if ($LASTEXITCODE -ne 0) { throw "A integração PostgreSQL falhou com código $LASTEXITCODE." }
} finally {
  Remove-Item Env:BURGOWEB_INTEGRATION_DATABASE_URL -ErrorAction SilentlyContinue
  & $dropdb -h 127.0.0.1 -p $port -U $user --if-exists --force $database
}
