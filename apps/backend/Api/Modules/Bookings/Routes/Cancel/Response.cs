namespace Api.Modules.Bookings.Routes.Cancel;

public class CancelBookingResponse
{
    public Guid Id { get; set; }
    public string State { get; set; } = string.Empty;
    public DateTime CancelledAt { get; set; }
    public string CancellationReason { get; set; } = string.Empty;
}
