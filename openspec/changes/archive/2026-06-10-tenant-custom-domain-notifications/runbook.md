Runbook: Tenant Custom Domain Notifications

Purpose
- Deploy configuration and apply DB migration for custom domain notification metadata.

Pre-reqs
- Database accessible and connection string set in appsettings.Development or via env var.
- EF tools available locally (dotnet-ef matching runtime preferred).

Steps to apply migration (local/dev)
1. Ensure the 'Default' connection string is set (e.g., "Host=localhost;Database=petcenter_dev;Username=...;Password=...").
2. From repo root run:
   Set-Location "apps\backend"; dotnet ef database update --project Api\Api.csproj --startup-project Api\Api.csproj
3. Verify columns exist in table 'empresas': DominioPersonalizadoUltimaNotificacaoCategoria, Motivo, EnviadaEm, Resultado, Tentativas.

Configuration
- Notifications options (defaults registered in DI):
  - NOTIFY_MAX_ATTEMPTS -> NotificationOptions:MaxAttempts
  - NOTIFY_RETRY_BASE_MS -> NotificationOptions:BaseDelayMs
  - EMAIL_FROM_ADDRESS -> configure real provider when integrated

Operational notes
- The initial provider is a mock; replace Api.Modules.Empresas.Infrastructure.EmailNotificationProvider with a real provider implementing INotificationService.
- Deduplication is based on category/state equality to avoid duplicate alerts.
- Consider routing recipients: owner vs all admins; default behavior should send to Empresa owner.

Rollback
- To rollback schema changes, restore DB from backup prior to migration.
- If unable to rollback, remove provider calls in StorefrontDomainVerificationService to stop new notifications.

OpenSpec tasks
- After applying migration and verifying in staging, mark tasks 7 and 8 done and propose archive of the change.
