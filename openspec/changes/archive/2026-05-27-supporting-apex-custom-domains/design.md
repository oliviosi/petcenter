## Context

The storefront custom-domain pipeline now supports staged DNS verification and TLS readiness, but it still treats the domain setup experience as subdomain-first. That works well for `agenda.petshop.com.br`, where a CNAME-based flow is straightforward, yet many tenants will expect to use the root domain itself, such as `petshop.com.br`. Apex domains introduce a different DNS reality because the root cannot always use the same record strategy as a subdomain.

This change extends the existing custom-domain pipeline rather than replacing it. The platform already has onboarding, DNS verification, TLS readiness, and canonical activation; the gap is that the flow does not yet describe or validate apex domains with a provider-agnostic strategy. The next slice should support apex domains without coupling the product to one DNS provider or CDN.

## Goals / Non-Goals

**Goals:**
- Allow tenants to register either a subdomain or an apex/root domain for the storefront.
- Provide different DNS guidance depending on whether the desired domain is apex or subdomain.
- Support apex-domain verification using provider-agnostic readiness rules.
- Preserve the existing staged pipeline: DNS verification first, TLS readiness second, canonical activation last.
- Keep canonical link behavior identical regardless of whether the fully ready domain is apex or subdomain.

**Non-Goals:**
- Automating DNS record creation inside registrar or provider dashboards.
- Supporting arbitrary provider-specific DNS concepts beyond the minimum strategies needed for apex onboarding.
- Reworking the TLS readiness flow introduced in the previous change.
- Expanding the same slice into wildcard domain support.

## Decisions

### 1. Treat apex and subdomain as two onboarding modes with shared activation stages
The system should distinguish the desired domain type during onboarding, but both modes should feed the same downstream stages: DNS verification, TLS readiness, and activation.

**Why this approach**
- Tenants need different DNS instructions for apex versus subdomain.
- The later stages do not need a separate activation model; they only need a verified domain that points to the expected platform target.
- It keeps the lifecycle understandable while minimizing duplicated logic.

**Alternatives considered**
- Keep one generic onboarding flow with no explicit mode distinction: rejected because the DNS guidance becomes vague and error-prone.

### 2. Verify apex domains by resolved target outcome, not by inspecting provider-specific record types
The backend should determine readiness through the resolved DNS result rather than requiring direct knowledge of whether the tenant used ALIAS, ANAME, flattened CNAME, or A/AAAA records.

**Why this approach**
- It stays provider-agnostic.
- It allows different DNS providers to satisfy the contract in different ways as long as the domain resolves to the platform’s expected target.
- It builds naturally on the current verification architecture, which already compares resolved outcomes.

**Alternatives considered**
- Require one specific record type for apex domains: rejected because provider capabilities vary too much.

### 3. Introduce explicit configuration for apex verification targets
The platform should define configurable apex verification expectations separately from subdomain expectations, such as allowed IPv4/IPv6 targets or other resolved endpoints that represent the storefront edge.

**Why this approach**
- Apex domains often cannot reuse a hostname-only CNAME model.
- Separate configuration makes onboarding instructions and verification logic accurate without overloading the current subdomain target setting.
- It keeps deployment-specific details outside code.

**Alternatives considered**
- Reuse the existing subdomain verification target for apex automatically: rejected because apex often needs different operational targets.

### 4. Keep TLS readiness unchanged after DNS verification succeeds
Once an apex domain passes DNS verification, it should enter the same TLS readiness stage used for subdomains.

**Why this approach**
- HTTPS readiness is orthogonal to whether the domain is apex or subdomain.
- Reusing the same stage avoids multiplying operational states unnecessarily.

**Alternatives considered**
- Create a separate TLS path for apex domains: rejected because it adds complexity without a distinct tenant-facing benefit.

### 5. Show apex-specific DNS guidance in `/admin/profile`
The admin console should explicitly tell the tenant whether the desired domain is apex or subdomain and present the appropriate DNS guidance for that mode.

**Why this approach**
- The onboarding UX is where confusion is most likely.
- Tenants need a clear answer to “what record do I create?” before the automated pipeline can help them.

**Alternatives considered**
- Only handle apex logic in backend validation and keep the UI generic: rejected because it would increase support burden and trial-and-error.

## Risks / Trade-offs

- **[Apex DNS strategies vary across providers]** → Mitigation: validate resolved outcomes and document accepted patterns instead of forcing one provider-specific record type.
- **[Onboarding messaging becomes more complex]** → Mitigation: present a simple branch: subdomain instructions versus apex instructions.
- **[Deployment environments may need multiple apex targets]** → Mitigation: keep apex verification targets configurable rather than hardcoded.
- **[Users may confuse root and www behavior]** → Mitigation: be explicit that apex and subdomain are separate choices with different DNS expectations.
- **[Supporting apex may raise expectations for wildcard domains]** → Mitigation: keep wildcard domains explicitly out of scope in the proposal and UI copy.

## Migration Plan

1. Add domain-type awareness plus apex verification configuration to the backend.
2. Update onboarding and verification logic so apex domains use the supported root-domain verification strategy.
3. Extend `/admin/profile` responses and UI to show apex-specific guidance.
4. Reuse the existing TLS readiness and activation pipeline once apex DNS verification succeeds.
5. Rollback by disabling apex acceptance and leaving existing subdomain behavior unchanged.

## Open Questions

- Should the first production slice allow both direct A/AAAA guidance and provider-flattened ALIAS/ANAME guidance in the UI, or keep the copy narrower?
- Does the platform need to surface a recommendation about `www` redirection alongside apex onboarding in the first slice?
- Should apex and subdomain type be persisted explicitly, or inferred from the desired domain each time?
