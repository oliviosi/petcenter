## 1. Backend readiness model

- [x] 1.1 Extend the `Empresas` domain and persistence model with certificate-readiness status, failure details, retry timing, and HTTPS-ready timestamps separate from DNS verification metadata.
- [x] 1.2 Update domain state transitions so DNS success moves the desired domain into TLS provisioning instead of activating it immediately, and only full readiness promotes the active custom domain.
- [x] 1.3 Add configuration-backed certificate-readiness checks that can evaluate whether the platform is ready to serve the custom domain securely without binding the implementation to a provider SDK.

## 2. Background processing and API contract

- [x] 2.1 Extend the backend background processing flow to continue polling certificate readiness after DNS verification succeeds and to keep retries idempotent across both stages.
- [x] 2.2 Update tenant storefront API responses and request handling to expose separate DNS-verification and TLS-readiness progress, latest outcomes, retry timing, and completion timestamps.
- [x] 2.3 Add backend tests covering DNS-to-TLS handoff, recoverable TLS-readiness failures, and final activation only after HTTPS readiness succeeds.

## 3. Frontend readiness visibility

- [x] 3.1 Update the admin `/admin/profile` storefront experience to show DNS progress and TLS provisioning progress as distinct steps, including blocked-by-certificate messaging.
- [x] 3.2 Preserve shared-host canonical-link behavior in the UI until certificate readiness succeeds, including preview and recoverable-failure messaging for partially ready domains.
- [x] 3.3 Add frontend tests for staged readiness messaging, canonical-link transitions, and fallback behavior while TLS readiness is still pending or has failed.
