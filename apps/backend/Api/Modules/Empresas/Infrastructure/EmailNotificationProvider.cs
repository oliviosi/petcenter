using System;
using System.Threading.Tasks;
using Api.Modules.Empresas.Domain;
using Microsoft.Extensions.Logging;

namespace Api.Modules.Empresas.Infrastructure;

public class EmailNotificationProvider : INotificationService
{
    private readonly INotificationPublisher _publisher;
    private readonly IEmpresaRepository _empresaRepository;
    private readonly ILogger<EmailNotificationProvider> _logger;

    public EmailNotificationProvider(IEmpresaRepository empresaRepository, INotificationPublisher publisher, ILogger<EmailNotificationProvider> logger)
    {
        _empresaRepository = empresaRepository;
        _publisher = publisher;
        _logger = logger;
    }

    public async Task NotifyDomainStatusChangedAsync(Guid empresaId, string domain, string state, string reason)
    {
        var empresa = await _empresaRepository.GetByIdAsync(empresaId);
        if (empresa is null)
        {
            _logger.LogWarning("Empresa {EmpresaId} not found when enqueueing domain notification.", empresaId);
            return;
        }

        // Deduplicate early: if the last notification category matches the new state, skip publishing.
        if (string.Equals(empresa.DominioPersonalizadoUltimaNotificacaoCategoria, state, StringComparison.OrdinalIgnoreCase))
        {
            _logger.LogInformation("Skipping duplicate domain notification for Empresa {EmpresaId}: {State}", empresaId, state);
            return;
        }

        var message = new NotificationMessage(Guid.NewGuid(), empresaId, domain, state, reason ?? string.Empty, DateTime.UtcNow);

        _logger.LogInformation("Publishing domain notification request for Empresa {EmpresaId} - {State} {Domain}", empresaId, state, domain);
        await _publisher.PublishAsync(message);
    }
}
