# Runbook: Tenant Custom Domain Notifications Extension

Purpose
- Guide operators to apply DB migrations, validate notification persistence, and troubleshoot notification failures.

Pre-reqs
- Database reachable; EF tools available (dotnet-ef matching runtime preferred).
- Staging environment with test SMTP or fake provider configured.

Apply migration (staging)
1. Ensure connection string for staging is set.
2. From repo root:
   Set-Location "apps\backend"; dotnet ef database update --project Api\Api.csproj --startup-project Api\Api.csproj
3. Verify `tenant_domain_notifications` table exists (or added columns on `tenant_domains_status`).

Verify behavior
1. Trigger a synthetic domain event (degraded -> recovered) via admin tool or send a test `tenant.domain.status.changed` event to the event bus.
2. Observe NotificationService logs; confirm a notification record was created with attempts=1 and outcome recorded.
3. If failure injected (simulate SMTP error), confirm retry is scheduled and attempts increments until NOTIFY_MAX_ATTEMPTS.
4. Check GET /api/public/profile includes optional DominioPersonalizadoUltimaNotificacao* fields after notification is sent.

Troubleshooting
- No notification records: verify event subscription, background worker, and message bus connectivity.
- Emails not sent: validate email provider configuration (SMTP creds, from address) and check provider logs.
- Excessive retries: verify NOTIFY_MAX_ATTEMPTS is set; if broken provider, temporarily set max attempts to 1 and surface to ops team.

Rollbacks
- To rollback schema, restore DB backup taken before migration.
- To stop notifications immediately, remove/disable NotificationService subscription or set a feature flag to disable sends.

Ops notes
- Config keys: NOTIFY_RETRY_BASE_MS, NOTIFY_MAX_ATTEMPTS, EMAIL_FROM_ADDRESS.
- Add monitoring: metric for notification outcomes (success/failure) and alert when failure rate exceeds threshold.

When done
- Mark OpenSpec tasks as complete and propose archive.
