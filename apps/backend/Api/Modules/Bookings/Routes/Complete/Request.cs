namespace Api.Modules.Bookings.Routes.Complete;

public class CompleteBookingRequest
{
    public Guid BookingId { get; set; }
    public Guid EmpresaId { get; set; }
    public decimal? FinalChargedPrice { get; set; }
}
