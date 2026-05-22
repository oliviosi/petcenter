using Api.Modules.Bookings.Routes.Complete;

namespace Api.Tests.Bookings;

public class CompleteBookingRequestValidatorTests
{
    private readonly CompleteBookingRequestValidator _validator = new();

    [Fact]
    public void Validate_ShouldRejectNegativeFinalPrice()
    {
        var result = _validator.Validate(new CompleteBookingRequest
        {
            BookingId = Guid.NewGuid(),
            EmpresaId = Guid.NewGuid(),
            FinalChargedPrice = -1m
        });

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, error => error.PropertyName == nameof(CompleteBookingRequest.FinalChargedPrice));
    }

    [Fact]
    public void Validate_ShouldRejectFinalPriceWithMoreThanTwoDecimalPlaces()
    {
        var result = _validator.Validate(new CompleteBookingRequest
        {
            BookingId = Guid.NewGuid(),
            EmpresaId = Guid.NewGuid(),
            FinalChargedPrice = 10.999m
        });

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, error => error.PropertyName == nameof(CompleteBookingRequest.FinalChargedPrice));
    }
}
