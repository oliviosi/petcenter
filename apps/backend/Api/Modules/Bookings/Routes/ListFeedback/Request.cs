namespace Api.Modules.Bookings.Routes.ListFeedback;

public class ListBookingFeedbackRequest
{
    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public Guid? ProfessionalId { get; set; }
}
