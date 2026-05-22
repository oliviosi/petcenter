using Api.Infrastructure.Persistence;
using Api.Modules.Bookings.Domain;
using Api.Modules.Empresas.Domain;
using Api.Modules.Empresas.Infrastructure;
using Api.Modules.Empresas.Routes.ListPublic;
using Api.Modules.Profissionais.Domain;
using Api.Tests.Support;

namespace Api.Tests.Empresas;

public class ListPublicEmpresasServiceTests
{
    [Fact]
    public async Task HandleAsync_ShouldReturnComputedRatingSummaryAndKeepUnratedPetshopsVisible()
    {
        using var db = TestData.CreateDbContext();
        var highlyRated = SeedPublicEmpresa(db, "Pet Alpha", "pet-alpha");
        var lowerRated = SeedPublicEmpresa(db, "Pet Beta", "pet-beta");
        var unrated = SeedPublicEmpresa(db, "Pet Gamma", "pet-gamma");

        AddFeedback(db, highlyRated.Empresa.Id, highlyRated.Profissional.Id, 5);
        AddFeedback(db, highlyRated.Empresa.Id, highlyRated.Profissional.Id, 4);
        AddFeedback(db, lowerRated.Empresa.Id, lowerRated.Profissional.Id, 3);
        await db.SaveChangesAsync();

        var sut = new ListPublicEmpresasService(new EmpresaRepository(db));

        var response = await sut.HandleAsync(new ListPublicEmpresasRequest());

        Assert.Equal(3, response.Count);

        var highlyRatedResponse = Assert.Single(response, item => item.Id == highlyRated.Empresa.Id);
        Assert.Equal(4.5m, highlyRatedResponse.AverageRating);
        Assert.Equal(2, highlyRatedResponse.FeedbackCount);

        var lowerRatedResponse = Assert.Single(response, item => item.Id == lowerRated.Empresa.Id);
        Assert.Equal(3m, lowerRatedResponse.AverageRating);
        Assert.Equal(1, lowerRatedResponse.FeedbackCount);

        var unratedResponse = Assert.Single(response, item => item.Id == unrated.Empresa.Id);
        Assert.Null(unratedResponse.AverageRating);
        Assert.Null(unratedResponse.FeedbackCount);
    }

    [Fact]
    public async Task HandleAsync_ShouldExcludeUnratedPetshopsWhenFilteringByMinimumRating()
    {
        using var db = TestData.CreateDbContext();
        var highlyRated = SeedPublicEmpresa(db, "Pet Alpha", "pet-alpha");
        var lowerRated = SeedPublicEmpresa(db, "Pet Beta", "pet-beta");
        _ = SeedPublicEmpresa(db, "Pet Gamma", "pet-gamma");

        AddFeedback(db, highlyRated.Empresa.Id, highlyRated.Profissional.Id, 5);
        AddFeedback(db, highlyRated.Empresa.Id, highlyRated.Profissional.Id, 4);
        AddFeedback(db, lowerRated.Empresa.Id, lowerRated.Profissional.Id, 3);
        await db.SaveChangesAsync();

        var sut = new ListPublicEmpresasService(new EmpresaRepository(db));

        var response = await sut.HandleAsync(new ListPublicEmpresasRequest
        {
            MinRating = 4m
        });

        var ratedPetshop = Assert.Single(response);
        Assert.Equal(highlyRated.Empresa.Id, ratedPetshop.Id);
        Assert.Equal(4.5m, ratedPetshop.AverageRating);
        Assert.Equal(2, ratedPetshop.FeedbackCount);
    }

    [Fact]
    public async Task HandleAsync_ShouldOrderRatedPetshopsBeforeUnratedWhenSortingByRating()
    {
        using var db = TestData.CreateDbContext();
        var highlyRated = SeedPublicEmpresa(db, "Pet Alpha", "pet-alpha");
        var lowerRated = SeedPublicEmpresa(db, "Pet Beta", "pet-beta");
        var unrated = SeedPublicEmpresa(db, "Pet Gamma", "pet-gamma");

        AddFeedback(db, highlyRated.Empresa.Id, highlyRated.Profissional.Id, 5);
        AddFeedback(db, lowerRated.Empresa.Id, lowerRated.Profissional.Id, 3);
        await db.SaveChangesAsync();

        var sut = new ListPublicEmpresasService(new EmpresaRepository(db));

        var response = await sut.HandleAsync(new ListPublicEmpresasRequest
        {
            OrderBy = "rating"
        });

        Assert.Equal(
            [highlyRated.Empresa.Id, lowerRated.Empresa.Id, unrated.Empresa.Id],
            response.Select(item => item.Id).ToArray());
    }

    private static SeededEmpresa SeedPublicEmpresa(AppDbContext db, string nome, string slug)
    {
        var empresa = new Empresa(nome);
        empresa.DefinirSlug(slug);
        empresa.DefinirDescricao($"Descrição de {nome}.");
        empresa.DefinirCidade("São Paulo");
        empresa.DefinirBairro("Centro");
        empresa.DefinirResumoContato("11 99999-0000");
        empresa.DefinirResumoEndereco("Rua das Flores, 100");
        empresa.PublicarNoCatalogo();

        var profissional = new Profissional(empresa.Id, $"Profissional {nome}", "Banho");

        db.Empresas.Add(empresa);
        db.Profissionais.Add(profissional);

        return new SeededEmpresa
        {
            Empresa = empresa,
            Profissional = profissional
        };
    }

    private static void AddFeedback(AppDbContext db, Guid empresaId, Guid professionalId, int petshopRating)
    {
        db.BookingFeedbacks.Add(new BookingFeedback(
            Guid.NewGuid(),
            empresaId,
            professionalId,
            5,
            petshopRating,
            null,
            TestData.ToUtc(new DateOnly(2026, 1, 5), new TimeOnly(12, 0))));
    }

    private class SeededEmpresa
    {
        public Empresa Empresa { get; set; } = null!;
        public Profissional Profissional { get; set; } = null!;
    }
}
