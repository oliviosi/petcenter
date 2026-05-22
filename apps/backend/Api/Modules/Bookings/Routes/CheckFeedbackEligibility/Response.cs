namespace Api.Modules.Bookings.Routes.CheckFeedbackEligibility;

public class CheckBookingFeedbackEligibilityResponse
{
    public Guid BookingId { get; set; }
    public bool CanSubmit { get; set; }
    public string? Reason { get; set; }
}
