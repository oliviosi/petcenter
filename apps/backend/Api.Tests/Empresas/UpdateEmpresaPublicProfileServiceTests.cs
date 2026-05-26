using Api.Modules.Empresas.Domain;
using Api.Modules.Empresas.Infrastructure;
using Api.Modules.Empresas.Routes.UpdatePublicProfile;
using Api.Tests.Support;

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

        var sut = new UpdateEmpresaPublicProfileService(new EmpresaRepository(db));

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
        Assert.Equal("pending_setup", response.DominioPersonalizadoStatus);
        Assert.True(response.Publica);
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
        empresa.DefinirDominioPersonalizadoDesejado("agenda.petcenter-vila.com");
        empresa.AtivarDominioPersonalizado();
        empresa.PublicarNoCatalogo();
        db.Empresas.Add(empresa);
        await db.SaveChangesAsync();

        var sut = new UpdateEmpresaPublicProfileService(new EmpresaRepository(db));

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
    }
}
