# Tenant Custom Domain Notifications — Proposal

Objetivo
- Entregar canal inicial de notificações por email para eventos de degradação e recuperação de domínios custom.

Por que
- Notificar proativamente tenants sobre perda e recuperação do domínio próprio.
- Complementar a persistência de estado e o painel operacional (domain-health-dashboard).

Escopo inicial
- Implementar envio de email transacional ao detectar transição `degraded` → notify e `recovered` → notify.
- Persistir resultado do envio (success/failure) no registro `tenant_domains_status`.
- Deduplicação: garantir exatamente uma notificação por ciclo de estado.
