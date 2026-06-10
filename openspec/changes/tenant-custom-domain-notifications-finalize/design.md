# Design — Finalizar tasks pendentes

Visão geral
- Não haverá mudanças de runtime no backend além do que já foi implementado. O trabalho aqui é coordenar frontend, ops e CI para validar e entregar o change.

Frontend
- Implementar testes de contrato que chamam GET /api/public/profile e verificam a presença (quando aplicável) das chaves:
  - DominioPersonalizadoUltimaNotificacaoCategoria
  - DominioPersonalizadoUltimaNotificacaoMotivo
  - DominioPersonalizadoUltimaNotificacaoEnviadaEm
  - DominioPersonalizadoUltimaNotificacaoResultado
  - DominioPersonalizadoUltimaNotificacaoTentativas
- Implementar e2e Playwright test que: publica evento sintético na fila (ou aciona worker), aguarda persistência, e verifica UI render.
- Garantir frontend verifica fields com safe checks (existência/null) antes de render.

Ops
- Aplicar openspec/.../migration.sql em staging usando psql ou migration tool.
- Garantir configuração de env vars: NOTIFY_MAX_ATTEMPTS, NOTIFY_RETRY_BASE_MS, EMAIL_FROM_ADDRESS.
- Criar métricas:
  - notifications_sent_total{result="success|failure"}
  - notifications_attempts_total
- Configurar alerta: rate(notifications_sent_total{result="failure"}[5m]) / rate(notifications_sent_total[5m]) > 0.2 -> page ops

CI/Validation
- Adicionar job no pipeline frontend para rodar o contract test (via curl/jq or Playwright headless) apontando para staging URL.
- Smoke test script (bash) para executar pós-deploy: publish event -> wait -> curl profile -> assert fields.

Rollback & segurança
- Rollback: DB restore or drop columns (via rollback SQL). Prefer restore from backup.
- Não expor dados sensíveis nos fields; frontend deve render apenas mensagens curtas e obscuras quando necessário.

Notas
- Onde for difícil emular event bus em CI, usar um test API endpoint que dispare a mesma lógica (instrumented endpoint protegida por feature flag) temporariamente para testes.
