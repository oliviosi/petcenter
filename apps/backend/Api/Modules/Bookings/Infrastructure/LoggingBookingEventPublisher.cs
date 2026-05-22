using System.Text.Json;

namespace Api.Modules.Bookings.Infrastructure;

public class LoggingBookingEventPublisher : IBookingEventPublisher
{
    private readonly ILogger<LoggingBookingEventPublisher> _logger;

    public LoggingBookingEventPublisher(ILogger<LoggingBookingEventPublisher> logger) => _logger = logger;

    public Task PublishRequestedAsync(BookingRequestedMessage message)
    {
        _logger.LogInformation(
            "Publishing event {EventName}: {Payload}",
            BookingEventNames.Requested,
            JsonSerializer.Serialize(message));

        return Task.CompletedTask;
    }
}
