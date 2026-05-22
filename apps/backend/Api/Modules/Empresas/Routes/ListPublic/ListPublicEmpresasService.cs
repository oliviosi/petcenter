using Api.Modules.Empresas.Infrastructure;

namespace Api.Modules.Empresas.Routes.ListPublic;

public class ListPublicEmpresasService : IListPublicEmpresasService
{
    private readonly IEmpresaRepository _repo;

    public ListPublicEmpresasService(IEmpresaRepository repo) => _repo = repo;

    public async Task<List<ListPublicEmpresasResponse>> HandleAsync(ListPublicEmpresasRequest request)
    {
        var empresas = await _repo.ListPublicAsync(request.Nome, request.Cidade, request.Bairro, request.Servico);

        return empresas.Select(empresa => new ListPublicEmpresasResponse
        {
            Id = empresa.Id,
            Nome = empresa.Nome,
            Slug = empresa.Slug ?? string.Empty,
            Descricao = empresa.Descricao ?? string.Empty,
            Cidade = empresa.Cidade ?? string.Empty,
            Bairro = empresa.Bairro ?? string.Empty,
            ResumoContato = empresa.ResumoContato ?? string.Empty,
            ResumoEndereco = empresa.ResumoEndereco ?? string.Empty
        }).ToList();
    }
}
