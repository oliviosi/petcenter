# Design — Tenant Custom Domain Notifications

Overview
- NotificationService interface and EmailNotificationProvider implementing transactional sends via existing email infra (or a simple SMTP/sendgrid adapter).
- Persist latest notification metadata on Empresa or tenant_domains_status: category, reason, sent_at, outcome, attempts.

Flow
1. Monitoring detects state transition to `degraded` or `recovered`.
2. Monitoring publishes event `tenant.domain.status.changed` with payload { tenantId, domain, state, reason }.
3. NotificationService subscribes, checks deduplication state, attempts send, persists outcome and increments attempt count on failure.
4. UI/Admin surfaces latest notification context.

Retries and delivery
- Exponential backoff for transient email failures; configurable max attempts.
- Log failed deliveries and expose outcome in /admin/profile.

Security and privacy
- Use EmpresaId scoping for reads; emails sent only to tenant admin addresses on record.

Testing
- Unit tests for deduplication and retry logic; integration tests with a test SMTP provider.
