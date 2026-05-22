namespace Api.Modules.Bookings.Infrastructure;

public class AvailableSlot
{
    public Guid PetshopId { get; set; }
    public Guid ProfessionalId { get; set; }
    public Guid ServiceId { get; set; }
    public DateTime SlotStart { get; set; }
    public DateTime SlotEnd { get; set; }
}
