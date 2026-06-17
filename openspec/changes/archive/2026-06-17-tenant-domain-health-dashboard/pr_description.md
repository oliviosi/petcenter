# PR Description — tenant-domain-health-dashboard

## Resumo

Adiciona um dashboard de saúde de domínio por tenant com foco em falhas de notificação, prontidão de certificado e verificação de DNS.

## Arquivos adicionados

- `openspec/changes/tenant-domain-health-dashboard/.openspec.yaml`
- `openspec/changes/tenant-domain-health-dashboard/proposal.md`
- `openspec/changes/tenant-domain-health-dashboard/tasks.md`
- `openspec/changes/tenant-domain-health-dashboard/runbook.md`
- `openspec/changes/tenant-domain-health-dashboard/ops_apply_instructions.md`

## Migração

- Se houver ajuste de esquema, aplicar primeiro em staging.
- Validar a tabela `domain_notifications` e os campos usados para o dashboard.

## Testes

- Validar endpoints com filtro por tenant.
- Conferir métricas no backend e no Grafana.
- Fazer smoke test da página admin.
