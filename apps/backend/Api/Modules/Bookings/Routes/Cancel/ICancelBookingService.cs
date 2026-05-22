namespace Api.Modules.Bookings.Routes.Cancel;

public interface ICancelBookingService
{
    Task<CancelBookingResponse> HandleAsync(CancelBookingRequest request);
}
