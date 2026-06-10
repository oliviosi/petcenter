# Proposal: Expose custom-domain notification fields in public profile

Summary
- Ensure the backend public profile endpoint returns the custom-domain notification metadata added to Empresa so the frontend can reliably render the latest notification outcome.

Why
- Frontend was updated to display last-notification fields, but GetEmpresaPublicProfile currently doesn't populate them — causing a contract mismatch.
- Fixing the endpoint is small, low-risk, and unlocks UI visibility and end-to-end validation.

Scope
- Update GetEmpresaPublicProfileService to include the following fields in the response DTO: 
  - DominioPersonalizadoUltimaNotificacaoCategoria
  - DominioPersonalizadoUltimaNotificacaoMotivo
  - DominioPersonalizadoUltimaNotificacaoEnviadaEm
  - DominioPersonalizadoUltimaNotificacaoResultado
  - DominioPersonalizadoUltimaNotificacaoTentativas
- Add unit tests for the mapper and service
- Add an integration/e2e test verifying the frontend mapping can read and render the fields (or a backend-only contract test if full e2e is out of scope)

Acceptance criteria
- GET /api/public/profile (or equivalent) includes the named fields with correct values when present
- Unit tests added and passing
- OpenSpec tasks updated and change ready to propose/archive after verification

Risks & mitigations
- Risk: leaking internal details. Mitigation: fields are already tenant-scoped and are safe to show in admin profile (confirmed by previous design decisions).
- Risk: breaking public API shape. Mitigation: add fields as optional and keep existing keys intact; frontend already reads multiple alternative keys.

Estimated effort
- 1–2 developer-days including tests and a small e2e/contract test (less if backend-only)

Next steps
1. Implement service/DTO mapping change
2. Add unit + contract tests
3. Run backend tests and optionally frontend contract test
4. Mark OpenSpec tasks done and propose archive
