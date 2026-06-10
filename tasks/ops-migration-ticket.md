**Ticket: Aplicar migration — Notificações de Domínio (staging)**

Assign to: @ops-team
Labels: ops, staging, db-migration

Descrição:
Por favor aplicar a migration disponível em `openspec/changes/tenant-custom-domain-notifications-extension/migration.sql` no ambiente de *staging*.

Passos operacionais (copiar/colar):

1) Backup (formato custom):
```bash
pg_dump -Fc "${STAGING_DATABASE_URL}" -f /tmp/backup_pre_migration_$(date +%Y%m%d%H%M).dump
```

2) Aplicar migration:
```bash
psql "${STAGING_DATABASE_URL}" -f openspec/changes/tenant-custom-domain-notifications-extension/migration.sql
```

3) Verificar colunas adicionadas:
```bash
psql "${STAGING_DATABASE_URL}" -c "SELECT column_name FROM information_schema.columns WHERE table_name='empresas' AND column_name LIKE 'dominio_personalizado_ultima_notificacao%';"
```

4) Caso algo dê errado, rollback (execute apenas após validação):
```sql
ALTER TABLE empresas DROP COLUMN IF EXISTS dominio_personalizado_ultima_notificacao_categoria;
ALTER TABLE empresas DROP COLUMN IF EXISTS dominio_personalizado_ultima_notificacao_motivo;
ALTER TABLE empresas DROP COLUMN IF EXISTS dominio_personalizado_ultima_notificacao_resultado;
ALTER TABLE empresas DROP COLUMN IF EXISTS dominio_personalizado_ultima_notificacao_tentativas;
```

5) Pós-aplicação:
- Deploy do backend em staging
- Rodar smoke: GET /health e acionar workflow de contract tests
- Verificar métricas: notifications_attempts_total, notifications_sent_total

Checklist (marcar ao concluir):
- [ ] Backup criado
- [ ] Migration aplicada
- [ ] Colunas verificadas
- [ ] Backend deploy em staging
- [ ] Smoke e contract tests executados
- [ ] Métricas verificadas

Anexe logs e confirme conclusão aqui.
