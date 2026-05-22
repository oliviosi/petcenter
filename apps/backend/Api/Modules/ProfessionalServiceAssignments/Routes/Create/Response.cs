namespace Api.Modules.ProfessionalServiceAssignments.Routes.Create;

public class CreateProfessionalServiceAssignmentResponse
{
    public Guid Id { get; set; }
    public Guid EmpresaId { get; set; }
    public Guid ProfessionalId { get; set; }
    public Guid ServiceId { get; set; }
    public DateTime CreatedAt { get; set; }
}
