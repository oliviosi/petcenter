## 1. Backend monitoring lifecycle

- [x] 1.1 Extend the `Empresas` custom-domain state model and persistence so active domains record post-activation healthy and degraded monitoring metadata.
- [x] 1.2 Update the background verification/readiness workflow so fully active domains remain eligible for DNS and HTTPS monitoring on a configurable cadence.
- [x] 1.3 Revert canonical activation to the shared-host fallback whenever post-activation monitoring detects degraded readiness, and restore the custom domain automatically after full readiness returns.

## 2. API and contract updates

- [x] 2.1 Update tenant storefront API responses to expose degraded-active monitoring context, including last healthy confirmation, latest degraded outcome, and current canonical fallback state.
- [x] 2.2 Update backend tests to cover active-domain monitoring, degraded DNS/TLS outcomes, fallback reactivation, and automatic recovery back to the custom domain.

## 3. Frontend storefront operations UX

- [x] 3.1 Update the admin `/admin/profile` storefront experience to explain when a previously active custom domain has become degraded and why the shared-host link is canonical again.
- [x] 3.2 Preserve copy/link behavior so the displayed canonical storefront URL switches safely between custom domain and shared-host fallback during degradation and recovery.
- [x] 3.3 Add frontend tests for degraded-active monitoring messaging, fallback canonical link behavior, and automatic recovery states.
