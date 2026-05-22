namespace Api.Modules.Bookings.Routes.Complete;

public interface ICompleteBookingService
{
    Task<CompleteBookingResponse> HandleAsync(CompleteBookingRequest request);
}
