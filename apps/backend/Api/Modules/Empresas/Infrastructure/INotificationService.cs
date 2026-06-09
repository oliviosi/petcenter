using System;
using System.Threading.Tasks;

namespace Api.Modules.Empresas.Infrastructure;

public interface INotificationService
{
    Task NotifyDomainStatusChangedAsync(Guid empresaId, string domain, string state, string reason);
}
