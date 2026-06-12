namespace Api.Modules.Bookings.Routes.List;

public class ListBookingsRequest
{
    public Guid? EmpresaId { get; set; }
    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public string? State { get; set; }
    public Guid? ProfessionalId { get; set; }
}
