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

        var adminPassword = configuration["Seed:AdminPassword"];
        if (string.IsNullOrWhiteSpace(adminPassword))
        {
            logger.LogInformation("Skipping development seed because Seed:AdminPassword is not configured.");
            return;
        }

        // If database already has empresas, attempt to ensure at least one is public for local testing.
        if (await db.Empresas.AnyAsync())
        {
            var existing = await db.Empresas.FirstAsync();
            var updated = false;

            // Ensure required public profile fields are present for publishing
            try
            {
                if (string.IsNullOrWhiteSpace(existing.Slug))
                {
                    existing.DefinirSlug((configuration["Seed:EmpresaSlug"] ?? "pet-center-dev").ToLowerInvariant());
                    updated = true;
                }

                if (string.IsNullOrWhiteSpace(existing.Descricao))
                {
                    existing.DefinirDescricao(configuration["Seed:EmpresaDescricao"] ?? "Petshop de desenvolvimento");
                    updated = true;
                }

                if (string.IsNullOrWhiteSpace(existing.Cidade))
                {
                    existing.DefinirCidade(configuration["Seed:EmpresaCidade"] ?? "Cidade");
                    updated = true;
                }

                if (string.IsNullOrWhiteSpace(existing.Bairro))
                {
                    existing.DefinirBairro(configuration["Seed:EmpresaBairro"] ?? "Bairro");
                    updated = true;
                }

                if (string.IsNullOrWhiteSpace(existing.ResumoContato))
                {
                    existing.DefinirResumoContato(configuration["Seed:EmpresaResumoContato"] ?? "(11) 99999-9999");
                    updated = true;
                }

                if (string.IsNullOrWhiteSpace(existing.ResumoEndereco))
                {
                    existing.DefinirResumoEndereco(configuration["Seed:EmpresaResumoEndereco"] ?? "Rua Exemplo, 123");
                    updated = true;
                }

                if (!existing.Publica)
                {
                    // attempt to publish if profile is complete
                    try
                    {
                        existing.PublicarNoCatalogo();
                        updated = true;
                    }
                    catch
                    {
                        // ignore if still incomplete
                    }
                }

                if (updated)
                {
                    db.Empresas.Update(existing);
                    await db.SaveChangesAsync();
                    logger.LogInformation("Updated existing Empresa to be publicly visible for development.");
                }
            }
            catch (Exception ex)
            {
                logger.LogWarning(ex, "Failed to update existing Empresa during seed.");
            }

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
