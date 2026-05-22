namespace Api.Modules.Bookings.Routes.GetSlots;

public class GetPublicSlotsRequest
{
    public Guid PetshopId { get; set; }
    public Guid ServiceId { get; set; }
    public Guid? ProfessionalId { get; set; }
    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
}
