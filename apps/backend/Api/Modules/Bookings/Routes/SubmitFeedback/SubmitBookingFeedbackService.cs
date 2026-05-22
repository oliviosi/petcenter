using Api.Modules.Bookings.Domain;
using Api.Modules.Bookings.Infrastructure;

namespace Api.Modules.Bookings.Routes.SubmitFeedback;

public class SubmitBookingFeedbackService : ISubmitBookingFeedbackService
{
    private readonly IBookingRepository _bookingRepository;
    private readonly IBookingFeedbackAccessTokenService _feedbackAccessTokenService;
    private readonly TimeProvider _timeProvider;

    public SubmitBookingFeedbackService(
        IBookingRepository bookingRepository,
        IBookingFeedbackAccessTokenService feedbackAccessTokenService,
        TimeProvider timeProvider)
    {
        _bookingRepository = bookingRepository;
        _feedbackAccessTokenService = feedbackAccessTokenService;
        _timeProvider = timeProvider;
    }

    public async Task<SubmitBookingFeedbackResponse> HandleAsync(SubmitBookingFeedbackRequest request)
    {
        var booking = await _bookingRepository.GetByIdAsync(request.BookingId)
            ?? throw new BookingNotFoundException(request.BookingId);

        if (!_feedbackAccessTokenService.VerifyToken(request.FeedbackAccessToken, booking.FeedbackAccessTokenHash))
            throw new BookingFeedbackTokenInvalidException();

        if (!booking.CanReceiveFeedback())
            throw new BookingFeedbackNotEligibleException();

        var existingFeedback = await _bookingRepository.GetFeedbackByBookingIdAsync(booking.Id);
        if (existingFeedback is not null)
            throw new BookingFeedbackAlreadySubmittedException(booking.Id);

        var submittedAt = _timeProvider.GetUtcNow().UtcDateTime;
        var feedback = new BookingFeedback(
            booking.Id,
            booking.EmpresaId,
            booking.ProfessionalId,
            request.ProfessionalRating,
            request.PetshopRating,
            request.Comment,
            submittedAt);

        booking.RegistrarFeedbackEnviado(submittedAt);

        await _bookingRepository.AddFeedbackAsync(booking, feedback);

        return new SubmitBookingFeedbackResponse
        {
            BookingId = booking.Id,
            ProfessionalRating = feedback.ProfessionalRating,
            PetshopRating = feedback.PetshopRating,
            Comment = feedback.Comment,
            SubmittedAt = feedback.SubmittedAt
        };
    }
}
