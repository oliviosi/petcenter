## 1. Backend apex-domain support

- [x] 1.1 Extend the `Empresas` domain and validation logic so a desired storefront domain can be classified and accepted as either subdomain or apex/root domain.
- [x] 1.2 Add configuration-backed apex verification targets and update DNS verification logic to validate supported apex-domain resolution outcomes without breaking the existing subdomain flow.
- [x] 1.3 Ensure the existing TLS-readiness and final activation pipeline works unchanged after apex DNS verification succeeds.

## 2. API and operational contract

- [x] 2.1 Update tenant storefront API responses to expose the desired domain mode and the correct onboarding guidance for apex versus subdomain setup.
- [x] 2.2 Update admin request handling and validation messages so apex/root domains are accepted only when they match the supported onboarding rules.
- [x] 2.3 Add backend tests covering apex-domain acceptance, apex DNS verification success/failure, and staged readiness handoff into TLS provisioning.

## 3. Frontend onboarding experience

- [x] 3.1 Update the admin `/admin/profile` storefront experience to explain whether the desired domain is apex or subdomain and to present the correct DNS instructions for that mode.
- [x] 3.2 Preserve canonical-link and fallback behavior so a fully ready apex domain becomes canonical exactly like a fully ready subdomain.
- [x] 3.3 Add frontend tests for apex-specific onboarding guidance, readiness messaging, and canonical-link behavior.
