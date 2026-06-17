# Spike: magic-link para fluxo de agendamento (opcional)

Problema: exigir senha reduz conversão em links enviados por empresas. Solução proposta: permitir magic-link temporário que autentica o cliente via token único no link.

Opções:
- Token embutido no link (https://app/login?magic=<token>&returnUrl=...)
  - Prós: experiência suave, simples de implementar
  - Contras: tokens podem vazar; requer expiração curta e revogação
- Token curto + validação server-side + one-time use
- Enviar token via e-mail (se cliente email conhecido)

Ações para spike:
1. Implementar protótipo de token gerado por CreateBookingService e armazenado como TemporayAuth in memoria (10m expiracao).
2. Frontend: se link contiver magic token, chamar /auth/magic para obter client_token e redirecionar para returnUrl.
3. Testes de segurança: garantir one-time use e expiração.

Deseja que eu prossiga com implementação do spike? (sim/não)
