using Api.Modules.Bookings.Infrastructure;

namespace Api.Modules.Bookings.Routes.RejectFromEvent;

public interface IRejectBookingFromEventService
{
    Task HandleAsync(BookingRejectedMessage message);
}
