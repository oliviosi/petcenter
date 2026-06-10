using System;
using System.Threading.Tasks;
using System.Diagnostics.Metrics;
using Api.Modules.Empresas.Domain;

namespace Api.Modules.Empresas.Infrastructure;

public class EmailNotificationProvider : INotificationService
{
    private readonly IEmpresaRepository _empresaRepository;
    private readonly ILogger<EmailNotificationProvider> _logger;
    private readonly NotificationOptions _options;

    // Metrics
    private static readonly Meter _meter = new("petcenter.notifications", "1.0");
    private static readonly Counter<long> _sentCounter = _meter.CreateCounter<long>("notifications_sent_total", description: "Total notifications sent (success/failure)");
    private static readonly Counter<long> _attemptsCounter = _meter.CreateCounter<long>("notifications_attempts_total", description: "Total notification send attempts");

    public EmailNotificationProvider(IEmpresaRepository empresaRepository, ILogger<EmailNotificationProvider> logger, Microsoft.Extensions.Options.IOptions<NotificationOptions> options)
    {
        _empresaRepository = empresaRepository;
        _logger = logger;
        _options = options?.Value ?? new NotificationOptions { MaxAttempts = 3, BaseDelayMs = 500 };
    }

    public async Task NotifyDomainStatusChangedAsync(Guid empresaId, string domain, string state, string reason)
    {
        var empresa = await _empresaRepository.GetByIdAsync(empresaId);
        if (empresa is null)
        {
            _logger.LogWarning("Empresa {EmpresaId} not found when sending domain notification.", empresaId);
            return;
        }

        // Deduplicate: if the last notification category matches the new state, skip sending.
        if (string.Equals(empresa.DominioPersonalizadoUltimaNotificacaoCategoria, state, StringComparison.OrdinalIgnoreCase))
        {
            _logger.LogInformation("Skipping duplicate domain notification for Empresa {EmpresaId}: {State}", empresaId, state);
            return;
        }

        // Basic retry/backoff (first-slice): try up to 3 attempts with exponential backoff.
        var categoria = state;
        var tentativas = 0;
        var resultado = "failed";
        var enviadaEm = DateTime.UtcNow;

        var maxAttempts = _options.MaxAttempts;
        var baseDelayMs = _options.BaseDelayMs; // configurable via options

        for (var attempt = 1; attempt <= maxAttempts; attempt++)
        {
            tentativas = attempt;
            try
            {
                // Send using provider hook (overridable for tests). Real provider should integrate SMTP/HTTP client here.
                _logger.LogInformation("Sending domain notification to Empresa {EmpresaId} (attempt {Attempt}) - {State} {Domain}", empresaId, attempt, state, domain);
                var sendSuccess = await SendEmailAsync(empresaId, domain, state, reason);
                _attemptsCounter.Add(1);
                if (sendSuccess)
                {
                    resultado = "sent";
                    _sentCounter.Add(1);
                    break;
                }
                // transient failure — will retry if attempts remain
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Attempt {Attempt} failed sending domain notification for Empresa {EmpresaId}", attempt, empresaId);
                // exponential backoff
                var delay = baseDelayMs * (int)Math.Pow(2, attempt - 1);
                await Task.Delay(delay);
            }
        }

        if (resultado != "sent")
        {
            // Count as failure once all attempts exhausted
            _sentCounter.Add(1);
        }

        try
        {
            empresa.RegistrarNotificacaoDominioPersonalizado(categoria, reason, DateTime.UtcNow, resultado, tentativas);
            await _empresaRepository.UpdateAsync(empresa);

            _logger.LogInformation("Recorded domain notification for Empresa {EmpresaId}: {State} {Domain} (result={Resultado} attempts={Attempts})", empresaId, state, domain, resultado, tentativas);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to persist domain notification for Empresa {EmpresaId}", empresaId);
        }
        
        /// <summary>
        /// Override in tests or real providers to perform the actual send.
        /// Return true on success, false to indicate a transient error (will be retried).
        /// </summary>
        protected virtual Task<bool> SendEmailAsync(Guid empresaId, string domain, string state, string reason)
        {
            // Default implementation simulates immediate success.
            return Task.FromResult(true);
        }
    }
}
