# API contract — Tenant Domain Health Dashboard

Endpoints propostos (admin-scoped)

1) GET /api/admin/tenants/{tenantId}/domain-health
- Descrição: retorna visão agregada do estado do domínio para o tenant.
- Autenticação: JWT com claim EmpresaId ou RBAC admin.

Response (200):
{
  "tenantId": "uuid",
  "notifications": {
    "total": 123,
    "failures": 5,
    "successes": 118
  },
  "certificate": {
    "ready": true,
    "lastCheckedAt": "2026-06-10T12:34:56Z"
  },
  "dns": {
    "verified": false,
    "lastCheckedAt": "2026-06-10T11:22:33Z"
  },
  "recentNotifications": [
    { "id": "uuid","category":"degraded","reason":"TLS failed","sentAt":"...","outcome":"failure","attempts":3 }
  ]
}

2) GET /api/admin/tenants/{tenantId}/domain-health/notifications
- Descrição: lista paginada de notificações (filtros: resultado, categoria, período)

Response (200):
{
  "items": [ { "id": "uuid", "category": "degraded", "reason": "...", "sentAt": "...", "outcome": "failure", "attempts": 3 } ],
  "page": 1,
  "pageSize": 20,
  "total": 42
}

SQLs de agregação úteis (exemplo)

-- Agregado por tenant
SELECT
  e.id AS tenant_id,
  COUNT(n.*) AS total_notifications,
  COUNT(*) FILTER (WHERE n.outcome = 'failure') AS failures,
  COUNT(*) FILTER (WHERE n.outcome = 'success') AS successes
FROM domain_notifications n
JOIN empresas e ON e.id = n.empresa_id
WHERE e.id = '<TENANT_UUID>'
GROUP BY e.id;

-- Últimas notificações
SELECT id, category, reason, sent_at, outcome, attempts, created_at
FROM domain_notifications
WHERE empresa_id = '<TENANT_UUID>'
ORDER BY created_at DESC
LIMIT 20;

Observações de implementação (melhores práticas)
- Todas as queries devem filtrar por EmpresaId (multi-tenancy strict).
- Paginamento e limites por padrão (pageSize max 100).
- Endpoints admin apenas (não expor dados sensíveis no endpoint público).
- Expor métricas: notifications_attempts_total (labels: empresa_id,outcome,category), notifications_sent_total (labels: outcome,category).

Aceitação técnica
- Endpoints implementados com testes unitários e de integração (mock DB ou staging).
- Métricas emitidas via System.Diagnostics.Metrics ou Prometheus exporter.
- Migration.sql revisada por ops e aplicada em staging antes da validação.
