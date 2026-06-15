using Api.Infrastructure.Persistence;
using Api.Modules.Auth.Routes;
using Api.Modules.Bookings.Routes;
using Api.Modules.Disponibilidade.Routes;
using Api.Modules.Empresas.Routes;
using Api.Modules.ProfessionalServiceAssignments.Routes;
using Api.Modules.Profissionais.Routes;
using Api.Modules.Servicos.Routes;
using Api.Modules.Clients.Routes;

namespace Api.Extensions;

public static class WebApplicationExtensions
{
    public static WebApplication MapModuleEndpoints(this WebApplication app)
    {
        Console.WriteLine("Mapping module endpoints: Auth"); app.MapAuthEndpoints();
        Console.WriteLine("Mapping module endpoints: Clients"); app.MapClientsEndpoints();
        Console.WriteLine("Mapping module endpoints: Empresas"); app.MapEmpresasEndpoints();
        Console.WriteLine("Mapping module endpoints: Profissionais"); app.MapProfissionaisEndpoints();
        Console.WriteLine("Mapping module endpoints: Servicos"); app.MapServicosEndpoints();
        Console.WriteLine("Mapping module endpoints: Disponibilidade"); app.MapDisponibilidadeEndpoints();
        Console.WriteLine("Mapping module endpoints: ProfessionalServiceAssignments"); app.MapProfessionalServiceAssignmentsEndpoints();
        Console.WriteLine("Mapping module endpoints: Bookings"); app.MapBookingsEndpoints();
        return app;
    }

    public static async Task SeedDevelopmentDataAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        await DataSeeder.SeedAsync(scope.ServiceProvider);
    }
}
