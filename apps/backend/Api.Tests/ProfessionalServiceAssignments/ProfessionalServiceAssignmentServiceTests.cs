using Api.Modules.ProfessionalServiceAssignments.Domain;
using Api.Modules.ProfessionalServiceAssignments.Infrastructure;
using Api.Modules.ProfessionalServiceAssignments.Routes.Create;
using Api.Modules.Profissionais.Domain;
using Api.Modules.Profissionais.Infrastructure;
using Api.Modules.Servicos.Infrastructure;
using Api.Tests.Support;

namespace Api.Tests.ProfessionalServiceAssignments;

public class ProfessionalServiceAssignmentServiceTests
{
    [Fact]
    public async Task HandleAsync_ShouldRejectDuplicateAssignments()
    {
        using var db = TestData.CreateDbContext();
        var availabilityDate = new DateOnly(2026, 1, 5);
        var scenario = TestData.SeedPublicScenario(db, availabilityDate);

        var service = new CreateProfessionalServiceAssignmentService(
            new ProfessionalServiceAssignmentRepository(db),
            new ProfissionalRepository(db),
            new ServicoRepository(db));

        var request = new CreateProfessionalServiceAssignmentRequest
        {
            EmpresaId = scenario.Empresa.Id,
            ProfessionalId = scenario.Professional.Id,
            ServiceId = scenario.Service.Id
        };

        await Assert.ThrowsAsync<ProfessionalServiceAssignmentConflictException>(() => service.HandleAsync(request));
    }

    [Fact]
    public async Task HandleAsync_ShouldRejectInactiveProfessional()
    {
        using var db = TestData.CreateDbContext();
        var availabilityDate = new DateOnly(2026, 1, 5);
        var scenario = TestData.SeedPublicScenario(db, availabilityDate);
        scenario.Professional.Desativar();
        db.Profissionais.Update(scenario.Professional);
        await db.SaveChangesAsync();

        var newService = new Api.Modules.Servicos.Domain.Servico(scenario.Empresa.Id, "Tosa", 45, 90m);
        db.Servicos.Add(newService);
        await db.SaveChangesAsync();

        var service = new CreateProfessionalServiceAssignmentService(
            new ProfessionalServiceAssignmentRepository(db),
            new ProfissionalRepository(db),
            new ServicoRepository(db));

        var request = new CreateProfessionalServiceAssignmentRequest
        {
            EmpresaId = scenario.Empresa.Id,
            ProfessionalId = scenario.Professional.Id,
            ServiceId = newService.Id
        };

        await Assert.ThrowsAsync<ProfessionalServiceAssignmentInactiveException>(() => service.HandleAsync(request));
    }
}
