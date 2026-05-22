namespace Api.Modules.Bookings.Routes.CheckFeedbackEligibility;

public interface ICheckBookingFeedbackEligibilityService
{
    Task<CheckBookingFeedbackEligibilityResponse> HandleAsync(CheckBookingFeedbackEligibilityRequest request);
}
