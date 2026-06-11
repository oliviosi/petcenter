# Tasks: Mover Worker para dentro do Api

Visão geral: tarefas mínimas e ordenadas para executar a migração com segurança.

1) Preparação (0.5d)
   - Criar branch temporário local (opcional conforme preferência do usuário).
   - Confirmar CI atual e notificar Ops sobre janela de deploy.
   - Arquivos a revisar: apps/backend/Worker/*, apps/backend/Api/*, .github/workflows/worker-build.yml
   - Saída esperada: checklist PR iniciado.

2) Código: mover DomainNotificationConsumer (1d)
   - Mover apps/backend/Worker/DomainNotificationConsumer.cs → apps/backend/Api/Workers/DomainNotificationConsumer.cs
   - Ajustar namespace para Api.Workers e dependências (ILogger, repositórios, configuração).
   - Adicionar comentários mínimos quando necessário.
   - Acceptance: dotnet build Api compila; consumer compila; unit tests existentes passam.

3) Código: consolidar InMemoryNotificationPublisher (0.5d)
   - Verificar duplicatas em Api.Modules.Empresas.Infrastructure e remover a do Worker (se existir)
   - Garantir que NotificationOptions e NotificationMessage estejam definidos em Api
   - Acceptance: build Api e testes compilam; cobertura manual de fluxo de envio local.

4) Config: registrar HostedService condicionalmente (0.25d)
   - Editar Api.Extensions.ServiceCollectionExtensions.AddModuleServices para ler env var NOTIFICATION_RUN_IN_PROCESS e registrar DomainNotificationConsumer somente se true.
   - Acceptance: Start Api com env var true e ver "DomainNotificationConsumer started." no log; start sem var e não registrar.

5) Docs: atualizar README/Runbook (0.25d)
   - Atualizar ops runbook com instruções para habilitar/desabilitar e rollback.
   - Acceptance: PR contém runbook.md e README atualizados.

6) CI/CD: tornar build do worker opcional (0.5d)
   - Atualizar .github/workflows/worker-build.yml para ser removido ou condicional (marcar job como deprecated).
   - Opcional: manter job que apenas valida compilação se RUN_WORKER_IMAGE=true.
   - Acceptance: CI passa e team Ops informado.

7) Testes e validação em staging (1d)
   - Deploy da Api em staging com NOTIFICATION_RUN_IN_PROCESS=true.
   - Enviar evento sintético (ou reuso de teste Playwright) para a fila e verificar processamento e persistência.
   - Acceptance: Notificação persistida e logs/metrics registrados; sem regressões nas rotas públicas.

8) Remoção do projeto Worker (opcional, 0.5d)
   - Após aprovação e um ciclo de monitoramento, remover apps/backend/Worker/ do repositório.
   - Atualizar docs e workflows.

Checklist do PR
- [ ] Mover código sem alterar lógica de negócios
- [ ] Atualizar ServiceCollectionExtensions
- [ ] Adicionar variáveis de configuração e documentação
- [ ] Testes automatizados passam
- [ ] Runbook e README atualizados
- [ ] Notificação para Ops e plano de rollback

Estimativa total: 3.5 - 4 dias (inclui validação e coordenação com Ops)

Notas
- Estimativas podem reduzir se mudanças forem minimalistas (ex.: mover arquivos sem refatoração profunda).
- Se preferir, pode-se dividir a entrega: primeira entrega com HostedService sempre ativo em branch de feature para validação rápida; segunda entrega adiciona flag e CI cleanup.
