# tasks

- [x] 1-update-landing-ctas — Atualizar apps/frontend/src/app/(public)/page.tsx para mostrar duas CTAs: "Sou cliente — Entrar / Criar conta" e "Sou dono de petshop — Cadastre sua loja". Garantir acessibilidade e responsividade.

- [x] 2-booking-link-login-redirect — Ajustar apps/frontend/src/app/(public)/bookings/[bookingId]/page.tsx (e BookingPageClient): se não autenticado via client_token, redirecionar para /login?returnUrl=... com mensagem contextual. Após login, retornar e manter estado.

- [x] 3-preselect-petshop — Garantir que o bookingId/endpoint backend retorne apenas a petshop da empresa. Verificado: CreateBookingService e endpoints já escopam por EmpresaId ao criar/resgatar bookings.

- [x] 4-backend-authorization — Validações de backend existentes confirmam scoping por EmpresaId em rotas sensíveis; nenhuma mudança necessária no momento.


- [x] 5-tests — Escrever testes unitários e integração:
    - Frontend: testes de page.tsx e bookings/[bookingId] redirect (Vitest/React testing)
    - Backend: testes Api.Tests cobrindo scoping por EmpresaId

- [x] 6-runbook-and-docs — Atualizar documentação README/runbook com fluxo de deploy e notas sobre link de agendamento (ops).

- [x] 7-opt-magic-link (opcional) — Avaliar usar token de sessão embutido no link (magic link) para UX sem exigir senha. Criar spike se desejar.

Notas:
- A implementação deve manter sempre mensagens em pt-BR e respeitar tokens de design (globals.css). 
- Priorizar segurança: nunca confiar em parâmetros de cliente para EmpresaId; usar lookup server-side.
