using Api.Modules.Disponibilidade.Domain;
using Api.Modules.Disponibilidade.Infrastructure;
using Api.Modules.Profissionais.Domain;
using Api.Modules.Profissionais.Infrastructure;

namespace Api.Modules.Disponibilidade.Routes.List;

public class ListDisponibilidadeService : IListDisponibilidadeService
{
    private readonly IDisponibilidadeRepository _repo;
    private readonly IProfissionalRepository _profissionalRepo;

    public ListDisponibilidadeService(
        IDisponibilidadeRepository repo,
        IProfissionalRepository profissionalRepo)
    {
        _repo = repo;
        _profissionalRepo = profissionalRepo;
    }

    public async Task<List<ListDisponibilidadeResponse>> HandleAsync(Guid profissionalId, Guid empresaId)
    {
        var profissional = await _profissionalRepo.GetByIdAsync(profissionalId, empresaId)
            ?? throw new ProfissionalNotFoundException(profissionalId);

        var janelas = await _repo.ListByProfissionalAsync(profissional.Id);

        return janelas.Select(d => new ListDisponibilidadeResponse
        {
            Id = d.Id,
            ProfissionalId = d.ProfissionalId,
            DiaSemana = (int)d.DiaSemana,
            HoraInicio = d.HoraInicio,
            HoraFim = d.HoraFim,
            CriadoEm = d.CriadoEm
        }).ToList();
    }
}
