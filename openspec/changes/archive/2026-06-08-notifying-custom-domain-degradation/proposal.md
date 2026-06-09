## Why

The platform now detects when an active custom storefront domain degrades and safely falls back to the shared-host canonical URL, but the tenant only learns about that regression if they happen to open the admin console. That leaves an operational gap because degraded domains are now observable by the system yet not surfaced proactively to the tenant who needs to react or verify the recovery.

## What Changes

- Add tenant-facing notifications when a previously active custom domain degrades after activation.
- Add recovery notifications when the degraded domain becomes healthy again and regains canonical status.
- Define initial delivery rules for operational domain notifications, including deduplication so repeated monitoring checks do not spam the tenant.
- Extend the admin storefront experience to show the latest degradation/recovery notification context for the current custom domain.
- Keep the current monitoring and fallback behavior unchanged; this slice adds proactive communication on top of the existing readiness pipeline.

## Capabilities

### New Capabilities
- `tenant-custom-domain-notifications`: tenant-facing notification rules for degraded and recovered custom storefront domains.

### Modified Capabilities
- `tenant-active-domain-monitoring`: degraded and recovered monitoring outcomes must produce tenant-visible notification events in addition to operational state changes.
- `tenant-public-profile-console`: `/admin/profile` must expose the latest custom-domain notification context so the tenant can understand what alert was sent and why.

## Impact

- Backend `Empresas` lifecycle and monitoring workflow to emit and persist notification-worthy domain events.
- Tenant admin API contracts and frontend messaging in `apps/frontend` for latest domain alert context.
- Initial notification delivery infrastructure, such as admin-surface alerts and/or transactional outbound messages.
- OpenSpec requirements for domain monitoring and tenant-facing notification behavior.
