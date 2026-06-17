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

        // Determine or create a development Empresa to seed other data against
        Api.Modules.Empresas.Domain.Empresa empresa;

        if (await db.Empresas.AnyAsync())
        {
            var existing = await db.Empresas.FirstAsync();
            empresa = existing;
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
        }
        else
        {
            var empresaName = configuration["Seed:EmpresaName"] ?? "Pet Center Dev";
            var adminEmail = configuration["Seed:AdminEmail"] ?? "admin@petcenter.dev";

            empresa = new Api.Modules.Empresas.Domain.Empresa(empresaName);
            db.Empresas.Add(empresa);

            var senhaHash = BCrypt.Net.BCrypt.HashPassword(adminPassword);
            var usuario = new Api.Modules.Usuarios.Domain.Usuario(adminEmail, senhaHash, empresa.Id);
            db.Usuarios.Add(usuario);

            await db.SaveChangesAsync();
        }

        // Development-only: ensure there's at least one service, professional and availability for this empresa
        try
        {
            var existingServices = await db.Servicos.Where(s => s.EmpresaId == empresa.Id).ToListAsync();
            if (!existingServices.Any())
            {
                var servico = new Api.Modules.Servicos.Domain.Servico(empresa.Id, "Banho e Tosa (Dev)", 30, 50m);
                db.Servicos.Add(servico);

                var profissional = new Api.Modules.Profissionais.Domain.Profissional(empresa.Id, "Profissional Dev");
                db.Profissionais.Add(profissional);

                await db.SaveChangesAsync();

                var disponibilidade = new Api.Modules.Disponibilidade.Domain.DisponibilidadeProfissional(
                    profissional.Id,
                    DateTime.UtcNow.DayOfWeek,
                    TimeOnly.Parse("09:00"),
                    TimeOnly.Parse("17:00"));
                db.DisponibilidadesProfissionais.Add(disponibilidade);

                var assignment = new Api.Modules.ProfessionalServiceAssignments.Domain.ProfessionalServiceAssignment(
                    empresa.Id,
                    profissional.Id,
                    servico.Id);
                db.ProfessionalServiceAssignments.Add(assignment);

                await db.SaveChangesAsync();
                logger.LogInformation("Seeded dev service, professional and availability for local testing.");
            }
            else
            {
                // If services exist, ensure at least one professional is assigned to one of them and has availability.
                var existingAssignments = await db.ProfessionalServiceAssignments.AnyAsync(a => a.EmpresaId == empresa.Id);
                if (!existingAssignments)
                {
                    var servico = existingServices.First();
                    var profissional = await db.Profissionais.FirstOrDefaultAsync(p => p.EmpresaId == empresa.Id);
                    if (profissional == null)
                    {
                        profissional = new Api.Modules.Profissionais.Domain.Profissional(empresa.Id, "Profissional Dev");
                        db.Profissionais.Add(profissional);
                        await db.SaveChangesAsync();
                    }

                    // ensure availability exists
                    var hasAvailability = await db.DisponibilidadesProfissionais.AnyAsync(d => d.ProfissionalId == profissional.Id);
                    if (!hasAvailability)
                    {
                        var disponibilidade = new Api.Modules.Disponibilidade.Domain.DisponibilidadeProfissional(
                            profissional.Id,
                            DateTime.UtcNow.DayOfWeek,
                            TimeOnly.Parse("09:00"),
                            TimeOnly.Parse("17:00"));
                        db.DisponibilidadesProfissionais.Add(disponibilidade);
                    }

                    var assignment = new Api.Modules.ProfessionalServiceAssignments.Domain.ProfessionalServiceAssignment(
                        empresa.Id,
                        profissional.Id,
                        servico.Id);
                    db.ProfessionalServiceAssignments.Add(assignment);
                    await db.SaveChangesAsync();
                    logger.LogInformation("Linked existing service to a professional and seeded availability for development.");
                }
            }
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Dev seeding of services/professionals failed.");
        }
    }
}
