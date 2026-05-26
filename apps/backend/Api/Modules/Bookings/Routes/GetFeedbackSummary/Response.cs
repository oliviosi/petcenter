namespace Api.Modules.Bookings.Routes.GetFeedbackSummary;

public class GetBookingFeedbackSummaryResponse
{
    public GetBookingFeedbackPetshopSummaryResponse Petshop { get; set; } = new();
    public List<GetBookingFeedbackProfessionalSummaryResponse> Professionals { get; set; } = [];
}

public class GetBookingFeedbackPetshopSummaryResponse
{
    public decimal? AverageRating { get; set; }
    public int FeedbackCount { get; set; }
    public bool IsRated { get; set; }
}

public class GetBookingFeedbackProfessionalSummaryResponse
{
    public Guid ProfessionalId { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string? Especialidade { get; set; }
    public decimal? AverageRating { get; set; }
    public int FeedbackCount { get; set; }
    public bool IsRated { get; set; }
}
