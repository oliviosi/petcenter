namespace Api.Modules.Bookings.Routes.NoShow;

public class NoShowBookingRequest
{
    public Guid BookingId { get; set; }
    public Guid EmpresaId { get; set; }
    public string Reason { get; set; } = string.Empty;
}
