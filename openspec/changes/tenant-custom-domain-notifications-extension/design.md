# Design — Tenant Custom Domain Notifications Extension

Date: 2026-06-10

## Overview

Extend the existing domain-notifications work by adding a durable record of notification attempts and exposing the latest notification metadata to the public/admin DTOs. Provide robust deduplication and retry behavior for email notifications on `degraded` and `recovered` state transitions.

## Data model

Option A (preferred): Add `tenant_domain_notifications` table:

- id UUID PRIMARY KEY
- empresa_id UUID NOT NULL
- domain TEXT NOT NULL
- category TEXT NOT NULL -- e.g. "degraded" | "recovered"
- reason TEXT NULL
- sent_at TIMESTAMP WITH TIME ZONE NULL
- outcome TEXT NULL -- "success" | "failure" | "retrying"
- attempts INTEGER DEFAULT 0
- last_error TEXT NULL
- created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
- updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()

Rationale: separate table decouples notifications history from domain status, simplifies auditing and future multi-channel support.

Alternative: extend `tenant_domains_status` with last-notification columns (simpler migration, less audit history).

## Event flow

1. Monitoring process detects transition and publishes `tenant.domain.status.changed` with { tenantId, domain, state, reason, detectedAt }.
2. NotificationService subscribes to that event.
3. NotificationService checks for in-flight/deduplicated notifications for the same (tenantId, domain, category). If an unhandled notification exists with attempts < maxAttempts and not succeeded, treat as retry candidate; otherwise create new notification record.
4. NotificationService composes email using tenant admin contact and templates; persists attempt (increment attempts, set sent_at, outcome) after provider result.
5. On transient failure, schedule retry via background job (delayed message) using exponential backoff: delay_ms = base_ms * (2 ^ (attempts - 1)). Config keys: NOTIFY_RETRY_BASE_MS, NOTIFY_MAX_ATTEMPTS.
6. UI reads the latest notification record (most recent by sent_at or created_at) and maps to public DTO fields.

## Idempotency & deduplication

- Deduplicate by unique key: (empresa_id, domain, category, cycle_id)
- `cycle_id` can be the state-change event id or composed from state+detectedAt rounded to minute precision to avoid duplicates from noisy detectors.
- Only create a new notification if no successful notification exists for same cycle_id.

## Retry strategy

- Configurable: base_ms (default 10s), multiplier 2, max_attempts (default 3).
- On failure, mark outcome="retrying" and schedule background retry with delayed job or queue message.
- On permanent failure (attempts >= max_attempts), mark outcome="failure" and include last_error for operator visibility.

## Provider abstraction

- Keep `INotificationService` / `IEmailNotificationProvider` interface used by previous change.
- Implement transactional persistence: create/increment attempts in DB in same transaction that records scheduled retry metadata.

## Public DTO mapping

- Map latest notification record to these optional fields:
  - DominioPersonalizadoUltimaNotificacaoCategoria
  - DominioPersonalizadoUltimaNotificacaoMotivo
  - DominioPersonalizadoUltimaNotificacaoEnviadaEm
  - DominioPersonalizadoUltimaNotificacaoResultado
  - DominioPersonalizadoUltimaNotificacaoTentativas

- Keep fields optional; do not change existing keys.

## Security & privacy

- Only tenant-scoped metadata is returned. No PII beyond the safe reason/message should be exposed. Emails sent only to tenant admins configured in system.

## Testing

- Unit tests for deduplication logic, backoff calculation, mapper.
- Integration tests using a test SMTP provider (or local fake) verifying attempts and outcome persistence.
- Contract test: backend public profile DTO includes optional fields (backend-only contract test allowed if frontend e2e not available).

## Ops/runbook notes

- Document config defaults and how to tune retry/backoff.
- Provide steps to re-send failed notifications and how to silence notifications for a tenant.

## Tradeoffs

- Separate table increases schema complexity but enables audit + multi-channel. Extending existing table is easier but less flexible.
- Using delayed-job vs scheduler: delayed-job via queue keeps control in app, scheduler requires additional infra.


-- end --
