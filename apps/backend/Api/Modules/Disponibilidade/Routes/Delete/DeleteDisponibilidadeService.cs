using Api.Modules.Disponibilidade.Domain;
using Api.Modules.Disponibilidade.Infrastructure;
using Api.Modules.Profissionais.Domain;
using Api.Modules.Profissionais.Infrastructure;

namespace Api.Modules.Disponibilidade.Routes.Delete;

public class DeleteDisponibilidadeService : IDeleteDisponibilidadeService
{
    private readonly IDisponibilidadeRepository _repo;
    private readonly IProfissionalRepository _profissionalRepo;

    public DeleteDisponibilidadeService(
        IDisponibilidadeRepository repo,
        IProfissionalRepository profissionalRepo)
    {
        _repo = repo;
        _profissionalRepo = profissionalRepo;
    }

    public async Task HandleAsync(Guid id, Guid profissionalId, Guid empresaId)
    {
        var profissional = await _profissionalRepo.GetByIdAsync(profissionalId, empresaId)
            ?? throw new ProfissionalNotFoundException(profissionalId);

        var disponibilidade = await _repo.GetByIdAsync(id, profissional.Id)
            ?? throw new DisponibilidadeNotFoundException(id);

        await _repo.DeleteAsync(disponibilidade);
    }
}
