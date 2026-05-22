using Api.Infrastructure.Persistence;
using Api.Modules.Auth.Routes;
using Api.Modules.Bookings.Routes;
using Api.Modules.Disponibilidade.Routes;
using Api.Modules.Empresas.Routes;
using Api.Modules.ProfessionalServiceAssignments.Routes;
using Api.Modules.Profissionais.Routes;
using Api.Modules.Servicos.Routes;

namespace Api.Extensions;

public static class WebApplicationExtensions
{
    public static WebApplication MapModuleEndpoints(this WebApplication app)
    {
        app.MapAuthEndpoints();
        app.MapEmpresasEndpoints();
        app.MapProfissionaisEndpoints();
        app.MapServicosEndpoints();
        app.MapDisponibilidadeEndpoints();
        app.MapProfessionalServiceAssignmentsEndpoints();
        app.MapBookingsEndpoints();
        return app;
    }

    public static async Task SeedDevelopmentDataAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        await DataSeeder.SeedAsync(scope.ServiceProvider);
    }
}
