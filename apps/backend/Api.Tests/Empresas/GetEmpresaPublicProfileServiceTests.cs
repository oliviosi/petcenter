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
        empresa.MarcarDominioPersonalizadoDnsVerificado(
            new DateTime(2026, 6, 27, 9, 15, 0, DateTimeKind.Utc),
            new DateTime(2026, 6, 27, 9, 15, 0, DateTimeKind.Utc));
        empresa.RegistrarFalhaTlsDominioPersonalizado(
            "HTTPS ainda não está pronto para o domínio.",
            new DateTime(2026, 6, 27, 9, 20, 0, DateTimeKind.Utc),
            new DateTime(2026, 6, 27, 9, 35, 0, DateTimeKind.Utc));
        db.Empresas.Add(empresa);
        await db.SaveChangesAsync();

        var sut = new GetEmpresaPublicProfileService(new EmpresaRepository(db));

        var response = await sut.HandleAsync(empresa.Id);

        Assert.Equal("agenda.petcenter-vila.com", response.DominioPersonalizadoDesejado);
        Assert.Equal("tls_failed", response.DominioPersonalizadoStatus);
        Assert.Equal("verified", response.DominioPersonalizadoDnsStatus);
        Assert.Equal(new DateTime(2026, 6, 27, 9, 15, 0, DateTimeKind.Utc), response.DominioPersonalizadoDnsVerificadoEm);
        Assert.Equal("failed", response.DominioPersonalizadoTlsStatus);
        Assert.Equal("HTTPS ainda não está pronto para o domínio.", response.DominioPersonalizadoTlsUltimaFalha);
        Assert.Equal(new DateTime(2026, 6, 27, 9, 20, 0, DateTimeKind.Utc), response.DominioPersonalizadoTlsUltimaTentativaEm);
        Assert.Equal(new DateTime(2026, 6, 27, 9, 35, 0, DateTimeKind.Utc), response.DominioPersonalizadoTlsProximaTentativaEm);
    }
}
