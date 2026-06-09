# Tasks — Expose custom-domain notification fields in public profile

- [x] 1. [backend] Update GetEmpresaPublicProfileService to populate notification fields in the response DTO (optional fields).
- [x] 2. [backend] Add unit tests for the DTO mapping and service behavior.
- [x] 3. [backend] Add a contract/integration test that the API returns fields when Empresa has notification metadata.
- [ ] 4. [ci/ops] If migration not applied in environments, document the `dotnet ef database update` steps in runbook and coordinate applying in staging.
- [ ] 5. [docs] Update changelog / OpenSpec to reference the fix and verification steps.

Notes:
- Keep fields optional to avoid breaking clients.
- Keep naming consistent with the columns added in the migration; prefer Portuguese field names to match domain.
