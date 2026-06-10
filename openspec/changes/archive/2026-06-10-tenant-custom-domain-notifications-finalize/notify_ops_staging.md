Assunto: Aplicação de migration para Notificações de Domínio (staging)

Olá time de Ops,

Solicitação: aplicar a migration disponível em `openspec/changes/tenant-custom-domain-notifications-extension/migration.sql` no ambiente de *staging*.

Por favor, seguir as instruções em `openspec/changes/tenant-custom-domain-notifications-finalize/ops_apply_staging_instructions.md`.

Resumo rápido:
- Backup do DB antes
- Executar psql "${STAGING_DATABASE_URL}" -f openspec/.../migration.sql
- Validar colunas e rodar smoke tests

Checklist de merge / validação:
- [ ] PR de ops revisado
- [ ] Migration aplicada em staging
- [ ] Backend redeployado com a mesma imagem validada
- [ ] Contract tests do frontend executados contra staging
- [ ] Smoke tests e métricas conferidos
- [ ] Resultado registrado no change log

Marquem aqui quando concluído e coletem os logs de execução (stdout/stderr) para auditoria.

Obrigado.