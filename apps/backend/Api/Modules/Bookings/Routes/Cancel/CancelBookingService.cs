using Api.Modules.Bookings.Domain;
using Api.Modules.Bookings.Infrastructure;

namespace Api.Modules.Bookings.Routes.Cancel;

public class CancelBookingService : ICancelBookingService
{
    private readonly IBookingRepository _bookingRepository;
    private readonly TimeProvider _timeProvider;

    public CancelBookingService(IBookingRepository bookingRepository, TimeProvider timeProvider)
    {
        _bookingRepository = bookingRepository;
        _timeProvider = timeProvider;
    }

    public async Task<CancelBookingResponse> HandleAsync(CancelBookingRequest request)
    {
        var booking = await _bookingRepository.GetByIdAsync(request.BookingId)
            ?? throw new BookingNotFoundException(request.BookingId);

        if (booking.EmpresaId != request.EmpresaId)
            throw new BookingForbiddenException();

        booking.Cancel(
            request.Reason,
            _timeProvider.GetUtcNow().UtcDateTime);

        await _bookingRepository.UpdateAsync(booking);

        return new CancelBookingResponse
        {
            Id = booking.Id,
            State = booking.State,
            CancelledAt = booking.CancelledAt!.Value,
            CancellationReason = booking.CancellationReason!
        };
    }
}
