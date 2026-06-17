# Runbook — improve-booking-flow-ux

Objetivo: documentar o fluxo de link de agendamento por empresa, como testar e deploy.

1) Padrão de links enviados pela empresa
- Links públicos para clientes devem usar o padrão:
  https://<app_host>/bookings/<bookingId>?companyLink=true
- A flag companyLink=true instrui o frontend a exigir autenticação do cliente antes de mostrar a interface de booking.

2) Testes locais
- Frontend:
  - Executar em apps/frontend: npm install (se necessário) && npm run test (Vitest).
  - Arquivos de teste adicionados/atualizados: (public)/page.test.tsx
- Backend:
  - Executar dotnet test apps/backend/Api.Tests/Api.Tests.csproj
  - Teste adicionado: CreateBookingServiceAuthorizationTests.cs

3) Deploy e observabilidade
- As mudanças são client-side; nenhuma alteração de DB.
- Validar em staging URLs de agendamento enviados por empresa e confirmar redirecionamento para /login quando não autenticado.

4) Segurança
- Backend já valida scoping por EmpresaId nas rotas de bookings. Nunca confiar em query params para determinar empresa — sempre use lookup server-side.

5) Rollout
- Deploy normal em main. Monitorar logs de booking e erros de redirecionamento.
