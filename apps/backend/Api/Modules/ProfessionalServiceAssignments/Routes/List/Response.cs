namespace Api.Modules.ProfessionalServiceAssignments.Routes.List;

public class ListProfessionalServiceAssignmentsResponse
{
    public Guid AssignmentId { get; set; }
    public Guid EmpresaId { get; set; }
    public Guid ProfessionalId { get; set; }
    public Guid ServiceId { get; set; }
    public string ServiceName { get; set; } = string.Empty;
    public int ServiceDurationMinutes { get; set; }
    public decimal BasePrice { get; set; }
    public bool Active { get; set; }
    public DateTime CreatedAt { get; set; }
}
