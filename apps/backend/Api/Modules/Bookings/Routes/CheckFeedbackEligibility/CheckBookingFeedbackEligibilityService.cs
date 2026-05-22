using Api.Modules.Bookings.Domain;
using Api.Modules.Bookings.Infrastructure;

namespace Api.Modules.Bookings.Routes.CheckFeedbackEligibility;

public class CheckBookingFeedbackEligibilityService : ICheckBookingFeedbackEligibilityService
{
    private readonly IBookingRepository _bookingRepository;
    private readonly IBookingFeedbackAccessTokenService _feedbackAccessTokenService;

    public CheckBookingFeedbackEligibilityService(
        IBookingRepository bookingRepository,
        IBookingFeedbackAccessTokenService feedbackAccessTokenService)
    {
        _bookingRepository = bookingRepository;
        _feedbackAccessTokenService = feedbackAccessTokenService;
    }

    public async Task<CheckBookingFeedbackEligibilityResponse> HandleAsync(CheckBookingFeedbackEligibilityRequest request)
    {
        var booking = await _bookingRepository.GetByIdAsync(request.BookingId)
            ?? throw new BookingNotFoundException(request.BookingId);

        if (!_feedbackAccessTokenService.VerifyToken(request.FeedbackAccessToken, booking.FeedbackAccessTokenHash))
            throw new BookingFeedbackTokenInvalidException();

        var feedback = await _bookingRepository.GetFeedbackByBookingIdAsync(booking.Id);
        var canSubmit = booking.CanReceiveFeedback() && feedback is null;

        return new CheckBookingFeedbackEligibilityResponse
        {
            BookingId = booking.Id,
            CanSubmit = canSubmit,
            Reason = canSubmit
                ? null
                : feedback is not null || booking.FeedbackSubmittedAt.HasValue
                    ? "Feedback já enviado para esta reserva."
                    : "A reserva ainda não foi concluída."
        };
    }
}
