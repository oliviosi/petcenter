using System;
using System.Threading.Tasks;
using System.Diagnostics.Metrics;
using Microsoft.Extensions.Logging;

namespace Api.Modules.Empresas.Infrastructure
{
    public class InMemoryNotificationPublisher : INotificationPublisher
    {
        private readonly IEmpresaRepository _empresaRepository;
        private readonly ILogger<InMemoryNotificationPublisher> _logger;
        private readonly NotificationOptions _options;

        private static readonly Meter _meter = new("petcenter.notifications", "1.0");
        private static readonly Counter<long> _sentCounter = _meter.CreateCounter<long>("notifications_sent_total", description: "Total notifications successfully sent");
        private static readonly Counter<long> _failedCounter = _meter.CreateCounter<long>("notifications_failed_total", description: "Total notifications failed after retries");
        private static readonly Counter<long> _attemptsCounter = _meter.CreateCounter<long>("notifications_attempts_total", description: "Total notification send attempts");

        public InMemoryNotificationPublisher(IEmpresaRepository empresaRepository, ILogger<InMemoryNotificationPublisher> logger, Microsoft.Extensions.Options.IOptions<NotificationOptions> options)
        {
            _empresaRepository = empresaRepository;
            _logger = logger;
            _options = options?.Value ?? new NotificationOptions { MaxAttempts = 3, BaseDelayMs = 500 };
        }

        public async Task PublishAsync(NotificationMessage message)
        {
            // For in-memory testing we process immediately with the same retry semantics previously implemented in EmailNotificationProvider.
            var empresa = await _empresaRepository.GetByIdAsync(message.EmpresaId);
            if (empresa is null)
            {
                _logger.LogWarning("Empresa {EmpresaId} not found when publishing domain notification.", message.EmpresaId);
                return;
            }

            // Deduplicate: if the last notification category matches the new state, skip sending.
            if (string.Equals(empresa.DominioPersonalizadoUltimaNotificacaoCategoria, message.State, StringComparison.OrdinalIgnoreCase))
            {
                _logger.LogInformation("Skipping duplicate domain notification for Empresa {EmpresaId}: {State}", message.EmpresaId, message.State);
                return;
            }

            var resultado = "failed";
            var tentativas = 0;
            var maxAttempts = _options.MaxAttempts;
            var baseDelayMs = _options.BaseDelayMs;

            for (var attempt = 1; attempt <= maxAttempts; attempt++)
            {
                tentativas = attempt;
                try
                {
                    _logger.LogInformation("[InMemoryPublisher] Sending domain notification to Empresa {EmpresaId} (attempt {Attempt}) - {State} {Domain}", message.EmpresaId, attempt, message.State, message.Domain);
                    // Simulated send - in production a worker would do real send via SMTP/HTTP provider.
                    var sendSuccess = await SimulateSendAsync(message);
                    _attemptsCounter.Add(1);
                    if (sendSuccess)
                    {
                        resultado = "sent";
                        _sentCounter.Add(1);
                        break;
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Attempt {Attempt} failed sending domain notification for Empresa {EmpresaId}", attempt, message.EmpresaId);
                    var delay = baseDelayMs * (int)Math.Pow(2, attempt - 1);
                    await Task.Delay(delay);
                }
            }

            if (resultado != "sent")
            {
                _failedCounter.Add(1);
            }

            try
            {
                empresa.RegistrarNotificacaoDominioPersonalizado(message.State, message.Reason, DateTime.UtcNow, resultado, tentativas);
                await _empresaRepository.UpdateAsync(empresa);
                _logger.LogInformation("[InMemoryPublisher] Recorded domain notification for Empresa {EmpresaId}: {State} {Domain} (result={Resultado} attempts={Attempts})", message.EmpresaId, message.State, message.Domain, resultado, tentativas);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to persist domain notification for Empresa {EmpresaId}", message.EmpresaId);
            }
        }

        protected virtual Task<bool> SimulateSendAsync(NotificationMessage message)
        {
            // Default in-memory simulation: succeed immediately. Tests can replace behavior by mocking the publisher.
            return Task.FromResult(true);
        }
    }
}
