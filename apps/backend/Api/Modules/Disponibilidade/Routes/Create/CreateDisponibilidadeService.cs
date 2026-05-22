using Api.Modules.Disponibilidade.Domain;
using Api.Modules.Disponibilidade.Infrastructure;
using Api.Modules.Profissionais.Domain;
using Api.Modules.Profissionais.Infrastructure;

namespace Api.Modules.Disponibilidade.Routes.Create;

public class CreateDisponibilidadeService : ICreateDisponibilidadeService
{
    private readonly IDisponibilidadeRepository _repo;
    private readonly IProfissionalRepository _profissionalRepo;

    public CreateDisponibilidadeService(
        IDisponibilidadeRepository repo,
        IProfissionalRepository profissionalRepo)
    {
        _repo = repo;
        _profissionalRepo = profissionalRepo;
    }

    public async Task<CreateDisponibilidadeResponse> HandleAsync(CreateDisponibilidadeRequest request)
    {
        var profissional = await _profissionalRepo.GetByIdAsync(request.ProfissionalId, request.EmpresaId)
            ?? throw new ProfissionalNotFoundException(request.ProfissionalId);

        var disponibilidade = new DisponibilidadeProfissional(
            profissional.Id,
            (DayOfWeek)request.DiaSemana,
            request.HoraInicio,
            request.HoraFim);

        await _repo.AddAsync(disponibilidade);

        return new CreateDisponibilidadeResponse
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
