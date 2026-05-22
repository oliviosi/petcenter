using Api.Modules.Bookings.Domain;
using Api.Modules.Bookings.Infrastructure;
using Api.Modules.Bookings.Routes.Complete;
using Api.Modules.Empresas.Domain;
using Api.Modules.Profissionais.Domain;
using Api.Modules.Servicos.Domain;
using Api.Tests.Support;

namespace Api.Tests.Bookings;

public class CompleteBookingServiceTests
{
    [Fact]
    public async Task HandleAsync_ShouldCompleteConfirmedBookingAndPersistFinalPrice()
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

        var completionTime = TestData.ToUtc(new DateOnly(2026, 1, 5), new TimeOnly(10, 15));
        var sut = new CompleteBookingService(
            new BookingRepository(db),
            new FixedTimeProvider(new DateTimeOffset(completionTime)));

        var response = await sut.HandleAsync(new CompleteBookingRequest
        {
            BookingId = booking.Id,
            EmpresaId = empresa.Id,
            FinalChargedPrice = 120m
        });

        Assert.Equal(BookingStates.Completed, response.State);
        Assert.Equal(120m, response.FinalChargedPrice);
        Assert.Equal(completionTime, response.CompletedAt);

        var persisted = await db.Bookings.FindAsync(booking.Id);
        Assert.NotNull(persisted);
        Assert.Equal(BookingStates.Completed, persisted!.State);
        Assert.Equal(120m, persisted.FinalChargedPrice);
        Assert.Equal(completionTime, persisted.CompletedAt);
    }

    [Fact]
    public async Task HandleAsync_ShouldRejectCompletionForNonConfirmedBookings()
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

        var sut = new CompleteBookingService(
            new BookingRepository(db),
            new FixedTimeProvider(new DateTimeOffset(TestData.ToUtc(new DateOnly(2026, 1, 5), new TimeOnly(10, 15)))));

        await Assert.ThrowsAsync<BookingInvalidStateTransitionException>(() => sut.HandleAsync(new CompleteBookingRequest
        {
            BookingId = booking.Id,
            EmpresaId = empresa.Id,
            FinalChargedPrice = 120m
        }));
    }

    [Fact]
    public async Task HandleAsync_ShouldRejectCrossTenantAccess()
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

        var sut = new CompleteBookingService(
            new BookingRepository(db),
            new FixedTimeProvider(new DateTimeOffset(TestData.ToUtc(new DateOnly(2026, 1, 5), new TimeOnly(10, 15)))));

        await Assert.ThrowsAsync<BookingForbiddenException>(() => sut.HandleAsync(new CompleteBookingRequest
        {
            BookingId = booking.Id,
            EmpresaId = otherEmpresa.Id,
            FinalChargedPrice = 120m
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
