namespace Api.Modules.Bookings.Routes.CheckStatus;

public class CheckBookingStatusRequest
{
    public Guid BookingId { get; set; }
    public string StatusAccessToken { get; set; } = string.Empty;
}
