namespace Api.Modules.Bookings.Routes.NoShow;

public class NoShowBookingResponse
{
    public Guid Id { get; set; }
    public string State { get; set; } = string.Empty;
    public DateTime NoShowAt { get; set; }
    public string NoShowReason { get; set; } = string.Empty;
}
