# Tasks — tenant-custom-domain-notifications-finalize

Status: draft

## Frontend

- [x] 1. Criar branch `feat/notifications-frontend-contract` e implementar testes de contrato (Vitest) que chamem GET /api/public/profile e validem chaves opcionais.
  - Est: 2h
  - Artefato: `apps/frontend/tests/contract/notification-contract.test.ts`

- [x] 2. Criar e2e Playwright test que publica evento sintético (ou usa endpoint de teste) e valida UI render.
  - Est: 4h
  - Artefato: `apps/frontend/tests/e2e/notifications.spec.ts`

- [x] 3. Abrir PR frontend com descrição curta e link para backend change; pedir revisão do time frontend.
  - Est: 1h

## Ops & Docs

- [x] 4. Criar PR ops/runbook com `openspec/.../migration.sql` e ops_apply_instructions.md; pedir ops aplicar em staging.
  - Est: 1h

- [x] 5. Add env var defaults to platform config and document: NOTIFY_MAX_ATTEMPTS, NOTIFY_RETRY_BASE_MS, EMAIL_FROM_ADDRESS.
  - Est: 1h

- [x] 6. Add metrics + alerting: notifications_sent_total (labels: result), notifications_attempts_total. Create alert rule for failure rate > 20% over 5m.
  - Est: 2h

## Validation / CI

- [x] 7. Add a CI job to run frontend contract tests against staging after deploy (or run locally against staging URL).
  - Est: 2h

- [ ] 8. Perform smoke validation in staging:
  - Backup DB
  - Apply migration (if not yet applied)
  - Deploy backend
  - Trigger synthetic degraded/recovered events
  - Verify records, metrics, and frontend rendering
  - Est: 2–4h

## Acceptance

- [ ] 9. Merge frontend PR and ops PR; deploy to staging and confirm smoke tests green.
- [ ] 10. Mark both OpenSpec changes ready for archive.

---

Notes:
- Prefer small PRs: contract tests first, then e2e.
- For publishing synthetic events in CI, coordinate with platform to accept a protected test endpoint or use a test queue.
