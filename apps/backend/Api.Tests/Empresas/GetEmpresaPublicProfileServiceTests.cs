using Api.Modules.Empresas.Domain;
using Api.Modules.Empresas.Infrastructure;
using Api.Modules.Empresas.Routes.GetPublicProfile;
using Api.Tests.Support;
using Microsoft.Extensions.Options;

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

        var sut = new GetEmpresaPublicProfileService(
            new EmpresaRepository(db),
            CreateDomainVerificationOptions());

        var response = await sut.HandleAsync(empresa.Id);

        Assert.Equal("agenda.petcenter-vila.com", response.DominioPersonalizadoDesejado);
        Assert.Equal("subdomain", response.DominioPersonalizadoModo);
        Assert.Equal("cname", response.DominioPersonalizadoOrientacaoDns.TipoRegistro);
        Assert.Equal("tls_failed", response.DominioPersonalizadoStatus);
        Assert.Equal("verified", response.DominioPersonalizadoDnsStatus);
        Assert.Equal(new DateTime(2026, 6, 27, 9, 15, 0, DateTimeKind.Utc), response.DominioPersonalizadoDnsVerificadoEm);
        Assert.Equal("failed", response.DominioPersonalizadoTlsStatus);
        Assert.Equal("HTTPS ainda não está pronto para o domínio.", response.DominioPersonalizadoTlsUltimaFalha);
        Assert.Equal(new DateTime(2026, 6, 27, 9, 20, 0, DateTimeKind.Utc), response.DominioPersonalizadoTlsUltimaTentativaEm);
        Assert.Equal(new DateTime(2026, 6, 27, 9, 35, 0, DateTimeKind.Utc), response.DominioPersonalizadoTlsProximaTentativaEm);
    }

    [Fact]
    public async Task HandleAsync_ShouldExposeApexGuidanceMetadata()
    {
        using var db = TestData.CreateDbContext();
        var empresa = new Empresa("Pet Center Vila");
        empresa.DefinirDominioPersonalizadoDesejado(
            "petcenter-vila.com.br",
            new DateTime(2026, 6, 27, 9, 0, 0, DateTimeKind.Utc));
        db.Empresas.Add(empresa);
        await db.SaveChangesAsync();

        var sut = new GetEmpresaPublicProfileService(
            new EmpresaRepository(db),
            CreateDomainVerificationOptions());

        var response = await sut.HandleAsync(empresa.Id);

        Assert.Equal("apex", response.DominioPersonalizadoModo);
        Assert.Equal("apex_supported_targets", response.DominioPersonalizadoOrientacaoDns.TipoRegistro);
        Assert.Equal("@", response.DominioPersonalizadoOrientacaoDns.NomeRegistro);
        Assert.Contains("198.51.100.10", response.DominioPersonalizadoOrientacaoDns.IpsEsperados);
        Assert.Contains("apex.storefront.petcenter.local", response.DominioPersonalizadoOrientacaoDns.HostnamesEsperados);
        Assert.NotNull(response.DominioPersonalizadoOrientacaoDns.OrientacaoRedirecionamentoWwwOpcional);
    }

    private static IOptions<StorefrontDomainVerificationOptions> CreateDomainVerificationOptions() =>
        Options.Create(new StorefrontDomainVerificationOptions
        {
            ExpectedTarget = "storefront.petcenter.local",
            ApexExpectedTargets = ["198.51.100.10", "apex.storefront.petcenter.local"]
        });
}
