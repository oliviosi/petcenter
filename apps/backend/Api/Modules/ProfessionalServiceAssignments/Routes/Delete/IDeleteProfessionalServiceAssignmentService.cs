namespace Api.Modules.ProfessionalServiceAssignments.Routes.Delete;

public interface IDeleteProfessionalServiceAssignmentService
{
    Task HandleAsync(Guid professionalId, Guid serviceId, Guid empresaId);
}
