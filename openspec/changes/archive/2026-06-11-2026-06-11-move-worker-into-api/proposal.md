# Proposta: Mover Worker de Notificações para o projeto Api

Resumo

Mover o código responsável pelo processamento de notificações de domínio (DomainNotificationConsumer e InMemoryNotificationPublisher) do projeto independente apps/backend/Worker para o projeto apps/backend/Api como HostedService(s) e provedores DI.

Motivação

- Reduzir acoplamento e duplicação de tipos (repositórios, DTOs, options) entre Api e Worker.
- Simplificar operações: um deploy, mesmo conjunto de configurações/variáveis de ambiente.
- Facilitar testes e desenvolvimento local (sem necessidade de project reference separado ou sincronização de versões).

Proposta

1. Mover fontes:
   - apps/backend/Worker/DomainNotificationConsumer.cs → apps/backend/Api/Workers/DomainNotificationConsumer.cs
   - apps/backend/Worker/Worker.cs (se não for necessário, remover) → archivar/deletar
   - apps/backend/Worker/Program.cs logic → não portado; a execução passa a ser via Api host
2. Consolidar InMemoryNotificationPublisher dentro de Api.Modules.Empresas.Infrastructure (remover duplicatas)
3. Registrar o HostedService em Api.Extensions.ServiceCollectionExtensions (AddModuleServices):
   - services.AddHostedService<DomainNotificationConsumer>();
   - Garantir que INotificationPublisher (InMemory or real provider) esteja registrado.
4. Introduzir flag de configuração para habilitar/desabilitar o worker em processo (ex.: NOTIFICATION_RUN_IN_PROCESS=true). Registrar HostedService condicionalmente.
5. Atualizar CI/CD:
   - Remover job de build/imagem do Worker ou mantê-lo para compatibilidade (opção de descontinuação). Atualizar .github/workflows/worker-build.yml conforme decisão.
6. Atualizar README/ops runbook para refletir novo comportamento e instruções de deploy.

Tarefas (mínimo viável)

- [ ] Criar change folder openspec/changes/2026-06-11-move-worker-into-api (esta proposta)
- [ ] Mover/editar arquivos: DomainNotificationConsumer.cs para Api/Workers/
- [ ] Consolidar InMemoryNotificationPublisher (remover duplicatas)
- [ ] Registrar HostedService condicionalmente em AddModuleServices
- [ ] Adicionar configuração (env var) e documentar
- [ ] Atualizar build pipeline: remover worker image stage ou torná-lo opcional
- [ ] Rodar e validar: dotnet build Api && dotnet run Api (ver logs do consumer)
- [ ] Atualizar openspec runbook e README com instruções de operação

Validação

- Build: dotnet build apps/backend/Api/Api.csproj
- Testes: dotnet test apps/backend/Api.Tests/Api.Tests.csproj
- Run local: dotnet run --project apps/backend/Api/Api.csproj (com NOTIFICATION_RUN_IN_PROCESS=true) e verificar log: "DomainNotificationConsumer started." e envios simulados.

Riscos e mitigação

- Risco: aumento do uso de CPU/memory no processo Api por hosted worker.
  Mitigação: manter worker simples e idempotente; usar env var para desligar; monitorar recursos e escalar replicas.
- Risco: regressão em produção se pipeline/ops esperavam worker separado.
  Mitigação: manter imagem do worker por um release e comunicar ops; oferecer rollout canary.

Rollback

- Se regressão crítica, reverter PR e reverter CI change; reintegrar Worker container no cluster até correção.

Perguntas abertas

- Deseja que eu: (A) gere o diff/PR com as mudanças propostas automaticamente, ou (B) crie apenas os artefatos openspec (tasks/design) e deixe você revisar antes de aplicar? 

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
