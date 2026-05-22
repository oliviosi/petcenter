namespace Api.Modules.Bookings.Routes.Cancel;

public class CancelBookingRequest
{
    public Guid BookingId { get; set; }
    public Guid EmpresaId { get; set; }
    public string Reason { get; set; } = string.Empty;
}
