namespace Api.Modules.Bookings.Routes.SubmitFeedback;

public class SubmitBookingFeedbackRequest
{
    public Guid BookingId { get; set; }
    public string FeedbackAccessToken { get; set; } = string.Empty;
    public int ProfessionalRating { get; set; }
    public int PetshopRating { get; set; }
    public string? Comment { get; set; }
}
