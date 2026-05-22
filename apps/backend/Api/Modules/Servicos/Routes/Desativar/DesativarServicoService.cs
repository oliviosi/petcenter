using Api.Modules.Servicos.Domain;
using Api.Modules.Servicos.Infrastructure;

namespace Api.Modules.Servicos.Routes.Desativar;

public class DesativarServicoService : IDesativarServicoService
{
    private readonly IServicoRepository _repo;

    public DesativarServicoService(IServicoRepository repo) => _repo = repo;

    public async Task HandleAsync(Guid id, Guid empresaId)
    {
        var servico = await _repo.GetByIdAsync(id, empresaId)
            ?? throw new ServicoNotFoundException(id);

        servico.Desativar();
        await _repo.UpdateAsync(servico);
    }
}
