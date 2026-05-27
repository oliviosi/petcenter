using Api.Modules.Empresas.Routes.UpdatePublicProfile;

namespace Api.Tests.Empresas;

public class UpdateEmpresaPublicProfileRequestValidatorTests
{
    private readonly UpdateEmpresaPublicProfileRequestValidator _sut = new();

    [Fact]
    public async Task ValidateAsync_ShouldAcceptApexDomain()
    {
        var result = await _sut.ValidateAsync(new UpdateEmpresaPublicProfileRequest
        {
            DominioPersonalizadoDesejado = "petcenter.com.br"
        });

        Assert.True(result.IsValid);
    }

    [Fact]
    public async Task ValidateAsync_ShouldRejectUnsupportedRootLikeDomainWithUpdatedMessage()
    {
        var result = await _sut.ValidateAsync(new UpdateEmpresaPublicProfileRequest
        {
            DominioPersonalizadoDesejado = "com.br"
        });

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, error =>
            error.PropertyName == nameof(UpdateEmpresaPublicProfileRequest.DominioPersonalizadoDesejado)
            && error.ErrorMessage == "Domínio personalizado deve ser um subdomínio válido ou um domínio raiz suportado, como agenda.petshop.com.br ou petshop.com.br.");
    }
}
