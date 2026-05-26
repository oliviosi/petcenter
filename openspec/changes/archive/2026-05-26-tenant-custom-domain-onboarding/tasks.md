## 1. Domain onboarding model and admin surface

- [x] 1.1 Add tenant-facing storefront domain state handling for desired domain registration, DNS guidance, verification progress, activation, failure, and removal.
- [x] 1.2 Extend the `/admin/profile` storefront console to show the desired domain, required DNS record details, and the current onboarding state inside the existing storefront management flow.

## 2. Canonical link and fallback behavior

- [x] 2.1 Update storefront link management so the canonical shareable URL switches between the shared-host fallback and the active custom domain.
- [x] 2.2 Keep fallback guidance explicit while a custom domain is pending or fails verification, so tenants always know which URL should be shared now.

## 3. Public shell host-aware entry

- [x] 3.1 Add host-aware storefront resolution so an active tenant custom domain opens the correct petshop storefront without relying on slug discovery.
- [x] 3.2 Preserve and validate the existing shared-host slug route as the fallback public entry when no active custom domain exists or onboarding is reverted.

## 4. Validation and documentation

- [x] 4.1 Add or update tests covering domain onboarding states, canonical link switching, and host-based storefront entry with fallback behavior.
- [x] 4.2 Update documentation to describe the custom-domain onboarding flow, canonical URL rules, and fallback behavior for storefront access.
