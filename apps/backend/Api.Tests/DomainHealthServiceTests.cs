using System;
using System.Linq;
using System.Threading.Tasks;
using Api.Modules.Empresas.Domain;
using Api.Modules.Empresas.Infrastructure;
using Api.Tests.Support;
using System;
using System.Linq;
using System.Threading.Tasks;
using Api.Modules.Empresas.Domain;
using Api.Modules.Empresas.Infrastructure;
using Api.Tests.Support;
using Xunit;

namespace Api.Tests;

public class DomainHealthServiceTests
{
    [Fact]
    public async Task GetDomainHealthAsync_returns_counts_and_recent()
    {
        using var db = TestData.CreateDbContext();
        var empresa = new Empresa("T1");
        db.Empresas.Add(empresa);

        db.DomainNotifications.Add(new DomainNotification { Id = Guid.NewGuid(), EmpresaId = empresa.Id, Category = "degraded", CreatedAt = DateTime.UtcNow.AddMinutes(-10), Outcome = "failed", Attempts = 1 });
        db.DomainNotifications.Add(new DomainNotification { Id = Guid.NewGuid(), EmpresaId = empresa.Id, Category = "recovered", CreatedAt = DateTime.UtcNow.AddMinutes(-5), Outcome = "success", Attempts = 1 });
        db.SaveChanges();

        var service = new DomainHealthService(db);

        var result = await service.GetDomainHealthAsync(empresa.Id, recent: 10);

        Assert.Equal(2, result.TotalNotifications);
        Assert.Equal(1, result.FailedNotifications);
        Assert.Equal(2, result.RecentNotifications.Count());
    }
}
