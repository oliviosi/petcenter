using Api.Modules.Bookings.Domain;
using Api.Modules.Bookings.Infrastructure;

namespace Api.Modules.Bookings.Routes.NoShow;

public class NoShowBookingService : INoShowBookingService
{
    private readonly IBookingRepository _bookingRepository;
    private readonly TimeProvider _timeProvider;

    public NoShowBookingService(IBookingRepository bookingRepository, TimeProvider timeProvider)
    {
        _bookingRepository = bookingRepository;
        _timeProvider = timeProvider;
    }

    public async Task<NoShowBookingResponse> HandleAsync(NoShowBookingRequest request)
    {
        var booking = await _bookingRepository.GetByIdAsync(request.BookingId)
            ?? throw new BookingNotFoundException(request.BookingId);

        if (booking.EmpresaId != request.EmpresaId)
            throw new BookingForbiddenException();

        booking.MarkNoShow(
            request.Reason,
            _timeProvider.GetUtcNow().UtcDateTime);

        await _bookingRepository.UpdateAsync(booking);

        return new NoShowBookingResponse
        {
            Id = booking.Id,
            State = booking.State,
            NoShowAt = booking.NoShowAt!.Value,
            NoShowReason = booking.NoShowReason!
        };
    }
}
