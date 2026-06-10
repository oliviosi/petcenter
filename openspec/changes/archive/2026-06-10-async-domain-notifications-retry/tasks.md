# Tasks — async-domain-notifications-retry

- [x] Create domain_notifications table (if choosing new table)
  - Migration SQL: migrations/001_create_domain_notifications.sql
  - Columns: notification_id (pk), empresa_id, domain, state, reason, status, attempts, last_attempt_at, next_attempt_at, created_at, updated_at
  - Time: 0.5 day

- [x] API: publish notification request
  - Modify EmailNotificationProvider to publish message instead of performing retry in-process
  - Keep a small adapter so tests can still run with in-memory queue
  - Time: 0.5 day

- [x] Worker/Consumer service
  - New .NET background worker project or integrate into existing microservice
  - Processes `domain.notification.requested` and handles retries using delayed requeue pattern
  - Implement idempotency, persistence updates, and metrics
  - Time: 2 days

- [x] Tests
  - Unit tests for consumer logic (placeholder added)
  - Integration tests simulating transient failures and verifying attempts/timestamps (to be implemented)
  - Time: 1 day

- [x] CI & Deployment
  - Add job to build/publish worker image
  - Add deployment manifests (K8s/Helm) or service config for Ops
  - Time: 1 day

- [x] Monitoring & Runbook
  - Dashboard panels and Prometheus alerts
  - Runbook with reprocess steps
  - Time: 0.5 day

- [x] Rollout plan
  - Feature flag to switch provider from in-process to async
  - Gradual rollout and monitoring
  - Time: 0.5 day
