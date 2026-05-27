using Api.Modules.Empresas.Domain;
using Api.Modules.Empresas.Infrastructure;
using Api.Modules.Empresas.Routes.UpdatePublicProfile;
using Api.Tests.Support;
using Microsoft.Extensions.Options;

namespace Api.Tests.Empresas;

public class UpdateEmpresaPublicProfileServiceTests
{
    [Fact]
    public async Task HandleAsync_ShouldRegisterDesiredCustomDomainAndReturnPendingSetupState()
    {
        using var db = TestData.CreateDbContext();
        var empresa = new Empresa("Pet Center Vila");
        db.Empresas.Add(empresa);
        await db.SaveChangesAsync();

        var agora = new DateTimeOffset(2026, 6, 27, 12, 0, 0, TimeSpan.Zero);
        var sut = new UpdateEmpresaPublicProfileService(
            new EmpresaRepository(db),
            CreateDomainVerificationOptions(),
            new ManualTimeProvider(agora));

        var response = await sut.HandleAsync(new UpdateEmpresaPublicProfileRequest
        {
            EmpresaId = empresa.Id,
            Slug = "pet-center-vila",
            Descricao = "Banho e tosa com atendimento humanizado.",
            Cidade = "São Paulo",
            Bairro = "Vila Mariana",
            ResumoContato = "WhatsApp (11) 99999-9999",
            ResumoEndereco = "Rua Exemplo, 123",
            DominioPersonalizadoDesejado = "agenda.petcenter-vila.com",
            Publica = true
        });

        Assert.Equal("agenda.petcenter-vila.com", response.DominioPersonalizadoDesejado);
        Assert.Null(response.DominioPersonalizadoAtivo);
        Assert.Equal("subdomain", response.DominioPersonalizadoModo);
        Assert.Equal("cname", response.DominioPersonalizadoOrientacaoDns.TipoRegistro);
        Assert.Equal("agenda", response.DominioPersonalizadoOrientacaoDns.NomeRegistro);
        Assert.Equal("pending_setup", response.DominioPersonalizadoStatus);
        Assert.Equal("pending_setup", response.DominioPersonalizadoDnsStatus);
        Assert.Equal("not_started", response.DominioPersonalizadoTlsStatus);
        Assert.Equal(agora.UtcDateTime, response.DominioPersonalizadoProximaTentativaEm);
        Assert.Null(response.DominioPersonalizadoUltimaTentativaEm);
        Assert.True(response.Publica);
    }

    [Fact]
    public async Task HandleAsync_ShouldAcceptApexCustomDomainAndReturnApexGuidance()
    {
        using var db = TestData.CreateDbContext();
        var empresa = new Empresa("Pet Center Vila");
        db.Empresas.Add(empresa);
        await db.SaveChangesAsync();

        var agora = new DateTimeOffset(2026, 6, 27, 12, 0, 0, TimeSpan.Zero);
        var sut = new UpdateEmpresaPublicProfileService(
            new EmpresaRepository(db),
            CreateDomainVerificationOptions(),
            new ManualTimeProvider(agora));

        var response = await sut.HandleAsync(new UpdateEmpresaPublicProfileRequest
        {
            EmpresaId = empresa.Id,
            Slug = "pet-center-vila",
            Descricao = "Banho e tosa com atendimento humanizado.",
            Cidade = "São Paulo",
            Bairro = "Vila Mariana",
            ResumoContato = "WhatsApp (11) 99999-9999",
            ResumoEndereco = "Rua Exemplo, 123",
            DominioPersonalizadoDesejado = "petcenter-vila.com.br",
            Publica = true
        });

        Assert.Equal("petcenter-vila.com.br", response.DominioPersonalizadoDesejado);
        Assert.Equal("apex", response.DominioPersonalizadoModo);
        Assert.Equal("apex_supported_targets", response.DominioPersonalizadoOrientacaoDns.TipoRegistro);
        Assert.Equal("@", response.DominioPersonalizadoOrientacaoDns.NomeRegistro);
        Assert.Contains("198.51.100.10", response.DominioPersonalizadoOrientacaoDns.IpsEsperados);
        Assert.Contains("apex.storefront.petcenter.local", response.DominioPersonalizadoOrientacaoDns.HostnamesEsperados);
        Assert.Equal("pending_setup", response.DominioPersonalizadoStatus);
    }

