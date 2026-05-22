using Api.Modules.Disponibilidade.Domain;
using Api.Modules.Disponibilidade.Infrastructure;
using Api.Modules.Profissionais.Domain;
using Api.Modules.Profissionais.Infrastructure;

namespace Api.Modules.Disponibilidade.Routes.Update;

public class UpdateDisponibilidadeService : IUpdateDisponibilidadeService
{
    private readonly IDisponibilidadeRepository _repo;
    private readonly IProfissionalRepository _profissionalRepo;

    public UpdateDisponibilidadeService(
        IDisponibilidadeRepository repo,
        IProfissionalRepository profissionalRepo)
    {
        _repo = repo;
        _profissionalRepo = profissionalRepo;
    }

    public async Task<UpdateDisponibilidadeResponse> HandleAsync(UpdateDisponibilidadeRequest request)
    {
        var profissional = await _profissionalRepo.GetByIdAsync(request.ProfissionalId, request.EmpresaId)
            ?? throw new ProfissionalNotFoundException(request.ProfissionalId);

        var disponibilidade = await _repo.GetByIdAsync(request.Id, profissional.Id)
            ?? throw new DisponibilidadeNotFoundException(request.Id);

        disponibilidade.DefinirJanela((DayOfWeek)request.DiaSemana, request.HoraInicio, request.HoraFim);

        await _repo.UpdateAsync(disponibilidade);

        return new UpdateDisponibilidadeResponse
        {
            Id = disponibilidade.Id,
            ProfissionalId = disponibilidade.ProfissionalId,
            DiaSemana = (int)disponibilidade.DiaSemana,
            HoraInicio = disponibilidade.HoraInicio,
            HoraFim = disponibilidade.HoraFim,
            CriadoEm = disponibilidade.CriadoEm
        };
    }
}
