# Design — async-domain-notifications-retry

Visão geral
-----------
Arquitetura proposta:

Frontend/API (chamada existente) → Backend API → publica mensagem `domain.notification.requested` → RabbitMQ exchange `notifications` → Worker/Consumer (dotnet background service) → tenta enviar (SMTP/HTTP provider) com retries programados → publica `domain.notification.processed` / atualiza entidade Empresa.

Mensagens
--------
`domain.notification.requested`:
- bookingId / empresaId
- domain
- state (degraded/recovered)
- reason
- requestedAt

`domain.notification.attempt` (interno ao worker):
- attemptNumber
- nextAttemptAt (timestamp)

Idempotência
-----------
- Cada message carrega `notificationId` (guid). Consumer faz lookup por notificationId para evitar duplicação.
- Banco mantém status e tentativas por notificationId (nova tabela `domain_notifications` ou extensão do modelo Empresa + índices).

Backoff & Scheduling
--------------------
- Consumer schedules next attempt by requeueing message with delay (RabbitMQ delayed exchange or TTL+DLX pattern).
- Configurável: MaxAttempts, BaseDelayMs, Multiplier.

Observability
-------------
- Métricas: notifications_attempts_total, notifications_sent_total, notifications_failed_total, notifications_in_flight
- Tracing: OpenTelemetry traces por notificationId

Runbook / Operational
---------------------
- Como reprocessar uma notificationId manualmente.
- Como forçar abandono (mark as failed) e notificar suporte.

Trade-offs
---------
- + Escalabilidade e observabilidade
- - Mais componentes e infra (RabbitMQ consumer availability)
- - Requer coordenação ops para deploy e monitoramento
