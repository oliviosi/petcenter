namespace Api.Modules.Bookings.Routes.GetSlots;

public class GetPublicSlotsResponse
{
    public Guid PetshopId { get; set; }
    public Guid ProfessionalId { get; set; }
    public Guid ServiceId { get; set; }
    public DateTime SlotStart { get; set; }
    public DateTime SlotEnd { get; set; }
}
