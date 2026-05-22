namespace Api.Modules.Bookings.Routes.NoShow;

public interface INoShowBookingService
{
    Task<NoShowBookingResponse> HandleAsync(NoShowBookingRequest request);
}
