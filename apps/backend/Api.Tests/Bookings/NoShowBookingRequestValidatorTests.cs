using Api.Modules.Bookings.Routes.NoShow;

namespace Api.Tests.Bookings;

public class NoShowBookingRequestValidatorTests
{
    private readonly NoShowBookingRequestValidator _validator = new();

    [Fact]
    public void Validate_ShouldRejectMissingReason()
    {
        var result = _validator.Validate(new NoShowBookingRequest
        {
            BookingId = Guid.NewGuid(),
            EmpresaId = Guid.NewGuid(),
            Reason = string.Empty
        });

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, error => error.PropertyName == nameof(NoShowBookingRequest.Reason));
    }

    [Fact]
    public void Validate_ShouldRejectReasonLongerThan500Characters()
    {
        var result = _validator.Validate(new NoShowBookingRequest
        {
            BookingId = Guid.NewGuid(),
            EmpresaId = Guid.NewGuid(),
            Reason = new string('a', 501)
        });

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, error => error.PropertyName == nameof(NoShowBookingRequest.Reason));
    }
}
