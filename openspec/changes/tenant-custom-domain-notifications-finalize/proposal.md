# Proposal: Finalizar tasks pendentes — Tenant Custom Domain Notifications

Data: 2026-06-10
Autores: Auto-agent (draft)

Resumo
- Concluir as tasks pendentes do change `tenant-custom-domain-notifications-extension` para torná-lo pronto para merge e deploy.

Objetivos
- Entregar PRs e testes e2e/contract para frontend que validem os novos campos expostos no endpoint público.
- Fornecer instruções operacionais sucintas e aplicar a migration em staging (ou fornecer artefato SQL pronto para ops).
- Adicionar verificação de monitoramento/alerta e documentar configurações.
- Validar fim-a-fim em staging e marcar o change original pronto para arquivar.

Por que
- Backend já expôs campos e testes backend passaram, mas frontend, ops e validação final estão pendentes. Finalizar reduz risco de regressão e garante visibilidade para tenants.

Escopo
- Criar PR frontend com testes (Vitest/Playwright) que assertam presença e renderização segura dos campos opcionais.
- Criar PR ops/runbook que instrui aplicação do migration.sql e verificação pós-deploy.
- Adicionar métricas simples (contador de notificações sentas/erros) e alerta de taxa de falha.
- Gerar checklist de validação e script de smoke tests para staging.

Critérios de aceitação
- Frontend PR aprovado ou testes e2e verdes em staging.
- Migration aplicada em staging; backend registra notificações e DTO público inclui campos.
- Métricas e alerta configurados em staging.
- OpenSpec change original pode ser marcado como pronto para arquivar.