    [Fact]
    public async Task HandleAsync_ShouldPreserveActiveDomainWhenSavingTheSameDesiredDomain()
    {
        using var db = TestData.CreateDbContext();
        var empresa = new Empresa("Pet Center Vila");
        empresa.DefinirSlug("pet-center-vila");
        empresa.DefinirDescricao("Banho e tosa com atendimento humanizado.");
        empresa.DefinirCidade("São Paulo");
        empresa.DefinirBairro("Vila Mariana");
        empresa.DefinirResumoContato("WhatsApp (11) 99999-9999");
        empresa.DefinirResumoEndereco("Rua Exemplo, 123");
        empresa.DefinirDominioPersonalizadoDesejado(
            "agenda.petcenter-vila.com",
            new DateTime(2026, 6, 27, 9, 0, 0, DateTimeKind.Utc));
        empresa.AtivarDominioPersonalizado(
            new DateTime(2026, 6, 27, 10, 0, 0, DateTimeKind.Utc),
            new DateTime(2026, 6, 27, 10, 0, 0, DateTimeKind.Utc));
        empresa.PublicarNoCatalogo();
        db.Empresas.Add(empresa);
        await db.SaveChangesAsync();

        var sut = new UpdateEmpresaPublicProfileService(
            new EmpresaRepository(db),
            CreateDomainVerificationOptions(),
            new ManualTimeProvider(new DateTimeOffset(2026, 6, 27, 12, 0, 0, TimeSpan.Zero)));

        var response = await sut.HandleAsync(new UpdateEmpresaPublicProfileRequest
        {
            EmpresaId = empresa.Id,
            Slug = "pet-center-vila",
            Descricao = "Banho e tosa com atendimento humanizado.",
            Cidade = "São Paulo",
            Bairro = "Vila Mariana",
            ResumoContato = "WhatsApp (11) 99999-9999",
            ResumoEndereco = "Rua Exemplo, 123",
            DominioPersonalizadoDesejado = "agenda.petcenter-vila.com",
            Publica = true
        });

        Assert.Equal("agenda.petcenter-vila.com", response.DominioPersonalizadoAtivo);
        Assert.Equal("active", response.DominioPersonalizadoStatus);
        Assert.Equal("verified", response.DominioPersonalizadoDnsStatus);
        Assert.Equal("ready", response.DominioPersonalizadoTlsStatus);
        Assert.NotNull(response.DominioPersonalizadoAtivadoEm);
        Assert.NotNull(response.DominioPersonalizadoVerificadoEm);
        Assert.NotNull(response.DominioPersonalizadoHttpsProntoEm);
    }

