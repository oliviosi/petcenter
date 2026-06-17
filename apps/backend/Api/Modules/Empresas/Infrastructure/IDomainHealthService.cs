using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Modules.Empresas.Infrastructure;

public record DomainHealthNotificationDto(Guid Id, DateTime CreatedAt, string Category, string? Reason, string? Outcome, int Attempts);

public record DomainHealthDto(int TotalNotifications, int FailedNotifications, IEnumerable<DomainHealthNotificationDto> RecentNotifications);

public interface IDomainHealthService
{
    Task<DomainHealthDto> GetDomainHealthAsync(Guid empresaId, int recent = 20);
    Task<(IEnumerable<DomainHealthNotificationDto> Items, int Total)> GetNotificationsAsync(Guid empresaId, int page, int pageSize, string? category = null, string? outcome = null);
}
