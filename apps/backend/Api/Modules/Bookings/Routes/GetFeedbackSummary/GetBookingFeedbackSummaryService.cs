using Api.Modules.Bookings.Infrastructure;
using Api.Modules.Profissionais.Infrastructure;

namespace Api.Modules.Bookings.Routes.GetFeedbackSummary;

public class GetBookingFeedbackSummaryService : IGetBookingFeedbackSummaryService
{
    private readonly IBookingRepository _bookingRepository;
    private readonly IProfissionalRepository _professionalRepository;

    public GetBookingFeedbackSummaryService(
        IBookingRepository bookingRepository,
        IProfissionalRepository professionalRepository)
    {
        _bookingRepository = bookingRepository;
        _professionalRepository = professionalRepository;
    }

    public async Task<GetBookingFeedbackSummaryResponse> HandleAsync(Guid empresaId)
    {
        var feedbacks = await _bookingRepository.ListFeedbackByEmpresaAsync(empresaId);
        var professionals = await _professionalRepository.ListByIdsAsync(
            empresaId,
            feedbacks.Select(feedback => feedback.ProfessionalId));

        var professionalsById = professionals.ToDictionary(professional => professional.Id);

        return new GetBookingFeedbackSummaryResponse
        {
            Petshop = new GetBookingFeedbackPetshopSummaryResponse
            {
                AverageRating = feedbacks.Count == 0
                    ? null
                    : decimal.Round(
                        feedbacks.Average(feedback => (decimal)feedback.PetshopRating),
                        2,
                        MidpointRounding.AwayFromZero),
                FeedbackCount = feedbacks.Count,
                IsRated = feedbacks.Count > 0
            },
            Professionals = feedbacks
                .GroupBy(feedback => feedback.ProfessionalId)
                .Select(group =>
                {
                    professionalsById.TryGetValue(group.Key, out var professional);

                    return new GetBookingFeedbackProfessionalSummaryResponse
                    {
                        ProfessionalId = group.Key,
                        Nome = professional?.Nome ?? string.Empty,
                        Especialidade = professional?.Especialidade,
                        AverageRating = decimal.Round(
                            group.Average(feedback => (decimal)feedback.ProfessionalRating),
                            2,
                            MidpointRounding.AwayFromZero),
                        FeedbackCount = group.Count(),
                        IsRated = true
                    };
                })
                .OrderByDescending(item => item.AverageRating)
                .ThenByDescending(item => item.FeedbackCount)
                .ThenBy(item => item.Nome)
                .ToList()
        };
    }
}
