namespace Api.Modules.ProfessionalServiceAssignments.Routes.Create;

public class CreateProfessionalServiceAssignmentRequest
{
    public Guid EmpresaId { get; set; }
    public Guid ProfessionalId { get; set; }
    public Guid ServiceId { get; set; }
}
