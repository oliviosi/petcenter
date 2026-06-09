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

    [Fact]
    public async Task HandleAsync_ShouldExposeActiveDomainMonitoringContext()
    {
        using var db = TestData.CreateDbContext();
        var empresa = new Empresa("Pet Center Vila");
        var ativadoEm = new DateTime(2026, 6, 27, 9, 0, 0, DateTimeKind.Utc);
        var proximoMonitoramento = ativadoEm.AddHours(12);
        empresa.DefinirDominioPersonalizadoDesejado("agenda.petcenter-vila.com", ativadoEm);
        empresa.AtivarDominioPersonalizado(ativadoEm, ativadoEm, proximoMonitoramento);
        db.Empresas.Add(empresa);
        await db.SaveChangesAsync();

        var sut = new GetEmpresaPublicProfileService(
            new EmpresaRepository(db),
            CreateDomainVerificationOptions());

        var response = await sut.HandleAsync(empresa.Id);

        Assert.Equal("agenda.petcenter-vila.com", response.DominioPersonalizadoAtivo);
        Assert.Equal("active", response.DominioPersonalizadoStatus);
        Assert.Equal(ativadoEm, response.DominioPersonalizadoUltimoMonitoramentoSaudavelEm);
        Assert.Null(response.DominioPersonalizadoUltimoMonitoramentoDegradadoEm);
        Assert.Null(response.DominioPersonalizadoUltimoMonitoramentoDegradadoMotivo);
        Assert.False(response.DominioPersonalizadoCanonicoRevertidoParaFallback);
    }

    [Fact]
    public async Task HandleAsync_ShouldExposeDegradedMonitoringContext()
    {
        using var db = TestData.CreateDbContext();
        var empresa = new Empresa("Pet Center Vila");
        var ativadoEm = new DateTime(2026, 6, 27, 9, 0, 0, DateTimeKind.Utc);
        var degradadoEm = new DateTime(2026, 6, 27, 21, 0, 0, DateTimeKind.Utc);
        var proximoMonitoramento = degradadoEm.AddHours(12);
        empresa.DefinirDominioPersonalizadoDesejado("agenda.petcenter-vila.com", ativadoEm);
        empresa.AtivarDominioPersonalizado(ativadoEm, ativadoEm, proximoMonitoramento);
        empresa.RegistrarMonitoramentoDegradado("O domínio não aponta mais para o destino esperado.", degradadoEm, proximoMonitoramento);
        db.Empresas.Add(empresa);
        await db.SaveChangesAsync();

        var sut = new GetEmpresaPublicProfileService(
            new EmpresaRepository(db),
            CreateDomainVerificationOptions());

        var response = await sut.HandleAsync(empresa.Id);

        Assert.Null(response.DominioPersonalizadoAtivo);
        Assert.Equal("active", response.DominioPersonalizadoStatus);
        Assert.Equal(ativadoEm, response.DominioPersonalizadoUltimoMonitoramentoSaudavelEm);
        Assert.Equal(degradadoEm, response.DominioPersonalizadoUltimoMonitoramentoDegradadoEm);
        Assert.Equal("O domínio não aponta mais para o destino esperado.", response.DominioPersonalizadoUltimoMonitoramentoDegradadoMotivo);
        Assert.True(response.DominioPersonalizadoCanonicoRevertidoParaFallback);
    }

    [Fact]
    public async Task HandleAsync_ShouldExposeNotificationMetadata()
    {
        using var db = TestData.CreateDbContext();
        var empresa = new Empresa("Pet Center Vila");
        var sent = new DateTime(2026, 6, 27, 10, 0, 0, DateTimeKind.Utc);
        empresa.RegistrarNotificacaoDominioPersonalizado("degraded", "DNS mismatch", sent, "sent", 1);
        db.Empresas.Add(empresa);
        await db.SaveChangesAsync();

        var sut = new GetEmpresaPublicProfileService(
            new EmpresaRepository(db),
            CreateDomainVerificationOptions());

        var response = await sut.HandleAsync(empresa.Id);

        Assert.Equal("degraded", response.DominioPersonalizadoUltimaNotificacaoCategoria);
        Assert.Equal("DNS mismatch", response.DominioPersonalizadoUltimaNotificacaoMotivo);
        Assert.Equal(sent, response.DominioPersonalizadoUltimaNotificacaoEnviadaEm);
        Assert.Equal("sent", response.DominioPersonalizadoUltimaNotificacaoResultado);
        Assert.Equal(1, response.DominioPersonalizadoUltimaNotificacaoTentativas);
    }

    private static IOptions<StorefrontDomainVerificationOptions> CreateDomainVerificationOptions() =>
        Options.Create(new StorefrontDomainVerificationOptions
        {
            ExpectedTarget = "storefront.petcenter.local",
            ApexExpectedTargets = ["198.51.100.10", "apex.storefront.petcenter.local"]
        });
}
