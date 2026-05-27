## 1. Backend verification lifecycle

- [x] 1.1 Extend the `Empresas` domain and persistence model with automated verification metadata such as last attempt, next retry, activation timestamp, and recoverable failure details.
- [x] 1.2 Implement tenant-scoped verification state transitions that schedule retries, record outcomes, auto-activate verified domains, and reset automation state when the desired domain changes or is removed.
- [x] 1.3 Add configuration-backed verification target settings and a DNS verification service that can evaluate whether a desired storefront domain points to the expected destination.

## 2. Background processing and API contract

- [x] 2.1 Add a backend background execution path that periodically selects eligible desired domains and runs idempotent verification attempts.
- [x] 2.2 Update tenant storefront API responses and request handling to expose automated verification progress, latest outcome, retry timing, and activation timing without breaking the shared-host fallback contract.
- [x] 2.3 Cover the backend flow with tests for successful activation, recoverable failure with retry scheduling, and reset behavior when the desired domain is updated or removed.

## 3. Frontend storefront operations visibility

- [x] 3.1 Update the admin `/admin/profile` storefront experience to show automated verification progress, latest outcome messaging, retry-oriented guidance, and activation timing alongside the canonical link.
- [x] 3.2 Preserve shared-host canonical-link behavior in the UI until automated verification activates the custom domain, including failed-verification fallback messaging.
- [x] 3.3 Add frontend tests for automated verification states, canonical-link transitions, and recoverable failure presentation.
