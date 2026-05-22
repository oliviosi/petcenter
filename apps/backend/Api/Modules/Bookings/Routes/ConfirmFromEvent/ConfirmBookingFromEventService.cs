using Api.Modules.Bookings.Domain;
using Api.Modules.Bookings.Infrastructure;

namespace Api.Modules.Bookings.Routes.ConfirmFromEvent;

public class ConfirmBookingFromEventService : IConfirmBookingFromEventService
{
    private readonly IBookingRepository _bookingRepository;
    private readonly IInboxEntryRepository _inboxRepository;
    private readonly TimeProvider _timeProvider;

    public ConfirmBookingFromEventService(
        IBookingRepository bookingRepository,
        IInboxEntryRepository inboxRepository,
        TimeProvider timeProvider)
    {
        _bookingRepository = bookingRepository;
        _inboxRepository = inboxRepository;
        _timeProvider = timeProvider;
    }

    public async Task HandleAsync(BookingConfirmedMessage message)
    {
        if (await _inboxRepository.ExistsAsync(message.MessageId))
            return;

        var booking = await _bookingRepository.GetByIdAsync(message.BookingId)
            ?? throw new BookingNotFoundException(message.BookingId);

        if (booking.State == BookingStates.Requested)
            booking.Confirm(NormalizeUtc(message.ConfirmedAt));

        if (booking.State == BookingStates.Confirmed)
            await _bookingRepository.UpdateAsync(booking);

        await _inboxRepository.AddAsync(new InboxEntry(
            message.MessageId,
            BookingEventNames.Confirmed,
            _timeProvider.GetUtcNow().UtcDateTime));
    }

    private static DateTime NormalizeUtc(DateTime value) =>
        value.Kind == DateTimeKind.Utc
            ? value
            : value.Kind == DateTimeKind.Unspecified
                ? DateTime.SpecifyKind(value, DateTimeKind.Utc)
                : value.ToUniversalTime();
}
