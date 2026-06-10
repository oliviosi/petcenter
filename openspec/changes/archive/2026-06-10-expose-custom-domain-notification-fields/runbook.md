Runbook: Expose custom-domain notification fields in public profile

Purpose
- Provide operational steps to apply DB migrations and verify the API contract for the public profile endpoint.

Apply migration (dev/staging)
1. Ensure 'Default' connection string is set in appsettings.Development or via environment variable (e.g., DOTNET_CONNECTIONSTRINGS__DEFAULT).
2. From repository root run:
   Set-Location "apps\backend"; dotnet ef database update --project Api\Api.csproj --startup-project Api\Api.csproj
3. Verify the columns exist on table `empresas`: DominioPersonalizadoUltimaNotificacaoCategoria, DominioPersonalizadoUltimaNotificacaoMotivo, DominioPersonalizadoUltimaNotificacaoEnviadaEm, DominioPersonalizadoUltimaNotificacaoResultado, DominioPersonalizadoUltimaNotificacaoTentativas.

CI considerations
- Add a pipeline step to run EF migrations against a dedicated ephemeral DB for migration checks, or run schema validation queries after migrations in integration environments.
- Do not run migrations automatically against production without approvals.

Verification
- Run backend tests: `dotnet test apps/backend/Api.Tests/Api.Tests.csproj --no-build`
- Call GET /api/public/profile for a tenant with notification metadata and confirm response JSON includes the new fields (nullable when absent).

Rollback
- Restore DB from backup made prior to applying migrations.
- If immediate rollback needed, revert the migration via `dotnet ef database update <previous_migration>` using a tested backup plan.
