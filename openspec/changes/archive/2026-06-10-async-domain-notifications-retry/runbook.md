# Runbook — async-domain-notifications-retry

Objetivo
--------
Procedimentos operacionais para reprocessar notificações, inspecionar falhas e lidar com filas travadas.

Ações comuns
------------
1. Verificar status da fila (RabbitMQ management UI)
2. Encontrar notificationId no banco: SELECT * FROM domain_notifications WHERE notification_id='...';
3. Reprocessar manualmente: publicar novamente `domain.notification.requested` com o mesmo notificationId
4. Forçar abandono: marcar status = 'failed' e notificar suporte
5. Limpeza: remover mensagens expiradas das DLQs após investigação

Contatos
--------
- Ops on-call: @ops-team
- Dev lead: @backend-lead

Ferramentas
----------
- rabbitmqctl / UI
- psql
- kubectl (para reiniciar worker)

Checklist de emergência
----------------------
- Se filas acumuladas: aumentar worker replicas e reavaliar backoff
- Se rate de falhas alto: bloquear publishing e investigar provider (SMTP/HTTP)
