namespace Api.Modules.Bookings.Routes.Create;

public class CreateBookingRequest
{
    public Guid PetshopId { get; set; }
    public Guid ProfessionalId { get; set; }
    public Guid ServiceId { get; set; }
    public DateTime SlotStart { get; set; }
    public DateTime SlotEnd { get; set; }
    public string OwnerContact { get; set; } = string.Empty;
    public string PetName { get; set; } = string.Empty;
    public string PetSpecies { get; set; } = string.Empty;
}
