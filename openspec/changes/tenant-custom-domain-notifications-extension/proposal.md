# Proposal: Extending Tenant Custom Domain Notifications

Date: 2026-06-10
Authors: Projeto Petcenter (draft)

## Summary

Deliver improvements to the tenant custom-domain notification system (email) and expose the latest notification metadata in public/admin profiles so tenants and operators can see context and outcomes.

## Why

- Tenants must be notified proactively when their custom domain degrades or recovers.
- The frontend already expects fields describing the last notification; backend must provide them to fix a contract mismatch.
- Improved visibility reduces support load and speeds remediation.

## Scope

This change will:

- Persist notification metadata for tenant custom-domains (either by extending `tenant_domains_status` or adding a dedicated `tenant_domain_notifications` table). The metadata includes:
  - category (e.g., `degraded`, `recovered`)
  - reason / message
  - sent_at (timestamp)
  - outcome (success|failure)
  - attempts (integer)

- Implement or extend NotificationService with:
  - subscription to `tenant.domain.status.changed` events
  - deduplication per state-cycle (exactly-one per transition)
  - configurable retries with exponential backoff and a max attempts limit
  - outcome persistence for each send attempt

- Expose optional fields on the public profile endpoint (GET /api/public/profile or equivalent) so the frontend can render latest notification context. Add these optional keys to the public DTO:
  - DominioPersonalizadoUltimaNotificacaoCategoria
  - DominioPersonalizadoUltimaNotificacaoMotivo
  - DominioPersonalizadoUltimaNotificacaoEnviadaEm
  - DominioPersonalizadoUltimaNotificacaoResultado
  - DominioPersonalizadoUltimaNotificacaoTentativas

- Add a migration, unit and integration tests, and update runbook and OpenSpec artifacts.

Out of scope:
- New notification channels (webhooks/SMS) — can be separate follow-up changes.
- UI/UX redesign beyond surfacing the existing fields.

## Acceptance criteria

- The public profile endpoint includes the named optional fields when notification data exists for the tenant.
- NotificationService sends emails on `degraded` and `recovered` transitions with deduplication.
- Retries use exponential backoff and stop after the configured max attempts; outcomes are recorded.
- Unit tests for mapper/service and integration tests for send+outcome persistence are added and passing.
- Runbook updated describing operators' steps and failure modes.

## Risks & mitigations

- Risk: leaking internal or sensitive information to the public profile. Mitigation: fields are optional and limited to safe, tenant-scoped metadata; verify contents in review.
- Risk: notification spam/noise. Mitigation: deduplication and max attempts; consider rate-limiting per tenant.
- Risk: config drift between environments. Mitigation: document defaults and require ops review for production tuning.

## Estimated effort

- 2–4 developer-days (backend work + tests + runbook). Less if backend-only contract tests suffice.

## Next steps

1. Implement persistence migration and data model.
2. Implement/extend NotificationService (dedup + retries) and wire email provider.
3. Map notification metadata into public profile DTO and add tests.
4. Update runbook and OpenSpec tasks (tasks.md).
5. Validate end-to-end with frontend contract test or small e2e.

---

Do you want this draft saved as openspec/changes/tenant-custom-domain-notifications-extension/proposal.md? It has been created as a draft in the repository.