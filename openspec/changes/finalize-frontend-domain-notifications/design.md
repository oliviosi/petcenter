# Design — finalize-frontend-domain-notifications

Visão geral
-----------
O frontend deve consumir o endpoint público `/api/public/profile` e exibir uma seção de notificação de domínio quando os campos `dominio_personalizado_ultima_notificacao_*` estiverem presentes ou não-nulos.

Interfaces
----------
Exemplo de payload esperado (simplificado):

```json
{
  "id": "uuid",
  "name": "Petshop X",
  "dominio_personalizado_ultima_notificacao_categoria": "degraded",
  "dominio_personalizado_ultima_notificacao_motivo": "dns flakey",
  "dominio_personalizado_ultima_notificacao_resultado": "sent",
  "dominio_personalizado_ultima_notificacao_tentativas": 3
}
```

UI
--
- Componente: DomainNotificationBanner
  - Props: category, reason, result, attempts
  - Comportamento: exibe mensagem contextual baseada em `category` (e.g., "Domínio com problema: degraded")

Testes
------
- Contract Test (Vitest): mocka o fetch para STAGING_API_URL e valida existência dos campos.
- E2E (Playwright): navegar até a página do petshop e validar banner aparecendo quando backend expõe `degraded`.

CI
--
Reutilizar workflow `contract-tests-staging.yml`. Adicionar job que roda contract tests no PR e job `e2e-tests` que é acionado manualmente contra staging.

Notas
-----
- Os testes de contrato não devem falhar se os campos estiverem nulos; apenas garantem a presença das chaves no JSON.
- Fixture de exemplo será adicionado em `apps/frontend/src/test/fixtures/profile.degraded.json`.
