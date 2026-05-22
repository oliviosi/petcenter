using Api.Modules.ProfessionalServiceAssignments.Domain;
using Api.Modules.ProfessionalServiceAssignments.Infrastructure;
using Api.Modules.Profissionais.Domain;
using Api.Modules.Profissionais.Infrastructure;
using Api.Modules.Servicos.Domain;
using Api.Modules.Servicos.Infrastructure;

namespace Api.Modules.ProfessionalServiceAssignments.Routes.Delete;

public class DeleteProfessionalServiceAssignmentService : IDeleteProfessionalServiceAssignmentService
{
    private readonly IProfessionalServiceAssignmentRepository _assignmentRepository;
    private readonly IProfissionalRepository _professionalRepository;
    private readonly IServicoRepository _serviceRepository;

    public DeleteProfessionalServiceAssignmentService(
        IProfessionalServiceAssignmentRepository assignmentRepository,
        IProfissionalRepository professionalRepository,
        IServicoRepository serviceRepository)
    {
        _assignmentRepository = assignmentRepository;
        _professionalRepository = professionalRepository;
        _serviceRepository = serviceRepository;
    }

    public async Task HandleAsync(Guid professionalId, Guid serviceId, Guid empresaId)
    {
        var professional = await _professionalRepository.GetByIdAsync(professionalId, empresaId)
            ?? throw new ProfissionalNotFoundException(professionalId);
        if (!professional.Ativo)
            throw new ProfessionalServiceAssignmentInactiveException("profissional");

        var service = await _serviceRepository.GetByIdAsync(serviceId, empresaId)
            ?? throw new ServicoNotFoundException(serviceId);
        if (!service.Ativo)
            throw new ProfessionalServiceAssignmentInactiveException("serviço");

        var assignment = await _assignmentRepository.GetByProfessionalAndServiceAsync(empresaId, professionalId, serviceId)
            ?? throw new ProfessionalServiceAssignmentNotFoundException(professionalId, serviceId);

        await _assignmentRepository.DeleteAsync(assignment);
    }
}
