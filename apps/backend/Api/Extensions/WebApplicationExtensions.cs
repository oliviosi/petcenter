using Api.Infrastructure.Persistence;
using Api.Modules.Auth.Routes;

namespace Api.Extensions;

public static class WebApplicationExtensions
{
    public static WebApplication MapModuleEndpoints(this WebApplication app)
    {
        app.MapAuthEndpoints();
        return app;
    }

    public static async Task SeedDevelopmentDataAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        await DataSeeder.SeedAsync(scope.ServiceProvider);
    }
}
