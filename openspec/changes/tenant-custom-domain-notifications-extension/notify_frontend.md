Frontend team,

PR: openspec/tenant-custom-domain-notifications-extension
PR URL: https://github.com/oliviosi/petcenter/compare/main...openspec/tenant-custom-domain-notifications-extension?expand=1

Summary:
- Backend now exposes optional fields in GET /api/public/profile with latest notification metadata:
  - DominioPersonalizadoUltimaNotificacaoCategoria
  - DominioPersonalizadoUltimaNotificacaoMotivo
  - DominioPersonalizadoUltimaNotificacaoEnviadaEm
  - DominioPersonalizadoUltimaNotificacaoResultado
  - DominioPersonalizadoUltimaNotificacaoTentativas

Action requested:
1. After ops applies migration and deploys backend to staging, run the frontend contract checklist in frontend_contract_checklist.md.
2. Ensure UI checks for field existence before rendering and handles nulls gracefully.
3. If you want, I can draft a Vitest/Playwright test asserting presence/values of keys; provide a staging tenant ID.

Thanks,
Auto-agent
