namespace Api.Modules.Bookings.Routes.Create;

public class CreateBookingResponse
{
    public Guid Id { get; set; }
    public Guid PetshopId { get; set; }
    public Guid ProfessionalId { get; set; }
    public Guid ServiceId { get; set; }
    public Guid ClientId { get; set; }
    public string State { get; set; } = string.Empty;
    public string OwnerContact { get; set; } = string.Empty;
    public string PetName { get; set; } = string.Empty;
    public string PetSpecies { get; set; } = string.Empty;
    public string BookingStatusAccessToken { get; set; } = string.Empty;
    public string FeedbackAccessToken { get; set; } = string.Empty;
    public DateTime RequestedAt { get; set; }
    public DateTime SlotStart { get; set; }
    public DateTime SlotEnd { get; set; }
}
