# OpenSpec: finalize-frontend-domain-notifications

Resumo
------
Objetivo: finalizar as tasks frontend e CI para as Notificações de Domínio personalizadas, garantindo que o frontend consuma e exiba corretamente os campos adicionados pelo backend, e que testes de contrato e e2e validem o comportamento em staging.

Por que
------
- Reduz o tempo de bloqueio: frontend pode ser completado independentemente da migration ser aplicada imediatamente.
- Garante cobertura de contrato e UI antes do deploy em produção.

Critérios de aceitação
----------------------
- Teste de contrato Vitest que verifica a presença/estrutura dos campos `dominio_personalizado_ultima_notificacao_*` em `/api/public/profile`.
- Playwright e2e que valida o fluxo de exibição de notificação no storefront/admin (esqueleto com cenários básicos).
- CI workflow que executa contract tests e e2e contra staging (usa secrets STAGING_API_URL, STAGING_FRONTEND_URL).
- PR frontend criado e pronto para revisão.

Escopo
------
Inclui:
- Implementação dos testes frontend (Vitest + Playwright)
- Documentação de como rodar localmente e em CI
- Configuração de jobs GitHub Actions (reutilizar contract-tests-staging.yml criado)
- Adição de exemplos de fixtures/respostas mock para o contract test

Não inclui:
- Alterações ao backend já aplicadas na branch existente (essa change assume branch backend pronta)
- Aplicação da migration no DB (ops)

Riscos
-----
- Divergência de schema entre backend e staging se migration não aplicada.
- Playwright pode precisar de ajustes após o frontend real for implementado.

Estimativa
---------
- 1 dia: testes de contrato + documentação
- 1 dia: e2e baseline + CI

Próximos passos
--------------
- Criar change: `openspec new change "finalize-frontend-domain-notifications"`
- Gerar artifacts: design.md, tasks.md, pr_description.md
- Implementar e abrir PR frontend
