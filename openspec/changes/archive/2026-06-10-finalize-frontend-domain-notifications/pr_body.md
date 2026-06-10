Título: Finaliza testes frontend para Notificações de Domínio

Resumo
- Adiciona teste de contrato (Vitest) com fallback para fixture e esqueleto E2E (Playwright).
- Objetivo: validar que o frontend consome/exibe os campos dominio_personalizado_ultima_notificacao_* e permitir CI contra staging.

Mudanças principais
- apps/frontend/src/test/contract.profile.test.ts
- apps/frontend/src/test/fixtures/profile.degraded.json
- apps/frontend/src/test/e2e.domain-notification.test.ts
- openspec/changes/finalize-frontend-domain-notifications/*

Como testar local
1. cd apps/frontend
2. npm ci
3. npm run test
4. npx playwright install && npx playwright test

Requisitos CI / Secrets
- STAGING_API_URL (Actions secret)
- STAGING_FRONTEND_URL (Actions secret)
- Workflow: .github/workflows/contract-tests-staging.yml

Checklist (pré-merge)
- [ ] Branch alvo: openspec/tenant-custom-domain-notifications-finalize
- [ ] STAGING_API_URL e STAGING_FRONTEND_URL adicionados nos Secrets
- [ ] Contract tests passam localmente e em CI
- [ ] E2E baseline executa ou está marcado como manual
- [ ] PR vinculado ao PR/backend com migration e mapeamento EF
- [ ] Reviewers: frontend lead, QA, Ops
- [ ] Atualizar README/frontend com instruções de teste
- [ ] Confirmar painéis/alertas de metrics visíveis em staging (notifications_attempts_total, notifications_sent_total)

Notas
- Contract test usa fixture quando STAGING_API_URL não configurado; execute novamente contra staging após Ops aplicar a migration.
