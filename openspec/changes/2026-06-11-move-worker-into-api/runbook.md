# Runbook: Operação e rollback — Worker integrado ao Api

Prerrequisitos
- Acesso ao cluster/ambiente onde a Api roda
- Ferramentas: kubectl / helm ou acesso ao pipeline CI/CD
- Variáveis de ambiente: NOTIFICATION_RUN_IN_PROCESS (bool)

Habilitar worker em processo (staging)
1. Definir env var no deployment/staging: NOTIFICATION_RUN_IN_PROCESS=true
2. Deployar a imagem da Api normalmente via pipeline
3. Verificar logs do Pod/Container:
   - kubectl logs -f deployment/api-deployment
   - Buscar: "DomainNotificationConsumer started." e entradas de envio: "[InMemoryPublisher] Sending domain notification"
4. Validar processamento end-to-end:
   - Publicar evento sintético na fila (RabbitMQ) ou usar ferramenta de teste que existe no repo
   - Verificar que empresa tem registro de notificação (campo DominioPersonalizadoUltimaNotificacaoCategoria atualizado)

Desabilitar worker em processo (emergência)
1. Remover a env var ou setar para false: NOTIFICATION_RUN_IN_PROCESS=false
2. Redeploy da Api (rolling restart)
3. Verificar logs: consumer não deve aparecer; health/readiness indica consumer disabled
4. Se processamento urgente for necessário, restaurar temporariamente a imagem do Worker container e escalá-lo (ops)

Rollback para worker separado (se regressão)
1. Reverter PR que moveu o consumer (se aplicável) e reimplantar a imagem do Worker container; OU
2. Re-habilitar deployment do Worker container existente (deploy worker image)
3. Monitorar fila para garantir consumo

Observability
- Métricas disponíveis: notifications_sent_total, notifications_failed_total, notifications_attempts_total (Meter/Counters já instrumentados).
- Logs: use níveis Info para envios, Warning para falhas/delays, Error para persistência falha.
- Health: expor readiness que inclua status do HostedService quando habilitado (ok/disabled)

Alerts sugeridos
- Alert if notifications_failed_total rate spikes above baseline
- Alert if queue depth > threshold for > 5 minutes
- Alert if Api pod CPU or memory increases > 30% after enabling worker

Notas operacionais
- Manter worker simples: não introduzir long-running blocking operations no HostedService loop.
- Para cargas altas, preferir worker separado escalar independentemente.

Contato
- Notificar equipe de Ops e autor da mudança ao ativar em produção

Última revisão: 2026-06-11
