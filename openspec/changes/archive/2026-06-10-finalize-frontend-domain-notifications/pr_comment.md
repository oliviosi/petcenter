### Solicitação de revisão — Finaliza testes frontend para Notificações de Domínio

Por favor revisar este PR:

**Objetivo**: validar que o frontend consome e exibe os campos `dominio_personalizado_ultima_notificacao_*`.

**Testes incluídos**:
- Vitest contract com fallback para fixture (apps/frontend/src/test/contract.profile.test.ts)
- Fixture: apps/frontend/src/test/fixtures/profile.degraded.json
- E2E skeleton: apps/frontend/src/test/e2e.domain-notification.test.ts

**Checklist para reviewers**:
- [ ] Confirmar que os tests de contrato cobrem a presença das chaves (sem assumir valores)
- [ ] Verificar se o fixture é suficiente para validar localmente
- [ ] Confirmar que CI roda `contract-tests-staging.yml` e que os secrets STAGING_API_URL e STAGING_FRONTEND_URL estão configurados
- [ ] Validar se o E2E skeleton pode ser expandido para testes reais após deploy em staging

**Notas**:
- Se a migration não estiver aplicada em staging, use o fixture para validar localmente; reexecute contra staging quando disponível.
- Recomendados reviewers: @frontend-lead, @qa, @ops-team

---

Marque aqui quando revisar/ou solicitar mudanças.
