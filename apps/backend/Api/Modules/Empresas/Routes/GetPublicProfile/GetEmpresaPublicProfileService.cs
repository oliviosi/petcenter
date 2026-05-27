using Api.Modules.Empresas.Domain;
using Api.Modules.Empresas.Infrastructure;

namespace Api.Modules.Empresas.Routes.GetPublicProfile;

public class GetEmpresaPublicProfileService : IGetEmpresaPublicProfileService
{
    private readonly IEmpresaRepository _repo;

    public GetEmpresaPublicProfileService(IEmpresaRepository repo) => _repo = repo;

    public async Task<GetEmpresaPublicProfileResponse> HandleAsync(Guid empresaId)
    {
        var empresa = await _repo.GetByIdAsync(empresaId)
            ?? throw new EmpresaNotFoundException(empresaId);

        return new GetEmpresaPublicProfileResponse
        {
            Id = empresa.Id,
            Nome = empresa.Nome,
            Slug = empresa.Slug,
            Descricao = empresa.Descricao,
            Cidade = empresa.Cidade,
            Bairro = empresa.Bairro,
            ResumoContato = empresa.ResumoContato,
            ResumoEndereco = empresa.ResumoEndereco,
            DominioPersonalizadoDesejado = empresa.DominioPersonalizadoDesejado,
            DominioPersonalizadoAtivo = empresa.DominioPersonalizadoAtivo,
            DominioPersonalizadoStatus = ToApiStatus(empresa.DominioPersonalizadoStatus),
            DominioPersonalizadoUltimaFalha = empresa.DominioPersonalizadoUltimaFalha,
            DominioPersonalizadoUltimaTentativaEm = empresa.DominioPersonalizadoUltimaTentativaEm,
            DominioPersonalizadoProximaTentativaEm = empresa.DominioPersonalizadoProximaTentativaEm,
            DominioPersonalizadoVerificadoEm = empresa.DominioPersonalizadoVerificadoEm,
            DominioPersonalizadoAtivadoEm = empresa.DominioPersonalizadoAtivadoEm,
            Publica = empresa.Publica
        };
    }

    private static string ToApiStatus(StorefrontCustomDomainStatus status) => status switch
    {
        StorefrontCustomDomainStatus.PendingSetup => "pending_setup",
        StorefrontCustomDomainStatus.Verifying => "verifying",
        StorefrontCustomDomainStatus.Active => "active",
        StorefrontCustomDomainStatus.Failed => "failed",
        _ => "removed"
    };
}
