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
            Publica = empresa.Publica
        };
    }
}
