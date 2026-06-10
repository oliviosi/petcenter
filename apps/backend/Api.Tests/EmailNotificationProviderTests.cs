using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Api.Modules.Empresas.Domain;
using Api.Modules.Empresas.Infrastructure;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Xunit;

namespace Api.Tests
{
    public class EmailNotificationProviderTests
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

        [Fact]
        public async Task Deduplication_Skips_When_Last_Category_Matches()
        {
            var repo = new FakeEmpresaRepository();
            var empresa = new Empresa("Test");
            empresa.DefinirDominioPersonalizadoDesejado("example.com", DateTime.UtcNow);
            empresa.RegistrarNotificacaoDominioPersonalizado("degraded", "initial", DateTime.UtcNow, "sent", 1);
            repo.Seed(empresa);

            var loggerFactory = LoggerFactory.Create(b => b.AddConsole());
            var publisher = new InMemoryNotificationPublisher(repo, loggerFactory.CreateLogger<InMemoryNotificationPublisher>(), Options.Create(new NotificationOptions { MaxAttempts = 3, BaseDelayMs = 1 }));
            var provider = new EmailNotificationProvider(repo, publisher, loggerFactory.CreateLogger<EmailNotificationProvider>());

            await provider.NotifyDomainStatusChangedAsync(empresa.Id, "example.com", "degraded", "reason");

            Assert.Equal(0, repo.UpdateCount);
        }

        [Fact]
        public async Task Notify_Records_Result_And_Attempts()
        {
            var repo = new FakeEmpresaRepository();
            var empresa = new Empresa("Test2");
            empresa.DefinirDominioPersonalizadoDesejado("example.org", DateTime.UtcNow);
            repo.Seed(empresa);

            var loggerFactory = LoggerFactory.Create(b => b.AddConsole());
            var publisher = new InMemoryNotificationPublisher(repo, loggerFactory.CreateLogger<InMemoryNotificationPublisher>(), Options.Create(new NotificationOptions { MaxAttempts = 3, BaseDelayMs = 1 }));
            var provider = new EmailNotificationProvider(repo, publisher, loggerFactory.CreateLogger<EmailNotificationProvider>());

            await provider.NotifyDomainStatusChangedAsync(empresa.Id, "example.org", "degraded", "dns failure");

            Assert.Equal(1, repo.UpdateCount);
            Assert.NotNull(repo.LastUpdated);
            Assert.Equal("degraded", repo.LastUpdated!.DominioPersonalizadoUltimaNotificacaoCategoria);
            Assert.Equal("dns failure", repo.LastUpdated.DominioPersonalizadoUltimaNotificacaoMotivo);
            Assert.Equal("sent", repo.LastUpdated.DominioPersonalizadoUltimaNotificacaoResultado);
            Assert.Equal(1, repo.LastUpdated.DominioPersonalizadoUltimaNotificacaoTentativas);
        }
    }
}
