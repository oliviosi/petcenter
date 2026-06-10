PR Title: OpenSpec: tenant-custom-domain-notifications-extension

PR Body:

Summary
- Adds OpenSpec artifacts (proposal, design, tasks, runbook) for extending tenant custom-domain notifications.
- Implements backend wiring: EF mapping for notification fields, EmailNotificationProvider with in-process retries, unit + integration tests verifying deduplication and retry behavior.
- Provides a SQL migration script (migration.sql) for ops to apply the schema changes.

Files changed
- openspec/changes/tenant-custom-domain-notifications-extension/{proposal.md,design.md,tasks.md,runbook.md,.openspec.yaml,migration.sql}
- apps/backend/Api/Modules/Empresas/Infrastructure/EmpresaConfiguration.cs (EF mapping for notification fields)
- apps/backend/Api/Modules/Empresas/Infrastructure/EmailNotificationProvider.cs (provider refactor + SendEmailAsync hook)
- apps/backend/Api.Tests/EmailNotificationProviderIntegrationTests.cs (integration test)

Migration
- A SQL script is available at openspec/changes/tenant-custom-domain-notifications-extension/migration.sql.
- Design-time `dotnet ef` could not generate migrations here due to missing DB connection. Apply the SQL in staging with:

  psql $STAGING_CONN -f openspec/changes/tenant-custom-domain-notifications-extension/migration.sql

Testing
- Ran backend unit + integration tests locally: all tests passed.

Ops notes
- Configurable options: NOTIFY_MAX_ATTEMPTS (default 3), NOTIFY_RETRY_BASE_MS (default 500ms).
- Consider converting in-process retries to delayed-job or background retries for production scale.

Next steps (recommended)
1. Reviewer: confirm OpenSpec artifacts and migration SQL.
2. Ops: apply migration in staging and run smoke tests.
3. Frontend: run contract/e2e to confirm DTO mapping and render behavior.

If a GitHub token is available, the agent can open the PR programmatically; otherwise, open a PR at:
https://github.com/oliviosi/petcenter/compare/main...openspec/tenant-custom-domain-notifications-extension?expand=1
