using System;

namespace Api.Modules.Empresas.Infrastructure
{
    public record NotificationMessage
    (
        Guid NotificationId,
        Guid EmpresaId,
        string Domain,
        string State,
        string Reason,
        DateTime RequestedAt
    );
}
