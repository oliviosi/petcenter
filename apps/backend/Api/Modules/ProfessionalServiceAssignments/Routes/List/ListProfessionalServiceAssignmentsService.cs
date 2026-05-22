using Api.Modules.ProfessionalServiceAssignments.Infrastructure;
using Api.Modules.ProfessionalServiceAssignments.Domain;
using Api.Modules.Profissionais.Domain;
using Api.Modules.Profissionais.Infrastructure;
using Api.Modules.Servicos.Infrastructure;

namespace Api.Modules.ProfessionalServiceAssignments.Routes.List;

public class ListProfessionalServiceAssignmentsService : IListProfessionalServiceAssignmentsService
{
    private readonly IProfessionalServiceAssignmentRepository _assignmentRepository;
    private readonly IProfissionalRepository _professionalRepository;
    private readonly IServicoRepository _serviceRepository;

    public ListProfessionalServiceAssignmentsService(
        IProfessionalServiceAssignmentRepository assignmentRepository,
        IProfissionalRepository professionalRepository,
        IServicoRepository serviceRepository)
    {
        _assignmentRepository = assignmentRepository;
        _professionalRepository = professionalRepository;
        _serviceRepository = serviceRepository;
    }

    public async Task<List<ListProfessionalServiceAssignmentsResponse>> HandleAsync(Guid professionalId, Guid empresaId)
    {
        var professional = await _professionalRepository.GetByIdAsync(professionalId, empresaId)
            ?? throw new ProfissionalNotFoundException(professionalId);
        if (!professional.Ativo)
            throw new ProfessionalServiceAssignmentInactiveException("profissional");

        var assignments = await _assignmentRepository.ListByProfessionalAsync(empresaId, professionalId);
        var services = await _serviceRepository.ListByIdsAsync(empresaId, assignments.Select(a => a.ServiceId));
        var servicesById = services.ToDictionary(s => s.Id);

        return assignments
            .Where(a => servicesById.ContainsKey(a.ServiceId))
            .Select(a =>
            {
                var service = servicesById[a.ServiceId];
                return new ListProfessionalServiceAssignmentsResponse
                {
                    AssignmentId = a.Id,
                    EmpresaId = a.EmpresaId,
                    ProfessionalId = a.ProfessionalId,
                    ServiceId = service.Id,
                    ServiceName = service.Nome,
                    ServiceDurationMinutes = service.DuracaoMinutos,
                    BasePrice = service.PrecoBase,
                    Active = service.Ativo,
                    CreatedAt = a.CreatedAt
                };
            })
            .ToList();
    }
}
