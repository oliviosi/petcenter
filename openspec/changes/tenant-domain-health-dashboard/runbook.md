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

- [ ] Endpoints respondem com `EmpresaId` filtrado.
- [ ] Dashboard mostra falhas de notificação.
- [ ] Status de certificado aparece como pronto/não pronto.
- [ ] Status de DNS aparece como verificado/não verificado.
- [ ] Grafana reflete os mesmos números do backend.

