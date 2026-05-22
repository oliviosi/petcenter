using Api.Infrastructure.Persistence;
using Api.Modules.Bookings.Domain;
using Api.Modules.Bookings.Infrastructure;
using Api.Modules.Bookings.Routes.CheckStatus;
using Api.Modules.Empresas.Domain;
using Api.Modules.Profissionais.Domain;
using Api.Modules.Servicos.Domain;
using Api.Tests.Support;

namespace Api.Tests.Bookings;

public class CheckBookingStatusServiceTests
{
    [Fact]
    public async Task HandleAsync_ShouldRejectInvalidToken()
    {
        using var db = TestData.CreateDbContext();
        var booking = SeedRequestedBooking(db, TestData.DefaultBookingStatusAccessToken);
        var sut = new CheckBookingStatusService(
            new BookingRepository(db),
            new BookingStatusAccessTokenService());

        await Assert.ThrowsAsync<BookingStatusTokenInvalidException>(() => sut.HandleAsync(new CheckBookingStatusRequest
        {
            BookingId = booking.Id,
            StatusAccessToken = "token-invalido"
        }));
    }

    [Theory]
    [InlineData(BookingStates.Requested)]
    [InlineData(BookingStates.Confirmed)]
    [InlineData(BookingStates.Rejected)]
    [InlineData(BookingStates.Cancelled)]
    [InlineData(BookingStates.Completed)]
    [InlineData(BookingStates.NoShow)]
    public async Task HandleAsync_ShouldReturnPublicStatusAcrossLifecycleStates(string state)
    {
        using var db = TestData.CreateDbContext();
        var booking = SeedBookingForState(db, state, TestData.DefaultBookingStatusAccessToken);
        var sut = new CheckBookingStatusService(
            new BookingRepository(db),
            new BookingStatusAccessTokenService());

        var response = await sut.HandleAsync(new CheckBookingStatusRequest
        {
            BookingId = booking.Id,
            StatusAccessToken = TestData.DefaultBookingStatusAccessToken
        });

        Assert.Equal(booking.Id, response.Id);
        Assert.Equal(booking.EmpresaId, response.PetshopId);
        Assert.Equal(booking.ProfessionalId, response.ProfessionalId);
        Assert.Equal(booking.ServiceId, response.ServiceId);
        Assert.Equal(state, response.State);
        Assert.Equal(booking.RequestedAt, response.RequestedAt);
        Assert.Equal(booking.ConfirmedAt, response.ConfirmedAt);
        Assert.Equal(booking.SlotStart, response.SlotStart);
        Assert.Equal(booking.SlotEnd, response.SlotEnd);
        Assert.Equal(booking.RejectedAt, response.Rejection?.RejectedAt);
        Assert.Equal(booking.RejectionReason, response.Rejection?.Reason);
        Assert.Equal(booking.CancelledAt, response.Cancellation?.CancelledAt);
        Assert.Equal(booking.CompletedAt, response.Completion?.CompletedAt);
        Assert.Equal(booking.NoShowAt, response.NoShow?.NoShowAt);
    }

    private static Booking SeedRequestedBooking(AppDbContext db, string rawStatusToken)
    {
        var empresa = new Empresa("Pet Center Status");
        var profissional = new Profissional(empresa.Id, "Dra. Ana", "Banho");
        var servico = new Servico(empresa.Id, "Banho", 30, 50m);
        var booking = new Booking(
            empresa.Id,
            profissional.Id,
            servico.Id,
            Guid.NewGuid(),
            "11 97777-0000",
            "Nina",
            "Gato",
            TestData.CreateProtectedBookingStatusToken(rawStatusToken),
            TestData.CreateProtectedFeedbackToken(),
            TestData.ToUtc(new DateOnly(2026, 1, 5), new TimeOnly(9, 0)),
            TestData.ToUtc(new DateOnly(2026, 1, 5), new TimeOnly(9, 30)));

        db.Empresas.Add(empresa);
        db.Profissionais.Add(profissional);
        db.Servicos.Add(servico);
        db.Bookings.Add(booking);
        db.SaveChanges();
        return booking;
    }

    private static Booking SeedBookingForState(AppDbContext db, string state, string rawStatusToken)
    {
        var booking = SeedRequestedBooking(db, rawStatusToken);

        switch (state)
        {
            case BookingStates.Requested:
                break;
            case BookingStates.Confirmed:
                booking.Confirm(TestData.ToUtc(new DateOnly(2026, 1, 5), new TimeOnly(8, 0)));
                break;
            case BookingStates.Rejected:
                booking.Reject("Conflito de agenda.", TestData.ToUtc(new DateOnly(2026, 1, 5), new TimeOnly(8, 15)));
                break;
            case BookingStates.Cancelled:
                booking.Confirm(TestData.ToUtc(new DateOnly(2026, 1, 5), new TimeOnly(8, 0)));
                booking.Cancel("Cliente solicitou cancelamento.", TestData.ToUtc(new DateOnly(2026, 1, 5), new TimeOnly(8, 30)));
                break;
            case BookingStates.Completed:
                booking.Confirm(TestData.ToUtc(new DateOnly(2026, 1, 5), new TimeOnly(8, 0)));
                booking.Complete(60m, TestData.ToUtc(new DateOnly(2026, 1, 5), new TimeOnly(10, 0)));
                break;
            case BookingStates.NoShow:
                booking.Confirm(TestData.ToUtc(new DateOnly(2026, 1, 5), new TimeOnly(8, 0)));
                booking.MarkNoShow("Cliente não compareceu.", TestData.ToUtc(new DateOnly(2026, 1, 5), new TimeOnly(10, 0)));
                break;
            default:
                throw new ArgumentOutOfRangeException(nameof(state), state, null);
        }

        db.SaveChanges();
        return booking;
    }
}
