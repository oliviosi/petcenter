using Api.Modules.Bookings.Infrastructure;
using Api.Modules.Profissionais.Domain;
using Api.Modules.Profissionais.Infrastructure;

namespace Api.Modules.Bookings.Routes.ListFeedback;

public class ListBookingFeedbackService : IListBookingFeedbackService
{
    private readonly IBookingRepository _bookingRepository;
    private readonly IProfissionalRepository _professionalRepository;

    public ListBookingFeedbackService(
        IBookingRepository bookingRepository,
        IProfissionalRepository professionalRepository)
    {
        _bookingRepository = bookingRepository;
        _professionalRepository = professionalRepository;
    }

    public async Task<List<ListBookingFeedbackResponse>> HandleAsync(Guid empresaId, ListBookingFeedbackRequest request)
    {
        if (request.ProfessionalId.HasValue)
        {
            var professional = await _professionalRepository.GetByIdAsync(request.ProfessionalId.Value, empresaId);
            if (professional is null)
                throw new ProfissionalNotFoundException(request.ProfessionalId.Value);
        }

        var submittedFrom = request.StartDate.HasValue
            ? (DateTime?)ToUtc(request.StartDate.Value)
            : null;

        var submittedToExclusive = request.EndDate.HasValue
            ? (DateTime?)ToUtc(request.EndDate.Value.AddDays(1))
            : null;

        var feedbacks = await _bookingRepository.ListFeedbackByEmpresaAsync(
            empresaId,
            submittedFrom,
            submittedToExclusive,
            request.ProfessionalId);

        var professionals = await _professionalRepository.ListByIdsAsync(
            empresaId,
            feedbacks.Select(feedback => feedback.ProfessionalId));

        var professionalsById = professionals.ToDictionary(professional => professional.Id);

        return feedbacks.Select(feedback =>
        {
            professionalsById.TryGetValue(feedback.ProfessionalId, out var professional);

            return new ListBookingFeedbackResponse
            {
                BookingId = feedback.BookingId,
                Professional = new ListBookingFeedbackProfessionalResponse
                {
                    Id = feedback.ProfessionalId,
                    Nome = professional?.Nome ?? string.Empty,
                    Especialidade = professional?.Especialidade
                },
                PetshopRating = feedback.PetshopRating,
                ProfessionalRating = feedback.ProfessionalRating,
                Comment = feedback.Comment,
                SubmittedAt = feedback.SubmittedAt
            };
        }).ToList();
    }

    private static DateTime ToUtc(DateOnly date) =>
        DateTime.SpecifyKind(date.ToDateTime(TimeOnly.MinValue), DateTimeKind.Utc);
}
