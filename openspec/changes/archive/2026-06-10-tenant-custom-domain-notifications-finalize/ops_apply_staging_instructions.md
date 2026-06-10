# Instruções para Ops — aplicar migration em staging

Resumo:
- Arquivo de migração: openspec/changes/tenant-custom-domain-notifications-extension/migration.sql
- Objetivo: adicionar colunas de notificação de domínio em tabela `empresas` em staging.

Checklist antes de aplicar:
1. Fazer backup do banco de staging em um caminho seguro fora do repositório.
2. Garantir janela curta de manutenção ou horário de baixa atividade.
3. Aplicar em uma réplica ou em staging isolado (não em produção).

Comandos sugeridos (ajustar host/port/usuario/db conforme ambiente):

# Backup (formato custom)
pg_dump -Fc "${STAGING_DATABASE_URL}" -f "<secure-backup-path>/backup_pre_migration.dump"

# Aplicar migration SQL
psql "${STAGING_DATABASE_URL}" -f openspec/changes/tenant-custom-domain-notifications-extension/migration.sql

# Verificar colunas adicionadas
psql "${STAGING_DATABASE_URL}" -c "\d empresas"
# ou checar existência via SQL
psql "${STAGING_DATABASE_URL}" -c "SELECT column_name FROM information_schema.columns WHERE table_name='empresas' AND column_name LIKE 'dominio_personalizado_ultima_notificacao%';"

Rollback (se necessário):
-- Remova somente se for seguro e após validar não haver dados críticos dependentes
ALTER TABLE empresas DROP COLUMN IF EXISTS dominio_personalizado_ultima_notificacao_categoria;
ALTER TABLE empresas DROP COLUMN IF EXISTS dominio_personalizado_ultima_notificacao_motivo;
ALTER TABLE empresas DROP COLUMN IF EXISTS dominio_personalizado_ultima_notificacao_resultado;
ALTER TABLE empresas DROP COLUMN IF EXISTS dominio_personalizado_ultima_notificacao_tentativas;

Passos pós-migração:
1. Deploy do backend em staging (use a mesma imagem que passará por validação).
2. Rodar smoke tests: endpoint health e executar testes de contrato (script CI abaixo).
3. Executar testes manuais rápidos: criar/atualizar Empresa e disparar evento de notificação sintética (veja runbook.md).
4. Verificar métricas: notifications_attempts_total e notifications_sent_total (monitoramento configurado).

Checklist de validação em staging:
- [ ] Backup concluído
- [ ] Migration aplicada com sucesso
- [ ] Colunas `dominio_personalizado_ultima_notificacao_*` verificadas
- [ ] Backend redeployado
- [ ] Contract tests contra staging executados
- [ ] Smoke test de frontend executado
- [ ] Métricas `notifications_attempts_total` e `notifications_sent_total` conferidas

Observações:
- Não há credenciais neste documento. Use variáveis de ambiente seguras (STAGING_DATABASE_URL).
- Se desejar, posso abrir issue/PR com estas instruções ou gerar um ticket formatado para Slack/email.
