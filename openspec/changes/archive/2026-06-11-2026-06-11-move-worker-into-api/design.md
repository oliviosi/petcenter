# Design: Reunir Worker de Notificações dentro do Api

Objetivo

Consolidar o processamento de notificações de domínio (DomainNotificationConsumer) e o publisher em memória (InMemoryNotificationPublisher) dentro do projeto apps/backend/Api como HostedService(s) e provedores DI, mantendo a opção de operar o worker como processo separado via feature flag.

Arquitetura proposta

                       ┌────────────────────────────┐
                       │        Client / UI         │
                       └──────────┬─────────────────┘
                                  │ HTTP
                                  ▼
                       ┌────────────────────────────┐
                       │         Api (Kestrel)      │
                       │  - Controllers / Endpoints │
                       │  - Repositories (EF Core)  │
                       │  - HostedServices (Worker) │
                       │  - DI: INotificationPublisher
                       └──────────┬─────────────────┘
                                  │
                       ┌──────────┴──────────┐
                       │    RabbitMQ / Bus    │
                       └──────────────────────┘


Componentes e responsabilidades

- DomainNotificationConsumer (HostedService)
  - Consumir eventos da fila (RabbitMQ) e enfileirar envios.
  - Aplicar deduplicação de notificações por Empresa (usar estado persistido).
  - Logar métricas básicas e health checks.

- InMemoryNotificationPublisher
  - Implementação de teste local que aplica a mesma política de retry e persistência.
  - Em produção fica o provider real (EmailNotificationProvider) registrado via DI.

Decisões de design

1. Registro condicional do HostedService
   - Introduzir env var NOTIFICATION_RUN_IN_PROCESS (default: false em produção).
   - Em ServiceCollectionExtensions, registrar o HostedService somente quando a flag estiver ativa:

```csharp
var runInProcess = configuration.GetValue<bool>("NOTIFICATION_RUN_IN_PROCESS");
if (runInProcess) services.AddHostedService<DomainNotificationConsumer>();
```

2. Localização dos arquivos
   - apps/backend/Api/Workers/DomainNotificationConsumer.cs  (migrado)
   - apps/backend/Api/Modules/Empresas/Infrastructure/InMemoryNotificationPublisher.cs (consolidado)

3. Backwards compatibility
   - Manter o projeto apps/backend/Worker por um ciclo (depreciado) até que Ops confirme desativação do container.
   - Atualizar workflow .github/workflows/worker-build.yml para ser opcional ou removê-lo em PR separado.

Observability e Health

- Expor métricas (Meter/Counter já existentes) e traces.
- Health check simples: um endpoint de readiness do Api inclui status do consumer (se habilitado) ou indica "disabled-by-config".

Fallback e rollback

- Se o worker em processo criar regressões, desligar via NOTIFICATION_RUN_IN_PROCESS=false e reimplantar a imagem da API.
- Como mitigação, manter uma imagem do Worker disponível para redeploy caso seja necessário reativar o consumidor fora do processo Api.

Segurança e multi-tenancy

- Todas as operações que consultam dados de Empresa devem continuar a filtrar por EmpresaId extraído do token quando aplicável. HostedService deve usar repositórios do Api e evitar aceitar EmpresaId do payload sem validação.

Conclusão

Essa abordagem reduz complexidade operacional e evita referências de projeto duplicadas. A flag condicional fornece um caminho de rollback e permite que Ops decida quando descontinuar o Worker separado.
