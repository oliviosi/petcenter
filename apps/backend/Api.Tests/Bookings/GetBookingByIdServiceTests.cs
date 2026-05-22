using Api.Modules.Bookings.Domain;
using Api.Modules.Bookings.Infrastructure;
using Api.Modules.Bookings.Routes.GetById;
using Api.Modules.Empresas.Domain;
using Api.Modules.Profissionais.Domain;
using Api.Modules.Profissionais.Infrastructure;
using Api.Modules.Servicos.Domain;
using Api.Modules.Servicos.Infrastructure;
using Api.Tests.Support;

namespace Api.Tests.Bookings;

public class GetBookingByIdServiceTests
{
    [Fact]
    public async Task HandleAsync_ShouldReturnOperationalViewForCompletedBooking()
    {
        using var db = TestData.CreateDbContext();

        var empresa = new Empresa("Pet Center Alpha");
        var profissional = new Profissional(empresa.Id, "Dra. Ana", "Banho");
        var servico = new Servico(empresa.Id, "Banho premium", 45, 90m);
        var booking = CreateBooking(empresa.Id, profissional.Id, servico.Id);
        booking.Confirm(TestData.ToUtc(new DateOnly(2026, 1, 5), new TimeOnly(8, 30)));
        booking.Complete(110m, TestData.ToUtc(new DateOnly(2026, 1, 5), new TimeOnly(10, 0)));

        db.Empresas.Add(empresa);
        db.Profissionais.Add(profissional);
        db.Servicos.Add(servico);
        db.Bookings.Add(booking);
        await db.SaveChangesAsync();

        var sut = new GetBookingByIdService(
            new BookingRepository(db),
            new ProfissionalRepository(db),
            new ServicoRepository(db));

        var response = await sut.HandleAsync(booking.Id, empresa.Id);

        Assert.Equal(booking.Id, response.Id);
        Assert.Equal(empresa.Id, response.EmpresaId);
        Assert.Equal(BookingStates.Completed, response.State);
        Assert.Equal("11 98888-0000", response.OwnerContact);
        Assert.Equal("Dra. Ana", response.Professional.Nome);
        Assert.Equal("Banho premium", response.Service.Nome);
        Assert.Equal("Luna", response.Pet.Nome);
        Assert.NotNull(response.Completion);
        Assert.Equal(110m, response.Completion!.FinalChargedPrice);
        Assert.Null(response.Rejection);
    }

    [Fact]
    public async Task HandleAsync_ShouldReturnRejectionDetailsWhenBookingIsRejected()
    {
        using var db = TestData.CreateDbContext();

        var empresa = new Empresa("Pet Center Alpha");
        var profissional = new Profissional(empresa.Id, "Dra. Ana", "Banho");
        var servico = new Servico(empresa.Id, "Banho premium", 45, 90m);
        var booking = CreateBooking(empresa.Id, profissional.Id, servico.Id);
        booking.Reject("Cliente não confirmou presença.", TestData.ToUtc(new DateOnly(2026, 1, 5), new TimeOnly(8, 0)));

        db.Empresas.Add(empresa);
        db.Profissionais.Add(profissional);
        db.Servicos.Add(servico);
        db.Bookings.Add(booking);
        await db.SaveChangesAsync();

        var sut = new GetBookingByIdService(
            new BookingRepository(db),
            new ProfissionalRepository(db),
            new ServicoRepository(db));

        var response = await sut.HandleAsync(booking.Id, empresa.Id);

        Assert.Equal(BookingStates.Rejected, response.State);
        Assert.NotNull(response.Rejection);
        Assert.Equal("Cliente não confirmou presença.", response.Rejection!.Reason);
        Assert.Null(response.Completion);
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

        db.Empresas.AddRange(empresa, otherEmpresa);
        db.Profissionais.Add(profissional);
        db.Servicos.Add(servico);
        db.Bookings.Add(booking);
        await db.SaveChangesAsync();

        var sut = new GetBookingByIdService(
            new BookingRepository(db),
            new ProfissionalRepository(db),
            new ServicoRepository(db));

        await Assert.ThrowsAsync<BookingForbiddenException>(() => sut.HandleAsync(booking.Id, otherEmpresa.Id));
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
