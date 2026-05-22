using Api.Modules.ProfessionalServiceAssignments.Domain;
using Api.Modules.ProfessionalServiceAssignments.Infrastructure;
using Api.Modules.Profissionais.Domain;
using Api.Modules.Profissionais.Infrastructure;
using Api.Modules.Servicos.Domain;
using Api.Modules.Servicos.Infrastructure;

namespace Api.Modules.ProfessionalServiceAssignments.Routes.Create;

public class CreateProfessionalServiceAssignmentService : ICreateProfessionalServiceAssignmentService
{
    private readonly IProfessionalServiceAssignmentRepository _assignmentRepository;
    private readonly IProfissionalRepository _professionalRepository;
    private readonly IServicoRepository _serviceRepository;

    public CreateProfessionalServiceAssignmentService(
        IProfessionalServiceAssignmentRepository assignmentRepository,
        IProfissionalRepository professionalRepository,
        IServicoRepository serviceRepository)
    {
        _assignmentRepository = assignmentRepository;
        _professionalRepository = professionalRepository;
        _serviceRepository = serviceRepository;
    }

    public async Task<CreateProfessionalServiceAssignmentResponse> HandleAsync(CreateProfessionalServiceAssignmentRequest request)
    {
        var professional = await _professionalRepository.GetByIdAsync(request.ProfessionalId, request.EmpresaId)
            ?? throw new ProfissionalNotFoundException(request.ProfessionalId);
        if (!professional.Ativo)
            throw new ProfessionalServiceAssignmentInactiveException("profissional");

        var service = await _serviceRepository.GetByIdAsync(request.ServiceId, request.EmpresaId)
            ?? throw new ServicoNotFoundException(request.ServiceId);
        if (!service.Ativo)
            throw new ProfessionalServiceAssignmentInactiveException("serviço");

        if (await _assignmentRepository.ExistsAsync(request.EmpresaId, request.ProfessionalId, request.ServiceId))
            throw new ProfessionalServiceAssignmentConflictException(request.ProfessionalId, request.ServiceId);

        var assignment = new ProfessionalServiceAssignment(request.EmpresaId, request.ProfessionalId, request.ServiceId);
        await _assignmentRepository.AddAsync(assignment);

        return new CreateProfessionalServiceAssignmentResponse
        {
            Id = assignment.Id,
            EmpresaId = assignment.EmpresaId,
            ProfessionalId = assignment.ProfessionalId,
            ServiceId = assignment.ServiceId,
            CreatedAt = assignment.CreatedAt
        };
    }
}
