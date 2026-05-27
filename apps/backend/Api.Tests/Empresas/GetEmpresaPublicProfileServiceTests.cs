using Api.Modules.Empresas.Domain;
using Api.Modules.Empresas.Infrastructure;
using Api.Modules.Empresas.Routes.GetPublicProfile;
using Api.Tests.Support;

namespace Api.Tests.Empresas;

public class GetEmpresaPublicProfileServiceTests
{
    [Fact]
    public async Task HandleAsync_ShouldExposeVerificationMetadata()
    {
        using var db = TestData.CreateDbContext();
        var empresa = new Empresa("Pet Center Vila");
        empresa.DefinirDominioPersonalizadoDesejado(
            "agenda.petcenter-vila.com",
            new DateTime(2026, 6, 27, 9, 0, 0, DateTimeKind.Utc));
        empresa.RegistrarFalhaDominioPersonalizado(
            "O domínio ainda não aponta para o destino esperado.",
            new DateTime(2026, 6, 27, 9, 15, 0, DateTimeKind.Utc),
            new DateTime(2026, 6, 27, 9, 30, 0, DateTimeKind.Utc));
        db.Empresas.Add(empresa);
        await db.SaveChangesAsync();

        var sut = new GetEmpresaPublicProfileService(new EmpresaRepository(db));

        var response = await sut.HandleAsync(empresa.Id);

        Assert.Equal("agenda.petcenter-vila.com", response.DominioPersonalizadoDesejado);
        Assert.Equal("failed", response.DominioPersonalizadoStatus);
        Assert.Equal("O domínio ainda não aponta para o destino esperado.", response.DominioPersonalizadoUltimaFalha);
        Assert.Equal(new DateTime(2026, 6, 27, 9, 15, 0, DateTimeKind.Utc), response.DominioPersonalizadoUltimaTentativaEm);
        Assert.Equal(new DateTime(2026, 6, 27, 9, 30, 0, DateTimeKind.Utc), response.DominioPersonalizadoProximaTentativaEm);
    }
}
