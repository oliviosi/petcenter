using Api.Modules.Bookings.Infrastructure;
using System.ComponentModel.DataAnnotations;

namespace Api.Tests.Bookings;

public class BookingQueueOptionsTests
{
    [Fact]
    public void Validate_ShouldPassForCompleteConfiguration()
    {
        var options = CreateValidOptions();

        var results = Validate(options);

        Assert.Empty(results);
    }

    [Fact]
    public void Validate_ShouldFailWhenRequiredSettingsAreMissing()
    {
        var options = new BookingQueueOptions
        {
            Port = 0
        };

        var results = Validate(options);

        Assert.Contains(results, result => result.MemberNames.Contains(nameof(BookingQueueOptions.HostName)));
        Assert.Contains(results, result => result.MemberNames.Contains(nameof(BookingQueueOptions.Exchange)));
        Assert.Contains(results, result => result.MemberNames.Contains(nameof(BookingQueueOptions.ConfirmedQueue)));
        Assert.Contains(results, result => result.MemberNames.Contains(nameof(BookingQueueOptions.RejectedQueue)));
        Assert.Contains(results, result => result.MemberNames.Contains(nameof(BookingQueueOptions.Port)));
    }

    private static BookingQueueOptions CreateValidOptions() =>
        new()
        {
            HostName = "localhost",
            Port = 5672,
            UserName = "guest",
            Password = "guest",
            VirtualHost = "/",
            Exchange = "bookings",
            ExchangeType = "direct",
            RequestedRoutingKey = "booking.requested",
            ConfirmedQueue = "booking.confirmed.api",
            ConfirmedRoutingKey = "booking.confirmed",
            RejectedQueue = "booking.rejected.api",
            RejectedRoutingKey = "booking.rejected"
        };

    private static List<ValidationResult> Validate(BookingQueueOptions options)
    {
        var results = new List<ValidationResult>();
        Validator.TryValidateObject(options, new ValidationContext(options), results, validateAllProperties: true);
        return results;
    }
}
