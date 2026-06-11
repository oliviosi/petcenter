using System;
using System.Linq;
using System.Threading.Tasks;
using Api.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Api.Modules.Empresas.Infrastructure;

public class DomainHealthService : IDomainHealthService
{
    private readonly AppDbContext _db;

    public DomainHealthService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<DomainHealthDto> GetDomainHealthAsync(Guid empresaId, int recent = 20)
    {
        var total = await _db.DomainNotifications.CountAsync(d => d.EmpresaId == empresaId);
        var failed = await _db.DomainNotifications.CountAsync(d => d.EmpresaId == empresaId && d.Outcome == "failed");
        var items = await _db.DomainNotifications
            .Where(d => d.EmpresaId == empresaId)
            .OrderByDescending(d => d.CreatedAt)
            .Take(recent)
            .Select(d => new DomainHealthNotificationDto(d.Id, d.CreatedAt, d.Category, d.Reason, d.Outcome, d.Attempts))
            .ToListAsync();

        return new DomainHealthDto(total, failed, items);
    }

    public async Task<(IEnumerable<DomainHealthNotificationDto> Items, int Total)> GetNotificationsAsync(Guid empresaId, int page, int pageSize)
    {
        if (page < 1) page = 1;
        var query = _db.DomainNotifications.Where(d => d.EmpresaId == empresaId).OrderByDescending(d => d.CreatedAt);
        var total = await query.CountAsync();
        var items = await query.Skip((page - 1) * pageSize).Take(pageSize)
            .Select(d => new DomainHealthNotificationDto(d.Id, d.CreatedAt, d.Category, d.Reason, d.Outcome, d.Attempts))
            .ToListAsync();
        return (items, total);
    }
}
