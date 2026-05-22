namespace Api.Modules.Bookings.Routes.CheckFeedbackEligibility;

public class CheckBookingFeedbackEligibilityRequest
{
    public Guid BookingId { get; set; }
    public string FeedbackAccessToken { get; set; } = string.Empty;
}
