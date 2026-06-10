using System;
using System.Collections.Generic;
using System.Diagnostics.Metrics;
using System.Threading;
using System.Threading.Tasks;
using Api.Modules.Empresas.Domain;
using Api.Modules.Empresas.Infrastructure;
using Microsoft.Extensions.Logging;
using Xunit;

namespace Api.Tests
{
    public class EmailNotificationProviderIntegrationTests
    {
        private class FakeEmpresaRepository : IEmpresaRepository
        {
            private readonly Dictionary<Guid, Empresa> _store = new();
            public int UpdateCount { get; private set; }
            public Empresa? LastUpdated { get; private set; }

            public void Seed(Empresa e) => _store[e.Id] = e;

            public Task<Empresa?> GetByIdAsync(Guid id) => Task.FromResult(_store.TryGetValue(id, out var e) ? e : null as Empresa);
            public Task<Empresa?> GetPublicByIdAsync(Guid id) => throw new NotImplementedException();
            public Task<Empresa?> GetBySlugAsync(string slug) => throw new NotImplementedException();
            public Task<Empresa?> GetByCustomDomainAsync(string domain) => throw new NotImplementedException();
            public Task<Empresa?> GetPublicBySlugAsync(string slug) => throw new NotImplementedException();
            public Task<Empresa?> GetPublicByHostAsync(string host) => throw new NotImplementedException();
            public Task<List<Empresa>> ListEligibleForDomainAutomationAsync(DateTime referenciaUtc, int take = 100) => throw new NotImplementedException();
            public Task<List<Empresa>> ListPublicAsync(string? nome = null, string? cidade = null, string? bairro = null, string? servico = null) => throw new NotImplementedException();
            public Task<EmpresaPublicRatingSummary?> GetPublicRatingSummaryAsync(Guid empresaId) => throw new NotImplementedException();
            public Task<Dictionary<Guid, EmpresaPublicRatingSummary>> GetPublicRatingSummariesAsync(IEnumerable<Guid> empresaIds) => throw new NotImplementedException();

            public Task UpdateAsync(Empresa empresa)
            {
                UpdateCount++;
                LastUpdated = empresa;
                _store[empresa.Id] = empresa;
                return Task.CompletedTask;
            }
        }

        private class FailingThenSucceedingPublisher : InMemoryNotificationPublisher
        {
            private int _calls;
            private readonly int _failuresBeforeSuccess;

            public FailingThenSucceedingPublisher(
                IEmpresaRepository empresaRepository,
                ILogger<InMemoryNotificationPublisher> logger,
                Microsoft.Extensions.Options.IOptions<NotificationOptions> options,
                int failuresBeforeSuccess = 2)
                : base(empresaRepository, logger, options)
            {
                _failuresBeforeSuccess = failuresBeforeSuccess;
            }

            protected override Task<bool> SimulateSendAsync(NotificationMessage message)
            {
                _calls++;
                return Task.FromResult(_calls > _failuresBeforeSuccess);
            }
        }

        [Fact]
        public async Task Provider_Retries_On_Transient_Failures_And_Records_Attempts()
        {
            var repo = new FakeEmpresaRepository();
            var empresa = new Empresa("IntegrationTest");
            empresa.DefinirDominioPersonalizadoDesejado("example.net", DateTime.UtcNow);
            repo.Seed(empresa);

            var logger = LoggerFactory.Create(b => b.AddConsole()).CreateLogger<InMemoryNotificationPublisher>();
            var options = Microsoft.Extensions.Options.Options.Create(new NotificationOptions { MaxAttempts = 3, BaseDelayMs = 10 });
            var provider = new FailingThenSucceedingPublisher(repo, logger, options, failuresBeforeSuccess: 2);

            long attemptsCount = 0;
            long sentCount = 0;
            using var listener = new MeterListener();
            listener.InstrumentPublished = (instrument, l) =>
            {
                if (instrument.Meter.Name == "petcenter.notifications")
                {
                    l.EnableMeasurementEvents(instrument);
                }
            };
            listener.SetMeasurementEventCallback<long>((instrument, measurement, tags, state) =>
            {
                if (instrument.Name == "notifications_attempts_total") Interlocked.Add(ref attemptsCount, measurement);
                if (instrument.Name == "notifications_sent_total") Interlocked.Add(ref sentCount, measurement);
            });
            listener.Start();

            await provider.PublishAsync(new NotificationMessage(Guid.NewGuid(), empresa.Id, "example.net", "degraded", "dns flakey", DateTime.UtcNow));

            Assert.Equal(3, attemptsCount);
            Assert.Equal(1, sentCount);

            Assert.Equal(1, repo.UpdateCount);
            Assert.NotNull(repo.LastUpdated);
            Assert.Equal("degraded", repo.LastUpdated!.DominioPersonalizadoUltimaNotificacaoCategoria);
            Assert.Equal("dns flakey", repo.LastUpdated.DominioPersonalizadoUltimaNotificacaoMotivo);
            Assert.Equal("sent", repo.LastUpdated.DominioPersonalizadoUltimaNotificacaoResultado);
            Assert.Equal(3, repo.LastUpdated.DominioPersonalizadoUltimaNotificacaoTentativas);
        }
    }
}
