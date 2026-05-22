namespace Api.Modules.Bookings.Routes.SubmitFeedback;

public interface ISubmitBookingFeedbackService
{
    Task<SubmitBookingFeedbackResponse> HandleAsync(SubmitBookingFeedbackRequest request);
}
