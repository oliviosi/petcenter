using System;
using System.Threading.Tasks;
using Api.Modules.Empresas.Infrastructure;
using Api.Modules.Empresas.Domain;
using Microsoft.Extensions.Logging;
using Xunit;

namespace Api.Tests
{
    public class EmailNotificationProviderIntegrationTests
    {
        private class FailingThenSucceedingProvider : EmailNotificationProvider
        {
            private int _calls = 0;
            private readonly int _failuresBeforeSuccess;

            public FailingThenSucceedingProvider(IEmpresaRepository empresaRepository, ILogger<EmailNotificationProvider> logger, Microsoft.Extensions.Options.IOptions<NotificationOptions> options, int failuresBeforeSuccess = 2)
                : base(empresaRepository, logger, options)
            {
                _failuresBeforeSuccess = failuresBeforeSuccess;
            }

            protected override Task<bool> SendEmailAsync(Guid empresaId, string domain, string state, string reason)
            {
                _calls++;
                if (_calls <= _failuresBeforeSuccess)
                    return Task.FromResult(false);
                return Task.FromResult(true);
            }
        }

        [Fact]
        public async Task Provider_Retries_On_Transient_Failures_And_Records_Attempts()
        {
            var repo = new EmailNotificationProviderTests.FakeEmpresaRepository();
            var empresa = new Empresa("IntegrationTest");
            empresa.DefinirDominioPersonalizadoDesejado("example.net", DateTime.UtcNow);
            repo.Seed(empresa);

            var logger = LoggerFactory.Create(b => b.AddConsole()).CreateLogger<EmailNotificationProvider>();
            var options = Microsoft.Extensions.Options.Options.Create(new NotificationOptions { MaxAttempts = 3, BaseDelayMs = 10 });
            var provider = new FailingThenSucceedingProvider(repo, logger, options, failuresBeforeSuccess: 2);

            await provider.NotifyDomainStatusChangedAsync(empresa.Id, "example.net", "degraded", "dns flakey");

            Assert.Equal(1, repo.UpdateCount);
            Assert.NotNull(repo.LastUpdated);
            Assert.Equal("degraded", repo.LastUpdated!.DominioPersonalizadoUltimaNotificacaoCategoria);
            Assert.Equal("dns flakey", repo.LastUpdated.DominioPersonalizadoUltimaNotificacaoMotivo);
            Assert.Equal("sent", repo.LastUpdated.DominioPersonalizadoUltimaNotificacaoResultado);
            Assert.Equal(3, repo.LastUpdated.DominioPersonalizadoUltimaNotificacaoTentativas);
        }
    }
}
