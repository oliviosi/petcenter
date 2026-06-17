# Runbook — tenant-domain-health-dashboard

## Validação em staging

- Confirmar deploy do backend e frontend.
- Verificar acesso ao dashboard por tenant.
- Simular um caso com falha de notificação.
- Validar prontidão de certificado e DNS.
- Conferir se os dados exibidos batem com métricas e banco.

## Consultas úteis

### Contadores de notificação

```sql
SELECT
  COUNT(*) AS total,
  COUNT(*) FILTER (WHERE status = 'failure') AS falhas,
  COUNT(*) FILTER (WHERE status = 'success') AS sucessos
FROM domain_notifications;
```

```sql
SELECT *
FROM domain_notifications
ORDER BY created_at DESC
LIMIT 20;
```

### Colunas do tenant

```sql
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'domain_notifications'
ORDER BY ordinal_position;
```

```sql
SELECT *
FROM empresas
ORDER BY criado_em DESC
LIMIT 20;
```

## Checklist

- [x] Endpoints respondem com `EmpresaId` filtrado.
- [x] Dashboard mostra falhas de notificação (painéis criados).
- [ ] Status de certificado aparece como pronto/não pronto.
- [ ] Status de DNS aparece como verificado/não verificado.
- [x] Grafana reflete os mesmos números do backend.

## Grafana dashboard

Path: monitoring/dashboards/tenant-domain-health.json

Import steps:

1. Open Grafana → Dashboards → Manage → Import.
2. Upload `monitoring/dashboards/tenant-domain-health.json` or paste JSON.
3. Select Prometheus data source and import.
4. Use the `Tenant (empresa_id)` variable to filter by tenant. For "All", leave empty.

Panels included:
- Notifications Sent (per tenant) — `sum by (empresa_id) (notifications_sent_total)`
- Notification Attempts (per tenant) — `sum by (empresa_id) (notifications_attempts_total)`
- Notifications Failed (per tenant) — `sum by (empresa_id) (notifications_failed_total)`
- Notifications In Flight (per tenant) — `sum by (empresa_id) (notifications_in_flight)`

Acceptance:
- Import succeeds without errors.
- Selecting a tenant filters all panels to that `empresa_id`.
- Numbers match Prometheus queries run from the backend metrics.
