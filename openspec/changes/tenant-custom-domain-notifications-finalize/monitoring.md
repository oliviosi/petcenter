# Métricas e Alertas — Notificações de Domínio

Métricas propostas (Instrumentação no EmailNotificationProvider):
- notifications_attempts_total (Counter) — incrementado a cada tentativa de envio.
- notifications_sent_total (Counter) — incrementado ao enviar com sucesso.
- notifications_failed_total (Counter) — incrementado quando todas as tentativas falham.

Regra de alerta recomendada:
- Nome: DomainNotificationsHighFailureRate
- Query (Prometheus):
  ```
  rate(notifications_failed_total[5m]) / (rate(notifications_attempts_total[5m]) + 1e-9) > 0.20
  ```
- Ação: Alert if >20% failures over 5 minutes for any service/instance.

Painel de observabilidade sugerido:
- Time series: attempts vs sent vs failed
- Alert history: recent failures and last successful send per empresa
- Latency histogram (opcional): latencies for send attempts

Notas:
- Exporters/collectors: usar OpenTelemetry -> Prometheus exporter ou integrar com o APM que a equipe usa.
- Thresholds podem ser ajustados após observação em staging.
