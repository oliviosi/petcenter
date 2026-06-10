# Frontend contract / e2e checklist — tenant-custom-domain-notifications-extension

Purpose: validate that GET /api/public/profile includes optional notification fields and frontend renders them safely.

Steps (local/staging)

1. Ensure backend deployed with migration applied (see ops instructions).
2. Call the public profile endpoint for a tenant with a known notification record:

   curl -s -H "Accept: application/json" "$BACKEND_URL/api/public/profile/<TENANT_ID>" | jq '.'

3. Confirm the response includes (when present):
   - DominioPersonalizadoUltimaNotificacaoCategoria
   - DominioPersonalizadoUltimaNotificacaoMotivo
   - DominioPersonalizadoUltimaNotificacaoEnviadaEm
   - DominioPersonalizadoUltimaNotificacaoResultado
   - DominioPersonalizadoUltimaNotificacaoTentativas

4. E2E: add a test that:
   - Publishes a synthetic `tenant.domain.status.changed` event to the bus (or triggers verification worker) for a staging tenant
   - Waits for the backend to persist notification
   - Calls /api/public/profile and asserts the keys above exist and values match expectation

Sample assertion (pseudocode)

   resp = GET /api/public/profile/{tenant}
   assert resp["DominioPersonalizadoUltimaNotificacaoCategoria"] == "degraded"
   assert resp["DominioPersonalizadoUltimaNotificacaoResultado"] in ["sent", "failure"]

Notes
- Fields are optional; frontend should check for existence before rendering.
- If backend returns null/absent keys, frontend must gracefully hide the notification UI.

If you want, I can draft a small Vitest/Playwright test for the frontend once you confirm the test tenant and bus access details.