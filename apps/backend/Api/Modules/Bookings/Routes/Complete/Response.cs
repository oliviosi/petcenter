namespace Api.Modules.Bookings.Routes.Complete;

public class CompleteBookingResponse
{
    public Guid Id { get; set; }
    public string State { get; set; } = string.Empty;
    public decimal FinalChargedPrice { get; set; }
    public DateTime CompletedAt { get; set; }
}
