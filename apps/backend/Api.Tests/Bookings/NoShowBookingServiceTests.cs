using Api.Modules.Bookings.Domain;
using Api.Modules.Bookings.Infrastructure;
using Api.Modules.Bookings.Routes.NoShow;
using Api.Modules.Empresas.Domain;
using Api.Modules.Profissionais.Domain;
using Api.Modules.Servicos.Domain;
using Api.Tests.Support;

namespace Api.Tests.Bookings;

public class NoShowBookingServiceTests
{
    [Fact]
    public async Task HandleAsync_ShouldMarkConfirmedBookingAsNoShow()
    {
        using var db = TestData.CreateDbContext();

        var empresa = new Empresa("Pet Center Alpha");
        var profissional = new Profissional(empresa.Id, "Dra. Ana", "Banho");
        var servico = new Servico(empresa.Id, "Banho premium", 45, 90m);
        var booking = CreateBooking(empresa.Id, profissional.Id, servico.Id);
        booking.Confirm(TestData.ToUtc(new DateOnly(2026, 1, 5), new TimeOnly(8, 30)));

        db.Empresas.Add(empresa);
        db.Profissionais.Add(profissional);
        db.Servicos.Add(servico);
        db.Bookings.Add(booking);
        await db.SaveChangesAsync();

        var noShowAt = TestData.ToUtc(new DateOnly(2026, 1, 5), new TimeOnly(10, 0));
        var sut = new NoShowBookingService(
            new BookingRepository(db),
            new FixedTimeProvider(new DateTimeOffset(noShowAt)));

        var response = await sut.HandleAsync(new NoShowBookingRequest
        {
            BookingId = booking.Id,
            EmpresaId = empresa.Id,
            Reason = "Cliente não compareceu."
        });

        Assert.Equal(BookingStates.NoShow, response.State);
        Assert.Equal(noShowAt, response.NoShowAt);
        Assert.Equal("Cliente não compareceu.", response.NoShowReason);

        var persisted = await db.Bookings.FindAsync(booking.Id);
        Assert.NotNull(persisted);
        Assert.Equal(BookingStates.NoShow, persisted!.State);
        Assert.Equal(noShowAt, persisted.NoShowAt);
        Assert.Equal("Cliente não compareceu.", persisted.NoShowReason);
    }

    [Fact]
    public async Task HandleAsync_ShouldRejectNoShowForNonConfirmedBooking()
    {
        using var db = TestData.CreateDbContext();

        var empresa = new Empresa("Pet Center Alpha");
        var profissional = new Profissional(empresa.Id, "Dra. Ana", "Banho");
        var servico = new Servico(empresa.Id, "Banho premium", 45, 90m);
        var booking = CreateBooking(empresa.Id, profissional.Id, servico.Id);

        db.Empresas.Add(empresa);
        db.Profissionais.Add(profissional);
        db.Servicos.Add(servico);
        db.Bookings.Add(booking);
        await db.SaveChangesAsync();

        var sut = new NoShowBookingService(
            new BookingRepository(db),
            new FixedTimeProvider(new DateTimeOffset(TestData.ToUtc(new DateOnly(2026, 1, 5), new TimeOnly(10, 0)))));

        await Assert.ThrowsAsync<BookingInvalidStateTransitionException>(() => sut.HandleAsync(new NoShowBookingRequest
        {
            BookingId = booking.Id,
            EmpresaId = empresa.Id,
            Reason = "Cliente não compareceu."
        }));
    }

    [Fact]
    public async Task HandleAsync_ShouldRejectCrossTenantNoShow()
    {
        using var db = TestData.CreateDbContext();

        var empresa = new Empresa("Pet Center Alpha");
        var otherEmpresa = new Empresa("Pet Center Beta");
        var profissional = new Profissional(empresa.Id, "Dra. Ana", "Banho");
        var servico = new Servico(empresa.Id, "Banho premium", 45, 90m);
        var booking = CreateBooking(empresa.Id, profissional.Id, servico.Id);
        booking.Confirm(TestData.ToUtc(new DateOnly(2026, 1, 5), new TimeOnly(8, 30)));

        db.Empresas.AddRange(empresa, otherEmpresa);
        db.Profissionais.Add(profissional);
        db.Servicos.Add(servico);
        db.Bookings.Add(booking);
        await db.SaveChangesAsync();

        var sut = new NoShowBookingService(
            new BookingRepository(db),
            new FixedTimeProvider(new DateTimeOffset(TestData.ToUtc(new DateOnly(2026, 1, 5), new TimeOnly(10, 0)))));

        await Assert.ThrowsAsync<BookingForbiddenException>(() => sut.HandleAsync(new NoShowBookingRequest
        {
            BookingId = booking.Id,
            EmpresaId = otherEmpresa.Id,
            Reason = "Cliente não compareceu."
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
