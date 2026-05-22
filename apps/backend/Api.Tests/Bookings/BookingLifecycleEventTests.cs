using Api.Modules.Bookings.Domain;
using Api.Modules.Bookings.Infrastructure;
using Api.Modules.Bookings.Routes.ConfirmFromEvent;
using Api.Modules.Bookings.Routes.RejectFromEvent;
using Api.Tests.Support;

namespace Api.Tests.Bookings;

public class BookingLifecycleEventTests
{
    [Fact]
    public async Task HandleAsync_ShouldConfirmBookingIdempotently()
    {
        using var db = TestData.CreateDbContext();
        var booking = new Booking(
            Guid.NewGuid(),
            Guid.NewGuid(),
            Guid.NewGuid(),
            Guid.NewGuid(),
            "11 98888-0000",
            "Luna",
            "Cachorro",
            TestData.CreateProtectedBookingStatusToken(),
            TestData.CreateProtectedFeedbackToken(),
            DateTime.SpecifyKind(new DateTime(2026, 1, 5, 9, 0, 0), DateTimeKind.Utc),
            DateTime.SpecifyKind(new DateTime(2026, 1, 5, 9, 30, 0), DateTimeKind.Utc));
        db.Bookings.Add(booking);
        await db.SaveChangesAsync();

        var service = new ConfirmBookingFromEventService(
            new BookingRepository(db),
            new InboxEntryRepository(db),
            new FixedTimeProvider(new DateTimeOffset(DateTime.SpecifyKind(new DateTime(2026, 1, 5, 8, 0, 0), DateTimeKind.Utc))));

        var message = new BookingConfirmedMessage
        {
            MessageId = "booking-confirmed-1",
            BookingId = booking.Id,
            ConfirmedAt = DateTime.SpecifyKind(new DateTime(2026, 1, 5, 8, 0, 0), DateTimeKind.Utc)
        };

        await service.HandleAsync(message);
        await service.HandleAsync(message);

        var persisted = await db.Bookings.FindAsync(booking.Id);
        Assert.NotNull(persisted);
        Assert.Equal(BookingStates.Confirmed, persisted!.State);
        Assert.Single(db.InboxEntries);
    }

    [Fact]
    public async Task HandleAsync_ShouldRejectBookingAndStoreReason()
    {
        using var db = TestData.CreateDbContext();
        var booking = new Booking(
            Guid.NewGuid(),
            Guid.NewGuid(),
            Guid.NewGuid(),
            Guid.NewGuid(),
            "11 98888-0000",
            "Luna",
            "Cachorro",
            TestData.CreateProtectedBookingStatusToken(),
            TestData.CreateProtectedFeedbackToken(),
            DateTime.SpecifyKind(new DateTime(2026, 1, 5, 9, 0, 0), DateTimeKind.Utc),
            DateTime.SpecifyKind(new DateTime(2026, 1, 5, 9, 30, 0), DateTimeKind.Utc));
        db.Bookings.Add(booking);
        await db.SaveChangesAsync();

        var service = new RejectBookingFromEventService(
            new BookingRepository(db),
            new InboxEntryRepository(db),
            new FixedTimeProvider(new DateTimeOffset(DateTime.SpecifyKind(new DateTime(2026, 1, 5, 8, 0, 0), DateTimeKind.Utc))));

        await service.HandleAsync(new BookingRejectedMessage
        {
            MessageId = "booking-rejected-1",
            BookingId = booking.Id,
            RejectedAt = DateTime.SpecifyKind(new DateTime(2026, 1, 5, 8, 15, 0), DateTimeKind.Utc),
            RejectionReason = "Conflito de agenda."
        });

        var persisted = await db.Bookings.FindAsync(booking.Id);
        Assert.NotNull(persisted);
        Assert.Equal(BookingStates.Rejected, persisted!.State);
        Assert.Equal("Conflito de agenda.", persisted.RejectionReason);
        Assert.Single(db.InboxEntries);
    }

    [Theory]
    [InlineData(true)]
    [InlineData(false)]
    public async Task HandleAsync_ShouldIgnoreLateQueueOutcomesAfterRequestedCancellation(bool useConfirmedEvent)
    {
        using var db = TestData.CreateDbContext();
        var booking = new Booking(
            Guid.NewGuid(),
            Guid.NewGuid(),
            Guid.NewGuid(),
            Guid.NewGuid(),
            "11 98888-0000",
            "Luna",
            "Cachorro",
            TestData.CreateProtectedBookingStatusToken(),
            TestData.CreateProtectedFeedbackToken(),
            DateTime.SpecifyKind(new DateTime(2026, 1, 5, 9, 0, 0), DateTimeKind.Utc),
            DateTime.SpecifyKind(new DateTime(2026, 1, 5, 9, 30, 0), DateTimeKind.Utc));
        booking.Cancel("Cliente solicitou cancelamento.", DateTime.SpecifyKind(new DateTime(2026, 1, 5, 7, 45, 0), DateTimeKind.Utc));
        db.Bookings.Add(booking);
        await db.SaveChangesAsync();

        if (useConfirmedEvent)
        {
            var service = new ConfirmBookingFromEventService(
                new BookingRepository(db),
                new InboxEntryRepository(db),
                new FixedTimeProvider(new DateTimeOffset(DateTime.SpecifyKind(new DateTime(2026, 1, 5, 8, 0, 0), DateTimeKind.Utc))));

            await service.HandleAsync(new BookingConfirmedMessage
            {
                MessageId = "booking-confirmed-late",
                BookingId = booking.Id,
                ConfirmedAt = DateTime.SpecifyKind(new DateTime(2026, 1, 5, 8, 0, 0), DateTimeKind.Utc)
            });
        }
        else
        {
            var service = new RejectBookingFromEventService(
                new BookingRepository(db),
                new InboxEntryRepository(db),
                new FixedTimeProvider(new DateTimeOffset(DateTime.SpecifyKind(new DateTime(2026, 1, 5, 8, 5, 0), DateTimeKind.Utc))));

            await service.HandleAsync(new BookingRejectedMessage
            {
                MessageId = "booking-rejected-late",
                BookingId = booking.Id,
                RejectedAt = DateTime.SpecifyKind(new DateTime(2026, 1, 5, 8, 5, 0), DateTimeKind.Utc),
                RejectionReason = "Conflito de agenda."
            });
        }

        var persisted = await db.Bookings.FindAsync(booking.Id);
        Assert.NotNull(persisted);
        Assert.Equal(BookingStates.Cancelled, persisted!.State);
        Assert.Equal("Cliente solicitou cancelamento.", persisted.CancellationReason);
        Assert.Single(db.InboxEntries);
    }
}
