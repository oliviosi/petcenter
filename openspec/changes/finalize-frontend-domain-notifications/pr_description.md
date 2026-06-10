Título: Finaliza testes frontend para Notificações de Domínio

Resumo:
- Adiciona testes de contrato (Vitest) e e2e (Playwright) para validar que o frontend consome e exibe os campos de notificação de domínio.
- Inclui fixture de exemplo e componente `DomainNotificationBanner` (se necessário).

Checklist:
- [ ] STAGING_API_URL e STAGING_FRONTEND_URL configurados
- [ ] CI executa contract tests e e2e
- [ ] Testes verdes em PR

Arquivos principais:
- apps/frontend/src/test/contract.profile.test.ts
- apps/frontend/src/test/fixtures/profile.degraded.json
- apps/frontend/src/test/e2e.domain-notification.test.ts
- apps/frontend/src/components/DomainNotificationBanner.tsx (opcional)

Recomendações de reviewers: frontend lead, QA
