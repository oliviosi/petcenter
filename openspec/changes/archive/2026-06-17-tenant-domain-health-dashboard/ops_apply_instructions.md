# Instruções para Ops — tenant-domain-health-dashboard

## Comando psql

```bash
psql "<STAGING_DATABASE_URL>" -f "openspec\changes\tenant-domain-health-dashboard\migration.sql"
```

## Config keys

- `DOMAIN_HEALTH_METRICS_ENABLED`
- `GRAFANA_DASHBOARD_FOLDER`
- `DNS_VERIFICATION_POLL_INTERVAL`
- `CERTIFICATE_READINESS_POLL_INTERVAL`
- `DOMAIN_NOTIFICATIONS_TABLE`

## Observações

- Executar primeiro em staging.
- Validar isolamento por tenant antes de promover.
- Se a migration não existir ainda, manter o caminho como referência para a aplicação futura.
