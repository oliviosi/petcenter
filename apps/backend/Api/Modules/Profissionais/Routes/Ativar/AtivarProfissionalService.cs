using Api.Modules.Profissionais.Domain;
using Api.Modules.Profissionais.Infrastructure;

namespace Api.Modules.Profissionais.Routes.Ativar;

public class AtivarProfissionalService : IAtivarProfissionalService
{
    private readonly IProfissionalRepository _repo;

    public AtivarProfissionalService(IProfissionalRepository repo) => _repo = repo;

    public async Task HandleAsync(Guid id, Guid empresaId)
    {
        var profissional = await _repo.GetByIdAsync(id, empresaId)
            ?? throw new ProfissionalNotFoundException(id);

        profissional.Ativar();
        await _repo.UpdateAsync(profissional);
    }
}
