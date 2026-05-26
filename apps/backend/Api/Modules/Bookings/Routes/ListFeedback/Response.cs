namespace Api.Modules.Bookings.Routes.ListFeedback;

public class ListBookingFeedbackResponse
{
    public Guid BookingId { get; set; }
    public ListBookingFeedbackProfessionalResponse Professional { get; set; } = new();
    public int PetshopRating { get; set; }
    public int ProfessionalRating { get; set; }
    public string? Comment { get; set; }
    public DateTime SubmittedAt { get; set; }
}

public class ListBookingFeedbackProfessionalResponse
{
    public Guid Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string? Especialidade { get; set; }
}
