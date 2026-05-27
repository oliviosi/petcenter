## Why

The custom-domain pipeline now supports staged DNS verification and TLS readiness, but it still assumes hostname patterns that are easiest to satisfy with subdomains. Many tenants will want to use their root domain (for example, `petshop.com.br`) as the storefront address, and the current flow does not yet define how apex domains are validated, instructed, or promoted safely.

## What Changes

- Add support for apex/root custom storefront domains alongside existing subdomain onboarding.
- Define tenant-facing DNS guidance for apex domains, including the expected record strategy when CNAME is not appropriate for the root domain.
- Extend automated domain verification so apex domains can pass readiness checks using the supported DNS patterns for root domains.
- Preserve the staged TLS/certificate-readiness pipeline after DNS validation, regardless of whether the desired domain is a subdomain or apex domain.
- Update the admin storefront experience to explain whether the desired domain is apex or subdomain, which DNS configuration is required, and why activation may still be blocked.

## Capabilities

### New Capabilities
- `tenant-apex-domain-support`: onboarding, verification, and readiness rules for apex/root storefront domains.

### Modified Capabilities
- `tenant-custom-domain-onboarding`: onboarding must support both subdomains and apex domains with different DNS guidance.
- `tenant-domain-verification-automation`: automated DNS verification must recognize supported apex-domain record strategies in addition to subdomain flows.
- `tenant-domain-certificate-readiness`: TLS readiness must work consistently after either subdomain or apex DNS verification succeeds.
- `tenant-public-profile-console`: `/admin/profile` must explain apex-specific DNS setup and staged readiness feedback.
- `tenant-storefront-link-management`: canonical-link behavior must remain consistent regardless of whether the fully ready custom domain is apex or subdomain.

## Impact

- Backend `Empresas` domain validation, DNS verification logic, and readiness services.
- Tenant admin API contracts and UI messaging in `apps/frontend` for apex-specific onboarding instructions.
- Environment/configuration expectations for root-domain DNS verification patterns.
- OpenSpec requirements for custom-domain onboarding, verification, TLS readiness, and canonical link management.
