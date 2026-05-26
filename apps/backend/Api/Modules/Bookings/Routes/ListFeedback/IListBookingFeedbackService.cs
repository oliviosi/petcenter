namespace Api.Modules.Bookings.Routes.ListFeedback;

public interface IListBookingFeedbackService
{
    Task<List<ListBookingFeedbackResponse>> HandleAsync(Guid empresaId, ListBookingFeedbackRequest request);
}
