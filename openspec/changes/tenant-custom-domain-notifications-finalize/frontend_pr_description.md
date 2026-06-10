Título do PR: Adiciona testes de contrato e E2E (domínio custom)

Descrição:
- Adiciona teste de contrato Vitest (`src/test/contract.profile.test.ts`) que valida campos opcionais de notificação de domínio no endpoint público `/api/public/profile`.
- Adiciona esqueleto de teste E2E (Playwright) em `src/test/e2e.domain-notification.test.ts` como ponto de partida para verificações UI contra staging.

Notas para reviewers:
- Os testes de contrato dependem da variável de ambiente `STAGING_API_URL` (definir em CI/secrets).
- O job de E2E requer `STAGING_FRONTEND_URL` e instalações do Playwright no runner.

Checklist sugerido para merge:
- [ ] Secrets `STAGING_API_URL` e `STAGING_FRONTEND_URL` configurados no repositório.
- [ ] CI: job que execute `npm ci && npm run test` para os testes de contrato.
- [ ] CI: job separado para Playwright e2e (opcional, mas recomendado após deploy de staging).

Arquivos adicionados:
- apps/frontend/src/test/contract.profile.test.ts
- apps/frontend/src/test/e2e.domain-notification.test.ts

Por favor, vinculem a pipeline de staging para rodar os testes de contrato automaticamente após o deploy.
