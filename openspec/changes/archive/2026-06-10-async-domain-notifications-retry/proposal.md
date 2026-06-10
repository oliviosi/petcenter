# OpenSpec: async-domain-notifications-retry

Resumo
------
Mover o retry de notificações de domínio do processamento in-process para um fluxo assíncrono baseado em fila (RabbitMQ/background job). Isso melhora escalabilidade, reduz latência de request paths e torna as tentativas observáveis e gerenciáveis em production.

Por que
------
- Retry in-process bloqueia threads e aumenta latência do fluxo de notificação.
- Um trabalho assíncrono permite backoff programável, visibilidade das tentativas e reprocessamento manual quando necessário.
- Coabita com o ecossistema atual que já usa RabbitMQ para bookings.

Critérios de aceitação
----------------------
- Implementação que publica mensagens de notificação na fila em vez de executar retry sincronamente.
- Consumidor idempotente que processa envios e aplica backoff por tentativa, persistindo resultado e tentativas.
- Testes de integração cobrindo falhas transitórias e confirmações finais.
- Monitoramento e alertas para taxa de falha e tentativas.
- Documentação operacional (runbook) para reprocessamento e rollback.
