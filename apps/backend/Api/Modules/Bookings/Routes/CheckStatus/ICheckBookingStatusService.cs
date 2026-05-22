namespace Api.Modules.Bookings.Routes.CheckStatus;

public interface ICheckBookingStatusService
{
    Task<CheckBookingStatusResponse> HandleAsync(CheckBookingStatusRequest request);
}
