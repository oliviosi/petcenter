using Api.Modules.Bookings.Routes.Cancel;

namespace Api.Tests.Bookings;

public class CancelBookingRequestValidatorTests
{
    private readonly CancelBookingRequestValidator _validator = new();

    [Fact]
    public void Validate_ShouldRejectMissingReason()
    {
        var result = _validator.Validate(new CancelBookingRequest
        {
            BookingId = Guid.NewGuid(),
            EmpresaId = Guid.NewGuid(),
            Reason = string.Empty
        });

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, error => error.PropertyName == nameof(CancelBookingRequest.Reason));
    }

    [Fact]
    public void Validate_ShouldRejectReasonLongerThan500Characters()
    {
        var result = _validator.Validate(new CancelBookingRequest
        {
            BookingId = Guid.NewGuid(),
            EmpresaId = Guid.NewGuid(),
            Reason = new string('a', 501)
        });

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, error => error.PropertyName == nameof(CancelBookingRequest.Reason));
    }
}
