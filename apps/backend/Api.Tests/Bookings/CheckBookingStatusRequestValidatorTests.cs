using Api.Modules.Bookings.Routes.CheckStatus;

namespace Api.Tests.Bookings;

public class CheckBookingStatusRequestValidatorTests
{
    private readonly CheckBookingStatusRequestValidator _validator = new();

    [Fact]
    public void Validate_ShouldRejectMissingStatusToken()
    {
        var result = _validator.Validate(new CheckBookingStatusRequest
        {
            BookingId = Guid.NewGuid(),
            StatusAccessToken = string.Empty
        });

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, error => error.PropertyName == nameof(CheckBookingStatusRequest.StatusAccessToken));
    }

    [Fact]
    public void Validate_ShouldRejectStatusTokenLongerThan200Characters()
    {
        var result = _validator.Validate(new CheckBookingStatusRequest
        {
            BookingId = Guid.NewGuid(),
            StatusAccessToken = new string('a', 201)
        });

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, error => error.PropertyName == nameof(CheckBookingStatusRequest.StatusAccessToken));
    }
}
