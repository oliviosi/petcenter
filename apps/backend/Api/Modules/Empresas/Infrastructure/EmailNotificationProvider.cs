using System;
using System.Threading.Tasks;
using Api.Modules.Empresas.Domain;

namespace Api.Modules.Empresas.Infrastructure;

public class EmailNotificationProvider : INotificationService
{
    private readonly IEmpresaRepository _empresaRepository;
    private readonly ILogger<EmailNotificationProvider> _logger;

    public EmailNotificationProvider(IEmpresaRepository empresaRepository, ILogger<EmailNotificationProvider> logger)
    {
        _empresaRepository = empresaRepository;
        _logger = logger;
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
        var sucesso = false;
        var resultado = "failed";
        var enviadaEm = DateTime.UtcNow;

        var maxAttempts = 3;
        var baseDelayMs = 500; // first-slice default; make configurable later

        for (var attempt = 1; attempt <= maxAttempts; attempt++)
        {
            tentativas = attempt;
            try
            {
                // Placeholder send: integrate a real email send here.
                _logger.LogInformation("(mock) Sending domain notification to Empresa {EmpresaId} (attempt {Attempt}) - {State} {Domain}", empresaId, attempt, state, domain);
                // Simulate success immediately for now. Replace with actual SMTP/HTTP call.
                sucesso = true;
                resultado = "sent";
                break;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Attempt {Attempt} failed sending domain notification for Empresa {EmpresaId}", attempt, empresaId);
                // exponential backoff
                var delay = baseDelayMs * (int)Math.Pow(2, attempt - 1);
                await Task.Delay(delay);
            }
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
    }
}
