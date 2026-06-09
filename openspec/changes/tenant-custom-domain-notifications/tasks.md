# Tasks — Tenant Custom Domain Notifications

- [x] 1. [backend] Add notification metadata to persistence (migration to tenant_domains_status or add table `tenant_domain_notifications`).
- [x] 2. [backend] Implement `INotificationService` and `EmailNotificationProvider` wiring to existing email infra.
- [x] 3. [backend] Subscribe NotificationService to `tenant.domain.status.changed` events and implement deduplication logic.
4. [backend] Implement retry/backoff strategy and record delivery outcomes.
5. [backend] Add tests: unit for deduplication, integration for send and outcome persistence.
6. [frontend] Surface latest notification outcome in `/admin/profile` (already planned in other changes—coordinate).
7. [ops] Add config: NOTIFY_MAX_ATTEMPTS, NOTIFY_RETRY_BASE_MS, EMAIL_FROM_ADDRESS.
8. [docs] Update OpenSpec and runbook for notification failures.

Notes:
- Start with email only. Additional channels (webhooks/SMS) can be added later as separate changes.
- Preserve multi-tenancy rules. Do not accept EmpresaId from request body.