    [Fact]
    public async Task HandleAsync_ShouldResetAutomationStateWhenDesiredDomainChanges()
    {
        using var db = TestData.CreateDbContext();
        var empresa = new Empresa("Pet Center Vila");
        empresa.DefinirSlug("pet-center-vila");
        empresa.DefinirDescricao("Banho e tosa com atendimento humanizado.");
        empresa.DefinirCidade("São Paulo");
        empresa.DefinirBairro("Vila Mariana");
        empresa.DefinirResumoContato("WhatsApp (11) 99999-9999");
        empresa.DefinirResumoEndereco("Rua Exemplo, 123");
        empresa.DefinirDominioPersonalizadoDesejado(
            "agenda.petcenter-vila.com",
            new DateTime(2026, 6, 27, 9, 0, 0, DateTimeKind.Utc));
        empresa.AtivarDominioPersonalizado(
            new DateTime(2026, 6, 27, 10, 0, 0, DateTimeKind.Utc),
            new DateTime(2026, 6, 27, 10, 0, 0, DateTimeKind.Utc));
        db.Empresas.Add(empresa);
        await db.SaveChangesAsync();

        var agora = new DateTimeOffset(2026, 6, 27, 13, 0, 0, TimeSpan.Zero);
        var sut = new UpdateEmpresaPublicProfileService(
            new EmpresaRepository(db),
            CreateDomainVerificationOptions(),
            new ManualTimeProvider(agora));

        var response = await sut.HandleAsync(new UpdateEmpresaPublicProfileRequest
        {
            EmpresaId = empresa.Id,
            Slug = "pet-center-vila",
            Descricao = "Banho e tosa com atendimento humanizado.",
            Cidade = "São Paulo",
            Bairro = "Vila Mariana",
            ResumoContato = "WhatsApp (11) 99999-9999",
            ResumoEndereco = "Rua Exemplo, 123",
            DominioPersonalizadoDesejado = "agenda-nova.petcenter-vila.com",
            Publica = false
        });

        Assert.Equal("agenda-nova.petcenter-vila.com", response.DominioPersonalizadoDesejado);
        Assert.Null(response.DominioPersonalizadoAtivo);
        Assert.Equal("pending_setup", response.DominioPersonalizadoStatus);
        Assert.Equal("pending_setup", response.DominioPersonalizadoDnsStatus);
        Assert.Equal("not_started", response.DominioPersonalizadoTlsStatus);
        Assert.Equal(agora.UtcDateTime, response.DominioPersonalizadoProximaTentativaEm);
        Assert.Null(response.DominioPersonalizadoVerificadoEm);
        Assert.Null(response.DominioPersonalizadoTlsProvisionamentoIniciadoEm);
        Assert.Null(response.DominioPersonalizadoHttpsProntoEm);
        Assert.Null(response.DominioPersonalizadoAtivadoEm);
    }

    [Fact]
    public async Task HandleAsync_ShouldResetAutomationStateWhenDesiredDomainIsRemoved()
    {
        using var db = TestData.CreateDbContext();
        var empresa = new Empresa("Pet Center Vila");
        empresa.DefinirDominioPersonalizadoDesejado(
            "agenda.petcenter-vila.com",
            new DateTime(2026, 6, 27, 9, 0, 0, DateTimeKind.Utc));
        empresa.RegistrarFalhaDominioPersonalizado(
            "O domínio ainda não aponta para o destino esperado.",
            new DateTime(2026, 6, 27, 10, 0, 0, DateTimeKind.Utc),
            new DateTime(2026, 6, 27, 10, 15, 0, DateTimeKind.Utc));
        db.Empresas.Add(empresa);
        await db.SaveChangesAsync();

        var sut = new UpdateEmpresaPublicProfileService(
            new EmpresaRepository(db),
            CreateDomainVerificationOptions(),
            new ManualTimeProvider(new DateTimeOffset(2026, 6, 27, 12, 0, 0, TimeSpan.Zero)));

        var response = await sut.HandleAsync(new UpdateEmpresaPublicProfileRequest
        {
            EmpresaId = empresa.Id,
            Slug = "pet-center-vila",
            Descricao = "Banho e tosa com atendimento humanizado.",
            Cidade = "São Paulo",
            Bairro = "Vila Mariana",
            ResumoContato = "WhatsApp (11) 99999-9999",
            ResumoEndereco = "Rua Exemplo, 123",
            DominioPersonalizadoDesejado = string.Empty,
            Publica = false
        });

        Assert.Null(response.DominioPersonalizadoDesejado);
        Assert.Null(response.DominioPersonalizadoAtivo);
        Assert.Equal("removed", response.DominioPersonalizadoStatus);
        Assert.Equal("removed", response.DominioPersonalizadoDnsStatus);
        Assert.Equal("not_started", response.DominioPersonalizadoTlsStatus);
        Assert.Null(response.DominioPersonalizadoUltimaFalha);
        Assert.Null(response.DominioPersonalizadoUltimaTentativaEm);
        Assert.Null(response.DominioPersonalizadoProximaTentativaEm);
    }

    private static IOptions<StorefrontDomainVerificationOptions> CreateDomainVerificationOptions() =>
        Options.Create(new StorefrontDomainVerificationOptions
        {
            ExpectedTarget = "storefront.petcenter.local",
            ApexExpectedTargets =
            [
                "198.51.100.10",
                "2001:db8::10",
                "apex.storefront.petcenter.local"
            ]
        });
}
