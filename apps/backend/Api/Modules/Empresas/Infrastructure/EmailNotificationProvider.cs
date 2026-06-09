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

        // TODO: integrate with real email infrastructure. For now, set metadata as 'sent' mock.
        var categoria = state;
        var resultado = "sent";
        var tentativas = 1;
        var enviadaEm = DateTime.UtcNow;

        try
        {
            empresa.RegistrarNotificacaoDominioPersonalizado(categoria, reason, enviadaEm, resultado, tentativas);
            await _empresaRepository.UpdateAsync(empresa);

            _logger.LogInformation("Recorded domain notification for Empresa {EmpresaId}: {State} {Domain}", empresaId, state, domain);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to persist domain notification for Empresa {EmpresaId}", empresaId);
        }
    }
}
