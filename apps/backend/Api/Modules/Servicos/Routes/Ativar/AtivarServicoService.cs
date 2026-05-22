using Api.Modules.Servicos.Domain;
using Api.Modules.Servicos.Infrastructure;

namespace Api.Modules.Servicos.Routes.Ativar;

public class AtivarServicoService : IAtivarServicoService
{
    private readonly IServicoRepository _repo;

    public AtivarServicoService(IServicoRepository repo) => _repo = repo;

    public async Task HandleAsync(Guid id, Guid empresaId)
    {
        var servico = await _repo.GetByIdAsync(id, empresaId)
            ?? throw new ServicoNotFoundException(id);

        servico.Ativar();
        await _repo.UpdateAsync(servico);
    }
}
