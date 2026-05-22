using Api.Modules.Profissionais.Domain;
using Api.Modules.Profissionais.Infrastructure;

namespace Api.Modules.Profissionais.Routes.Desativar;

public class DesativarProfissionalService : IDesativarProfissionalService
{
    private readonly IProfissionalRepository _repo;

    public DesativarProfissionalService(IProfissionalRepository repo) => _repo = repo;

    public async Task HandleAsync(Guid id, Guid empresaId)
    {
        var profissional = await _repo.GetByIdAsync(id, empresaId)
            ?? throw new ProfissionalNotFoundException(id);

        profissional.Desativar();
        await _repo.UpdateAsync(profissional);
    }
}
