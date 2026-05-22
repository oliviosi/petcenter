using Api.Modules.Empresas.Domain;
using Api.Modules.Empresas.Infrastructure;

namespace Api.Modules.Empresas.Routes.UpdatePublicProfile;

public class UpdateEmpresaPublicProfileService : IUpdateEmpresaPublicProfileService
{
    private readonly IEmpresaRepository _repo;

    public UpdateEmpresaPublicProfileService(IEmpresaRepository repo) => _repo = repo;

    public async Task<UpdateEmpresaPublicProfileResponse> HandleAsync(UpdateEmpresaPublicProfileRequest request)
    {
        var empresa = await _repo.GetByIdAsync(request.EmpresaId)
            ?? throw new EmpresaNotFoundException(request.EmpresaId);

        empresa.DefinirSlug(request.Slug);
        empresa.DefinirDescricao(request.Descricao);
        empresa.DefinirCidade(request.Cidade);
        empresa.DefinirBairro(request.Bairro);
        empresa.DefinirResumoContato(request.ResumoContato);
        empresa.DefinirResumoEndereco(request.ResumoEndereco);

        if (!string.IsNullOrWhiteSpace(empresa.Slug))
        {
            var empresaComMesmoSlug = await _repo.GetBySlugAsync(empresa.Slug);
            if (empresaComMesmoSlug is not null && empresaComMesmoSlug.Id != empresa.Id)
                throw new EmpresaSlugConflictException(empresa.Slug);
        }

        if (request.Publica)
            empresa.PublicarNoCatalogo();
        else
            empresa.OcultarDoCatalogo();

        await _repo.UpdateAsync(empresa);

        return new UpdateEmpresaPublicProfileResponse
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
