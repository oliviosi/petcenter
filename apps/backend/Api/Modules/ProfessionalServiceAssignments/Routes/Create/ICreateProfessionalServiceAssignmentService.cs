namespace Api.Modules.ProfessionalServiceAssignments.Routes.Create;

public interface ICreateProfessionalServiceAssignmentService
{
    Task<CreateProfessionalServiceAssignmentResponse> HandleAsync(CreateProfessionalServiceAssignmentRequest request);
}
