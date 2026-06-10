Monitoring artifacts for async-domain-notifications-retry

- Grafana dashboard panels: notifications_in_flight, notifications_attempts_total, notifications_sent_total, notifications_failed_total
- Alert rules: high failure rate (>5% over 5m), queue depth high (>1000 messages)
- Tenant custom-domain notifications track notifications_attempts_total and notifications_sent_total; keep notifications_failed_total only for legacy dashboards.
- Alert when notification failures exceed 20% over 5m.
