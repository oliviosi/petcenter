using Api.Modules.Profissionais.Infrastructure;

namespace Api.Modules.Profissionais.Routes.List;

public class ListProfissionaisService : IListProfissionaisService
{
    private readonly IProfissionalRepository _repo;

    public ListProfissionaisService(IProfissionalRepository repo) => _repo = repo;

    public async Task<List<ListProfissionaisResponse>> HandleAsync(Guid empresaId)
    {
        var profissionais = await _repo.ListByEmpresaAsync(empresaId);

        return profissionais.Select(p => new ListProfissionaisResponse
        {
            Id = p.Id,
            EmpresaId = p.EmpresaId,
            Nome = p.Nome,
            Especialidade = p.Especialidade,
            Ativo = p.Ativo,
            CriadoEm = p.CriadoEm
        }).ToList();
    }
}
