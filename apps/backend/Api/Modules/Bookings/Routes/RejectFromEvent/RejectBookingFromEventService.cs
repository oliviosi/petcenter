using Api.Modules.Bookings.Domain;
using Api.Modules.Bookings.Infrastructure;

namespace Api.Modules.Bookings.Routes.RejectFromEvent;

public class RejectBookingFromEventService : IRejectBookingFromEventService
{
    private readonly IBookingRepository _bookingRepository;
    private readonly IInboxEntryRepository _inboxRepository;
    private readonly TimeProvider _timeProvider;

    public RejectBookingFromEventService(
        IBookingRepository bookingRepository,
        IInboxEntryRepository inboxRepository,
        TimeProvider timeProvider)
    {
        _bookingRepository = bookingRepository;
        _inboxRepository = inboxRepository;
        _timeProvider = timeProvider;
    }

    public async Task HandleAsync(BookingRejectedMessage message)
    {
        if (await _inboxRepository.ExistsAsync(message.MessageId))
            return;

        var booking = await _bookingRepository.GetByIdAsync(message.BookingId)
            ?? throw new BookingNotFoundException(message.BookingId);

        if (booking.State == BookingStates.Requested)
        {
            booking.Reject(message.RejectionReason, NormalizeUtc(message.RejectedAt));
            await _bookingRepository.UpdateAsync(booking);
        }

        await _inboxRepository.AddAsync(new InboxEntry(
            message.MessageId,
            BookingEventNames.Rejected,
            _timeProvider.GetUtcNow().UtcDateTime));
    }

    private static DateTime NormalizeUtc(DateTime value) =>
        value.Kind == DateTimeKind.Utc
            ? value
            : value.Kind == DateTimeKind.Unspecified
                ? DateTime.SpecifyKind(value, DateTimeKind.Utc)
                : value.ToUniversalTime();
}
