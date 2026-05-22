using Api.Infrastructure.Persistence;
using Api.Modules.Bookings.Domain;
using Api.Modules.Empresas.Infrastructure;
using Api.Modules.Empresas.Routes.GetPublicBySlug;
using Api.Modules.Profissionais.Infrastructure;
using Api.Modules.Servicos.Infrastructure;
using Api.Tests.Support;

namespace Api.Tests.Empresas;

public class GetPublicEmpresaBySlugServiceTests
{
    [Fact]
    public async Task HandleAsync_ShouldReturnRatingSummaryWhenFeedbackExists()
    {
        using var db = TestData.CreateDbContext();
        var scenario = TestData.SeedPublicScenario(db, new DateOnly(2026, 1, 5));

        db.BookingFeedbacks.Add(new BookingFeedback(
            Guid.NewGuid(),
            scenario.Empresa.Id,
            scenario.Professional.Id,
            5,
            5,
            "Ótimo atendimento.",
            TestData.ToUtc(new DateOnly(2026, 1, 5), new TimeOnly(12, 0))));
        db.BookingFeedbacks.Add(new BookingFeedback(
            Guid.NewGuid(),
            scenario.Empresa.Id,
            scenario.Professional.Id,
            4,
            4,
            "Muito bom.",
            TestData.ToUtc(new DateOnly(2026, 1, 6), new TimeOnly(12, 0))));
        await db.SaveChangesAsync();

        var sut = new GetPublicEmpresaBySlugService(
            new EmpresaRepository(db),
            new ProfissionalRepository(db),
            new ServicoRepository(db));

        var response = await sut.HandleAsync(scenario.Empresa.Slug!);

        Assert.Equal(scenario.Empresa.Id, response.Id);
        Assert.Equal(4.5m, response.AverageRating);
        Assert.Equal(2, response.FeedbackCount);
        Assert.Single(response.Profissionais);
        Assert.Single(response.Servicos);
    }
}
