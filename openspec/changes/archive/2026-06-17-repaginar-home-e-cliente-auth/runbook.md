# Runbook — repaginar-home-e-cliente-auth

This runbook documents how to apply the Cliente migration and run the backend tests introduced by this change.

1) Apply DB migrations (PostgreSQL)
- Ensure DATABASE_URL (or connection string) points to the target DB.
- From the repository root run:
  Set-Location 'C:\Users\Usuario\Desktop\OneTake\petcenter\apps\backend';
  dotnet ef database update --project Api --startup-project Api

2) Running backend tests locally
- From repository root run:
  Set-Location 'C:\Users\Usuario\Desktop\OneTake\petcenter\apps\backend';
  dotnet test 'C:\Users\Usuario\Desktop\OneTake\petcenter\apps\backend\Api.Tests\Api.Tests.csproj' --no-build

3) Notes
- Migration file: apps/backend/Api/Migrations/20260615131205_AddClientes.cs (already included).
- The tests added are unit tests for RegisterService and LoginService (Api.Tests).
- The LoginService tests use an in-memory IConfiguration for Jwt values; ensure CI/staging configure Jwt keys for runtime usage.

4) CI
- If desired, add a pipeline step that runs the Api.Tests project and (optionally) applies migrations to a disposable staging DB before functional tests.

5) Rollback
- To roll back, run `dotnet ef database update <previous_migration>` or drop the table `clientes` if using ephemeral DBs.
