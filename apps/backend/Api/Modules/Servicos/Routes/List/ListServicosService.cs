using Api.Modules.Servicos.Infrastructure;

namespace Api.Modules.Servicos.Routes.List;

public class ListServicosService : IListServicosService
{
    private readonly IServicoRepository _repo;

    public ListServicosService(IServicoRepository repo) => _repo = repo;

    public async Task<List<ListServicosResponse>> HandleAsync(Guid empresaId)
    {
        var servicos = await _repo.ListByEmpresaAsync(empresaId);

        return servicos.Select(s => new ListServicosResponse
        {
            Id = s.Id,
            EmpresaId = s.EmpresaId,
            Nome = s.Nome,
            DuracaoMinutos = s.DuracaoMinutos,
            PrecoBase = s.PrecoBase,
            Ativo = s.Ativo,
            CriadoEm = s.CriadoEm
        }).ToList();
    }
}
