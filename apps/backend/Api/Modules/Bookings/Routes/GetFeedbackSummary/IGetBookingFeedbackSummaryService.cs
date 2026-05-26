namespace Api.Modules.Bookings.Routes.GetFeedbackSummary;

public interface IGetBookingFeedbackSummaryService
{
    Task<GetBookingFeedbackSummaryResponse> HandleAsync(Guid empresaId);
}
