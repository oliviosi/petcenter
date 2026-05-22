using Api.Modules.Bookings.Routes.SubmitFeedback;

namespace Api.Tests.Bookings;

public class SubmitBookingFeedbackRequestValidatorTests
{
    private readonly SubmitBookingFeedbackRequestValidator _validator = new();

    [Theory]
    [InlineData(0)]
    [InlineData(6)]
    public void Validate_ShouldRejectProfessionalRatingOutsideScale(int rating)
    {
        var result = _validator.Validate(new SubmitBookingFeedbackRequest
        {
            BookingId = Guid.NewGuid(),
            FeedbackAccessToken = "token",
            ProfessionalRating = rating,
            PetshopRating = 4
        });

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, error => error.PropertyName == nameof(SubmitBookingFeedbackRequest.ProfessionalRating));
    }

    [Theory]
    [InlineData(0)]
    [InlineData(6)]
    public void Validate_ShouldRejectPetshopRatingOutsideScale(int rating)
    {
        var result = _validator.Validate(new SubmitBookingFeedbackRequest
        {
            BookingId = Guid.NewGuid(),
            FeedbackAccessToken = "token",
            ProfessionalRating = 4,
            PetshopRating = rating
        });

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, error => error.PropertyName == nameof(SubmitBookingFeedbackRequest.PetshopRating));
    }
}
