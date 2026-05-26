using Api.Modules.Empresas.Domain;
using Api.Modules.Empresas.Infrastructure;
using Api.Modules.Empresas.Routes.GetPublicByHost;
using Api.Modules.Profissionais.Infrastructure;
using Api.Modules.Servicos.Infrastructure;
using Api.Tests.Support;

namespace Api.Tests.Empresas;

public class GetPublicEmpresaByHostServiceTests
{
    [Fact]
    public async Task HandleAsync_ShouldResolvePublishedEmpresaWhenActiveCustomDomainMatches()
    {
        using var db = TestData.CreateDbContext();
        var scenario = TestData.SeedPublicScenario(db, new DateOnly(2026, 1, 5));
        scenario.Empresa.DefinirDominioPersonalizadoDesejado("agenda.petcenter-vila.com");
        scenario.Empresa.AtivarDominioPersonalizado();
        await db.SaveChangesAsync();

        var sut = new GetPublicEmpresaByHostService(
            new EmpresaRepository(db),
            new ProfissionalRepository(db),
            new ServicoRepository(db));

        var response = await sut.HandleAsync("agenda.petcenter-vila.com");

        Assert.Equal(scenario.Empresa.Id, response.Id);
        Assert.Equal("pet-center-booking", response.Slug);
        Assert.Single(response.Profissionais);
        Assert.Single(response.Servicos);
    }

    [Fact]
    public async Task HandleAsync_ShouldIgnorePendingCustomDomainsAndRequireFallbackUntilActivation()
    {
        using var db = TestData.CreateDbContext();
        var scenario = TestData.SeedPublicScenario(db, new DateOnly(2026, 1, 5));
        scenario.Empresa.DefinirDominioPersonalizadoDesejado("agenda.petcenter-vila.com");
        await db.SaveChangesAsync();

        var sut = new GetPublicEmpresaByHostService(
            new EmpresaRepository(db),
            new ProfissionalRepository(db),
            new ServicoRepository(db));

        await Assert.ThrowsAsync<EmpresaPublicaNotFoundException>(() =>
            sut.HandleAsync("agenda.petcenter-vila.com"));
    }
}
