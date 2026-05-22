using Api.Modules.Bookings.Domain;
using Api.Modules.Bookings.Infrastructure;
using Api.Modules.Bookings.Routes.Cancel;
using Api.Modules.Empresas.Domain;
using Api.Modules.Profissionais.Domain;
using Api.Modules.Servicos.Domain;
using Api.Tests.Support;

namespace Api.Tests.Bookings;

public class CancelBookingServiceTests
{
    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public async Task HandleAsync_ShouldCancelRequestedOrConfirmedBooking(bool confirmBeforeCancel)
    {
        using var db = TestData.CreateDbContext();

        var empresa = new Empresa("Pet Center Alpha");
        var profissional = new Profissional(empresa.Id, "Dra. Ana", "Banho");
        var servico = new Servico(empresa.Id, "Banho premium", 45, 90m);
        var booking = CreateBooking(empresa.Id, profissional.Id, servico.Id);

        if (confirmBeforeCancel)
            booking.Confirm(TestData.ToUtc(new DateOnly(2026, 1, 5), new TimeOnly(8, 30)));

        db.Empresas.Add(empresa);
        db.Profissionais.Add(profissional);
        db.Servicos.Add(servico);
        db.Bookings.Add(booking);
        await db.SaveChangesAsync();

        var cancelledAt = TestData.ToUtc(new DateOnly(2026, 1, 5), new TimeOnly(8, 45));
        var sut = new CancelBookingService(
            new BookingRepository(db),
            new FixedTimeProvider(new DateTimeOffset(cancelledAt)));

        var response = await sut.HandleAsync(new CancelBookingRequest
        {
            BookingId = booking.Id,
            EmpresaId = empresa.Id,
            Reason = "Cliente solicitou cancelamento."
        });

        Assert.Equal(BookingStates.Cancelled, response.State);
        Assert.Equal(cancelledAt, response.CancelledAt);
        Assert.Equal("Cliente solicitou cancelamento.", response.CancellationReason);

        var persisted = await db.Bookings.FindAsync(booking.Id);
        Assert.NotNull(persisted);
        Assert.Equal(BookingStates.Cancelled, persisted!.State);
        Assert.Equal(cancelledAt, persisted.CancelledAt);
        Assert.Equal("Cliente solicitou cancelamento.", persisted.CancellationReason);
    }

    [Fact]
    public async Task HandleAsync_ShouldRejectCancellationForIneligibleTerminalState()
    {
        using var db = TestData.CreateDbContext();

        var empresa = new Empresa("Pet Center Alpha");
        var profissional = new Profissional(empresa.Id, "Dra. Ana", "Banho");
        var servico = new Servico(empresa.Id, "Banho premium", 45, 90m);
        var booking = CreateBooking(empresa.Id, profissional.Id, servico.Id);
        booking.Confirm(TestData.ToUtc(new DateOnly(2026, 1, 5), new TimeOnly(8, 30)));
        booking.Complete(120m, TestData.ToUtc(new DateOnly(2026, 1, 5), new TimeOnly(10, 0)));

        db.Empresas.Add(empresa);
        db.Profissionais.Add(profissional);
        db.Servicos.Add(servico);
        db.Bookings.Add(booking);
        await db.SaveChangesAsync();

        var sut = new CancelBookingService(
            new BookingRepository(db),
            new FixedTimeProvider(new DateTimeOffset(TestData.ToUtc(new DateOnly(2026, 1, 5), new TimeOnly(10, 15)))));

        await Assert.ThrowsAsync<BookingInvalidStateTransitionException>(() => sut.HandleAsync(new CancelBookingRequest
        {
            BookingId = booking.Id,
            EmpresaId = empresa.Id,
            Reason = "Encerrando reserva."
        }));
    }

    [Fact]
    public async Task HandleAsync_ShouldRejectCrossTenantCancellation()
    {
        using var db = TestData.CreateDbContext();

        var empresa = new Empresa("Pet Center Alpha");
        var otherEmpresa = new Empresa("Pet Center Beta");
        var profissional = new Profissional(empresa.Id, "Dra. Ana", "Banho");
        var servico = new Servico(empresa.Id, "Banho premium", 45, 90m);
        var booking = CreateBooking(empresa.Id, profissional.Id, servico.Id);

        db.Empresas.AddRange(empresa, otherEmpresa);
        db.Profissionais.Add(profissional);
        db.Servicos.Add(servico);
        db.Bookings.Add(booking);
        await db.SaveChangesAsync();

        var sut = new CancelBookingService(
            new BookingRepository(db),
            new FixedTimeProvider(new DateTimeOffset(TestData.ToUtc(new DateOnly(2026, 1, 5), new TimeOnly(8, 45)))));

        await Assert.ThrowsAsync<BookingForbiddenException>(() => sut.HandleAsync(new CancelBookingRequest
        {
            BookingId = booking.Id,
            EmpresaId = otherEmpresa.Id,
            Reason = "Empresa incorreta."
        }));
    }

    private static Booking CreateBooking(Guid empresaId, Guid professionalId, Guid serviceId) =>
        new(
            empresaId,
            professionalId,
            serviceId,
            Guid.NewGuid(),
            "11 98888-0000",
            "Luna",
            "Cachorro",
            TestData.CreateProtectedFeedbackToken(),
            TestData.ToUtc(new DateOnly(2026, 1, 5), new TimeOnly(9, 0)),
            TestData.ToUtc(new DateOnly(2026, 1, 5), new TimeOnly(9, 45)));
}
