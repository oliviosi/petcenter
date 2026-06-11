# Tasks — tenant-domain-health-dashboard

Status: draft

## Backend

- [ ] 1. Validar se há migração de banco necessária para suportar os indicadores.
- [x] 2. Criar endpoints de saúde por tenant (GET /api/admin/tenant/{id}/domain-health e GET /api/admin/tenant/{id}/domain-health/top). 
- [x] 3. Agregar falhas de notificação, prontidão de certificado e verificação de DNS (retornar counts e últimos eventos).
- [x] 4. Garantir escopo por `EmpresaId` em todas as consultas (adicionar filtros e testes).

## Métricas e Observabilidade

- [ ] 5. Expor/ajustar contadores de métricas para os eventos de domínio.
- [ ] 6. Criar dashboard no Prometheus/Grafana.

## Frontend

- [ ] 7. Criar página admin para visão de saúde do domínio.
- [ ] 8. Adicionar filtros por tenant e estado.

## CI e Validação

- [ ] 9. Adicionar validação em CI para consultas e contrato dos endpoints.
- [ ] 10. Validar em staging com dados reais/sintéticos.

## Ops e Runbook

- [ ] 11. Atualizar runbook com passos de verificação e troubleshooting.
- [ ] 12. Registrar instruções de aplicação e rollback para staging.

