using Api.Modules.Bookings.Domain;
using Api.Modules.Bookings.Infrastructure;

namespace Api.Modules.Bookings.Routes.CheckStatus;

public class CheckBookingStatusService : ICheckBookingStatusService
{
    private readonly IBookingRepository _bookingRepository;
    private readonly IBookingStatusAccessTokenService _bookingStatusAccessTokenService;

    public CheckBookingStatusService(
        IBookingRepository bookingRepository,
        IBookingStatusAccessTokenService bookingStatusAccessTokenService)
    {
        _bookingRepository = bookingRepository;
        _bookingStatusAccessTokenService = bookingStatusAccessTokenService;
    }

    public async Task<CheckBookingStatusResponse> HandleAsync(CheckBookingStatusRequest request)
    {
        var booking = await _bookingRepository.GetByIdAsync(request.BookingId)
            ?? throw new BookingNotFoundException(request.BookingId);

        if (!_bookingStatusAccessTokenService.VerifyToken(request.StatusAccessToken, booking.BookingStatusAccessTokenHash))
            throw new BookingStatusTokenInvalidException();

        return new CheckBookingStatusResponse
        {
            Id = booking.Id,
            PetshopId = booking.EmpresaId,
            ProfessionalId = booking.ProfessionalId,
            ServiceId = booking.ServiceId,
            State = booking.State,
            RequestedAt = booking.RequestedAt,
            ConfirmedAt = booking.ConfirmedAt,
            SlotStart = booking.SlotStart,
            SlotEnd = booking.SlotEnd,
            Rejection = booking.RejectedAt.HasValue && !string.IsNullOrWhiteSpace(booking.RejectionReason)
                ? new CheckBookingStatusRejectionResponse
                {
                    RejectedAt = booking.RejectedAt.Value,
                    Reason = booking.RejectionReason
                }
                : null,
            Cancellation = booking.CancelledAt.HasValue
                ? new CheckBookingStatusCancellationResponse
                {
                    CancelledAt = booking.CancelledAt.Value
                }
                : null,
            Completion = booking.CompletedAt.HasValue
                ? new CheckBookingStatusCompletionResponse
                {
                    CompletedAt = booking.CompletedAt.Value
                }
                : null,
            NoShow = booking.NoShowAt.HasValue
                ? new CheckBookingStatusNoShowResponse
                {
                    NoShowAt = booking.NoShowAt.Value
                }
                : null
        };
    }
}
