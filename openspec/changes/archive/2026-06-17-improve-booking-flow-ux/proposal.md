# Proposta: melhorar fluxo de agendamento (improve-booking-flow-ux)

Resumo
- Melhorar experiência de entrada e agendamento para clientes e donos de petshop.
- Objetivos: página inicial clara com CTAs separados, fluxo de agendamento via link enviado pela empresa que pré-seleciona a petshop e exige login do cliente, reduzir fricção e evitar agendamentos anônimos errados.

Contexto técnico
- Arquivos relevantes (frontend):
  - apps/frontend/src/app/(public)/page.tsx  (landing atual)
  - apps/frontend/src/app/login/page.tsx
  - apps/frontend/src/app/register/page.tsx
  - apps/frontend/src/app/(public)/bookings/[bookingId]/page.tsx  (fluxo de link de agendamento)
  - apps/frontend/src/app/(public)/petshops/[slug]/book/ (páginas de booking)
- Backend: endpoints de slots/booking em Api.Modules.Bookings; já existe scoping por EmpresaId.

Proposta de UX
1) Página inicial (landing)
- Texto claro, duas CTAs: "Sou cliente — Entrar / Criar conta" e "Sou dono de petshop — Cadastre sua loja".
- CTA do dono leva para /register com papel de owner (ou fluxo admin).
- CTA do cliente abre /login com parâmetro returnUrl para o destino após login.

2) Fluxo por link enviado pela empresa
- Link: https://app/p/public/bookings/{bookingId}
- Comportamento: se não autenticado → redirecionar para /login?returnUrl=/public/bookings/{bookingId} com mensagem "Para completar este agendamento faça login".
- Após login, retornar para /public/bookings/{bookingId} e mostrar apenas a petshop da empresa, serviços e slots já filtrados.
- Garantir backend valida que booking link pertence à empresa e retorna apenas dados daquela empresa.

Critérios de aceitação
- Landing com CTAs visíveis em mobile e desktop.
- Ao acessar booking link sem sessão, usuário é redirecionado ao login e, ao retornar, vê somente a petshop preselecionada.
- Testes unitários/integração cobrindo a lógica de redirecionamento e scoping por Empresa.

Próximos passos
- Se aprovar, criar tasks detalhadas (frontend + backend + testes + runbook) e implementar em uma change.
