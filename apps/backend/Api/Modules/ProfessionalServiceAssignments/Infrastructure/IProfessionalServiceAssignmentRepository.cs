using Api.Modules.ProfessionalServiceAssignments.Domain;

namespace Api.Modules.ProfessionalServiceAssignments.Infrastructure;

public interface IProfessionalServiceAssignmentRepository
{
    Task AddAsync(ProfessionalServiceAssignment assignment);
    Task<ProfessionalServiceAssignment?> GetByProfessionalAndServiceAsync(Guid empresaId, Guid professionalId, Guid serviceId);
    Task<bool> ExistsAsync(Guid empresaId, Guid professionalId, Guid serviceId);
    Task<List<ProfessionalServiceAssignment>> ListByProfessionalAsync(Guid empresaId, Guid professionalId);
    Task<List<ProfessionalServiceAssignment>> ListByServiceAsync(Guid empresaId, Guid serviceId, Guid? professionalId = null);
    Task DeleteAsync(ProfessionalServiceAssignment assignment);
}
