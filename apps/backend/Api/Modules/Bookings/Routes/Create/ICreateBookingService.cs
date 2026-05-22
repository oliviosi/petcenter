namespace Api.Modules.Bookings.Routes.Create;

public interface ICreateBookingService
{
    Task<CreateBookingResponse> HandleAsync(CreateBookingRequest request);
}
