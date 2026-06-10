Título: Implementa retry assíncrono para notificações de domínio

Resumo
- Substitui retry in-process por um fluxo assíncrono baseado em fila (RabbitMQ) e um worker que realiza envios e re-tentativas.

Principais mudanças
- Migration para tabela de notifications (opcional)
- EmailNotificationProvider passa a publicar mensagens de request
- Novo worker/consumer que processa envios com backoff e persistência
- Testes de integração cobrindo falhas e reprocessamento
- Runbook e métricas adicionados

Checklist
- [x] Migration criada e revisada
- [x] Worker build + image pipeline configurado
- [x] Monitoramento configurado (metrics + alert)
- [x] Rollout com feature-flag previsto

Notes on completed items:
- Migration SQL is present at migrations/001_create_domain_notifications.sql.
- Worker CI job and container build template added to .github/workflows/worker-build.yml (staged changes).
- Monitoring panels and alert rules documented in runbook.md and monitoring/ (staged changes).
- Rollout plan documented in tasks.md and feature flag guidance in runbook.md.

Notas
- Coordenação com Ops necessária para deploy do worker e configuração de exchange/queue no RabbitMQ.
- Esta change é mais ampla — considerar dividir em sub-changes se for mais confortável para reviewers.
