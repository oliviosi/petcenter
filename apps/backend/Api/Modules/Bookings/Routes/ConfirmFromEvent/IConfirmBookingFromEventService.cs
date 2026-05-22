using Api.Modules.Bookings.Infrastructure;

namespace Api.Modules.Bookings.Routes.ConfirmFromEvent;

public interface IConfirmBookingFromEventService
{
    Task HandleAsync(BookingConfirmedMessage message);
}
