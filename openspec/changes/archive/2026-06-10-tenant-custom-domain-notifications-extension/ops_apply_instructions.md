# Ops: Apply migration for tenant-custom-domain-notifications-extension

This file contains exact steps for ops to apply the schema change in staging/production.

Files:
- migration SQL: openspec/changes/tenant-custom-domain-notifications-extension/migration.sql

Apply (Postgres / psql)

1. Take a database backup for safety.

2. Apply migration on staging (example):

   psql "$STAGING_CONN" -f openspec/changes/tenant-custom-domain-notifications-extension/migration.sql

3. Verify columns exist:

   psql "$STAGING_CONN" -c "\d+ empresas" | grep dominio_personalizado_ultima_notificacao

4. Run app migrations / restart services if necessary.

Verification

1. Trigger a synthetic domain event in staging (use admin tool or publish to event bus):
   - Event: tenant.domain.status.changed { tenantId, domain, state: 'degraded', reason }

2. Check application logs for NotificationService sending and persistence.

3. Check empresa row has updated notification fields (query):
   SELECT dominio_personalizado_ultima_notificacao_categoria,
          dominio_personalizado_ultima_notificacao_motivo,
          dominio_personalizado_ultima_notificacao_enviada_em,
          dominio_personalizado_ultima_notificacao_resultado,
          dominio_personalizado_ultima_notificacao_tentativas
   FROM empresas WHERE id = '<TENANT_UUID>';

Rollback

- To rollback schema changes, restore DB from backup taken in step 1.
- To stop notifications immediately: disable NotificationService by setting a feature flag or commenting the service registration in the DI (temporary) and redeploy.

Contact

- If any issue, notify platform-ops and backend-oncall with the migration filename and error logs.

---

# Staging validation checklist (detailed)

These are exact commands and checks for validating synthetic degraded/recovered events and retry behavior in staging. Run the steps in order.

Prerequisites

- Staging services deployed (API and worker if applicable).
- Environment variables set in staging: NOTIFY_MAX_ATTEMPTS (default 3), NOTIFY_RETRY_BASE_MS (default 500), EMAIL_FROM_ADDRESS.
- Database backup taken (see Apply section).
- Access to RabbitMQ management or an admin API to publish events, or an admin helper endpoint.

A. Trigger a synthetic degraded event

Option 1 — Using the admin tool / internal helper (recommended if available):

- Use the admin UI or internal helper endpoint to publish a tenant.domain.status.changed event for the target tenant.

Option 2 — Publish to RabbitMQ (example using rabbitmqadmin):

1. Prepare payload (save as event.json):

   {
     "routing_key": "tenant.domain.status.changed",
     "payload": {
       "tenantId": "<TENANT_UUID>",
       "domain": "example-tenant.com",
       "state": "degraded",
       "reason": "Synthetic test: simulate degraded"
     }
   }

2. Publish:

   rabbitmqadmin publish exchange=bookings routing_key=tenant.domain.status.changed payload="$(cat event.json)"

(If rabbitmqadmin is not available, use the management HTTP API or your environment's event-publish helper.)

B. Quick checks after publishing

1. Inspect API logs for NotificationService entries mentioning tenantId and "sending" or "queued".

2. Confirm persistence in DB (run against staging DB):

   psql "$STAGING_CONN" -c "SELECT dominio_personalizado_ultima_notificacao_categoria, dominio_personalizado_ultima_notificacao_motivo, dominio_personalizado_ultima_notificacao_enviada_em, dominio_personalizado_ultima_notificacao_resultado, dominio_personalizado_ultima_notificacao_tentativas FROM empresas WHERE id = '<TENANT_UUID>' LIMIT 1;"

3. Confirm public DTO exposes the new fields (example using frontend staging URL):

   curl -s "${STAGING_FRONTEND_URL}/api/public/profile?slug=<TENANT_SLUG>" | jq '.customDomain | {lastNotificationCategory: .lastNotificationCategory, lastNotificationReason: .lastNotificationReason, lastNotificationSentAt: .lastNotificationSentAt, lastNotificationResult: .lastNotificationResult, lastNotificationAttempts: .lastNotificationAttempts}'

C. Validate retries (simulate provider failure)

1. Temporarily point SMTP provider to an invalid host or configure a testing provider to reject deliveries (depends on staging tooling).

2. Re-publish the degraded event (same as step A).

3. Watch NotificationService logs — it should attempt sends up to NOTIFY_MAX_ATTEMPTS and emit the metrics:

   - notifications_attempts_total
   - notifications_sent_total
   - notifications_failed_total

4. Verify the DB row increments dominio_personalizado_ultima_notificacao_tentativas until max attempts and records a failure outcome.

D. Recovery event

1. Publish a recovered event:

   {
     "routing_key": "tenant.domain.status.changed",
     "payload": {
       "tenantId": "<TENANT_UUID>",
       "domain": "example-tenant.com",
       "state": "recovered",
       "reason": "Synthetic test: recovery"
     }
   }

2. Confirm NotificationService processes the recovered transition, a new notification record is persisted with outcome=success and attempts=1.

E. Post-validation

1. Revert any staging SMTP/test-provider changes.
2. If the test exposed an issue, collect logs and notify platform-ops with the migration file and error details.
3. If all checks pass, mark the OpenSpec tasks as validated (return here and request archive).

Notes

- Use tenant-specific IDs/slug for all commands. Replace <TENANT_UUID> and <TENANT_SLUG> accordingly.
- If your environment runs a worker separately, ensure the worker image is deployed and connected to the same message broker.
- These steps are intentionally generic — adapt the event-publish command to your environment's tooling (RabbitMQ, Kafka, or an HTTP admin endpoint).
