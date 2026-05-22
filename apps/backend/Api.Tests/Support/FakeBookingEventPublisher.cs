using Api.Modules.Bookings.Infrastructure;

namespace Api.Tests.Support;

public class FakeBookingEventPublisher : IBookingEventPublisher
{
    public List<BookingRequestedMessage> PublishedMessages { get; } = [];

    public Task PublishRequestedAsync(BookingRequestedMessage message)
    {
        PublishedMessages.Add(message);
        return Task.CompletedTask;
    }
}
