using Api.Modules.Bookings.Infrastructure;

namespace Api.Tests.Support;

public class FakeBookingEventPublisher : IBookingEventPublisher
{
    public List<BookingRequestedMessage> PublishedMessages { get; } = [];
    public Exception? ExceptionToThrow { get; set; }

    public Task PublishRequestedAsync(BookingRequestedMessage message)
    {
        if (ExceptionToThrow is not null)
            throw ExceptionToThrow;

        PublishedMessages.Add(message);
        return Task.CompletedTask;
    }
}
