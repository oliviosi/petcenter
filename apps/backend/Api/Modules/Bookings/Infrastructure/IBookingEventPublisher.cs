namespace Api.Modules.Bookings.Infrastructure;

public interface IBookingEventPublisher
{
    Task PublishRequestedAsync(BookingRequestedMessage message);
}
