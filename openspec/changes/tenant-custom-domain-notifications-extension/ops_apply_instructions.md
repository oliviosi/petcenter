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
