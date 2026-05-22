namespace Api.Modules.Bookings.Routes.SubmitFeedback;

public class SubmitBookingFeedbackResponse
{
    public Guid BookingId { get; set; }
    public int ProfessionalRating { get; set; }
    public int PetshopRating { get; set; }
    public string? Comment { get; set; }
    public DateTime SubmittedAt { get; set; }
}
