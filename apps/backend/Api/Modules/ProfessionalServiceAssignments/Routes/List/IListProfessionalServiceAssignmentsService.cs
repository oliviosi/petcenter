namespace Api.Modules.ProfessionalServiceAssignments.Routes.List;

public interface IListProfessionalServiceAssignmentsService
{
    Task<List<ListProfessionalServiceAssignmentsResponse>> HandleAsync(Guid professionalId, Guid empresaId);
}
