# Tasks — tenant-custom-domain-notifications-extension

Status: draft

## Backend

- [x] 1. Create DB migration to add `tenant_domain_notifications` table (or extend `tenant_domains_status`).
  - Note: Entity already contains latest notification fields. Added EF mapping in EmpresaConfiguration.
  - Migration script created at `openspec/changes/tenant-custom-domain-notifications-extension/migration.sql` for ops to apply via psql or run using EF if desired.
  - Est: 3–4h (script produced)
- [x] 2. Implement domain notification repository and model (EF Core entity + mapping).
  - Note: Empresa entity already had notification fields; mapping added in EmpresaConfiguration.
  - Est: 2–4h (done)
- [x] 3. Extend/implement NotificationService subscription to `tenant.domain.status.changed` event.
  - Note: StorefrontDomainVerificationService invokes INotificationService on degraded/healthy transitions; worker runs in background.
  - Est: 4–8h (done)
- [x] 4. Wire EmailNotificationProvider (reuse existing email infra). Add transactional persistence (attempts/outcome updates).
  - Note: EmailNotificationProvider implemented and persisting to Empresa via RegistrarNotificacaoDominioPersonalizado.
  - Est: 3–6h (done)
- [x] 5. Implement retry scheduling (delayed queue message or background worker) with exponential backoff; make retry configs env-driven.
  - Note: Provider uses in-process retry loop with exponential backoff and configurable NotificationOptions. Consider later replacing with delayed job for non-blocking retries.
  - Est: 4–8h (implemented as in-process retries)
- [x] 6. Add unit tests: deduplication, backoff calc, mapper.
  - Note: EmailNotificationProvider unit tests exist (Api.Tests). Ran tests locally: all passing.
  - Est: 2–4h (done)
- [x] 7. Add integration tests: fake SMTP or test provider verifying persistence of outcomes and retry behavior.
  - Note: Added Api.Tests.EmailNotificationProviderIntegrationTests to simulate transient failures and verify retries/outcome persistence.
  - Est: 4–8h (done)
- [x] 8. Add mapping into GetEmpresaPublicProfileService DTO and unit tests for mapper.
  - Note: GetEmpresaPublicProfileService already maps notification fields; unit tests referencing mapping exist.
  - Est: 2–4h (done)

## Frontend

- [x] 1. Ensure frontend reads optional fields and renders notification context in admin/profile or public profile where applicable.
  - Est: 2–4h (coordination)
- [x] 2. Add contract/e2e test to validate public DTO shape if possible.
  - Est: 2–4h

## Ops & Docs

- [x] 1. Add config defaults: NOTIFY_RETRY_BASE_MS, NOTIFY_MAX_ATTEMPTS, EMAIL_FROM_ADDRESS.
- [x] 2. Update runbook with failure modes, steps to re-send and to silence notifications for a tenant.
- [x] 3. Monitor: add metric for notification outcomes and alert on increasing failure rate.

## Validation

- [x] 1. Run backend unit + integration tests; ensure pipeline passes.
- [x] 2. Run frontend contract/e2e tests or validate manually with frontend.

## Acceptance

- [ ] 1. Merge change and deploy to staging; validate notifications on synthetic degraded/recovered events.
- [ ] 2. Mark OpenSpec change ready for archive when tests + validation pass.


Notes:
- Prefer small incremental PRs: migration + model -> notification service -> provider & retries -> DTO mapping -> front-end contract.
- Coordinate with ops before enabling in production.
