using Api.Modules.Bookings.Domain;
using Api.Modules.Bookings.Infrastructure;

namespace Api.Modules.Bookings.Routes.Complete;

public class CompleteBookingService : ICompleteBookingService
{
    private readonly IBookingRepository _bookingRepository;
    private readonly TimeProvider _timeProvider;

    public CompleteBookingService(IBookingRepository bookingRepository, TimeProvider timeProvider)
    {
        _bookingRepository = bookingRepository;
        _timeProvider = timeProvider;
    }

    public async Task<CompleteBookingResponse> HandleAsync(CompleteBookingRequest request)
    {
        var booking = await _bookingRepository.GetByIdAsync(request.BookingId)
            ?? throw new BookingNotFoundException(request.BookingId);

        if (booking.EmpresaId != request.EmpresaId)
            throw new BookingForbiddenException();

        booking.Complete(
            request.FinalChargedPrice!.Value,
            _timeProvider.GetUtcNow().UtcDateTime);

        await _bookingRepository.UpdateAsync(booking);

        return new CompleteBookingResponse
        {
            Id = booking.Id,
            State = booking.State,
            FinalChargedPrice = booking.FinalChargedPrice!.Value,
            CompletedAt = booking.CompletedAt!.Value
        };
    }
}
