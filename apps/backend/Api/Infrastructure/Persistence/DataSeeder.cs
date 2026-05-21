using Api.Modules.Empresas.Domain;
using Api.Modules.Usuarios.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Api.Infrastructure.Persistence;

public static class DataSeeder
{
    public static async Task SeedAsync(IServiceProvider services)
    {
        var db = services.GetRequiredService<AppDbContext>();
        var configuration = services.GetRequiredService<IConfiguration>();
        var logger = services.GetRequiredService<ILoggerFactory>().CreateLogger(nameof(DataSeeder));
        await db.Database.MigrateAsync();

        if (await db.Empresas.AnyAsync())
            return;

        var adminPassword = configuration["Seed:AdminPassword"];
        if (string.IsNullOrWhiteSpace(adminPassword))
        {
            logger.LogInformation("Skipping development seed because Seed:AdminPassword is not configured.");
            return;
        }

        var empresaName = configuration["Seed:EmpresaName"] ?? "Pet Center Dev";
        var adminEmail = configuration["Seed:AdminEmail"] ?? "admin@petcenter.dev";

        var empresa = new Empresa(empresaName);
        db.Empresas.Add(empresa);

        var senhaHash = BCrypt.Net.BCrypt.HashPassword(adminPassword);
        var usuario = new Usuario(adminEmail, senhaHash, empresa.Id);
        db.Usuarios.Add(usuario);

        await db.SaveChangesAsync();
    }
}
