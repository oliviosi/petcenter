using Api.Modules.Bookings.Domain;
using Api.Modules.Bookings.Infrastructure;
using Api.Modules.Bookings.Routes.List;
using Api.Modules.Empresas.Domain;
using Api.Modules.Profissionais.Domain;
using Api.Modules.Profissionais.Infrastructure;
using Api.Modules.Servicos.Domain;
using Api.Modules.Servicos.Infrastructure;
using Api.Tests.Support;

namespace Api.Tests.Bookings;

public class ListBookingsServiceTests
{
    [Fact]
    public async Task HandleAsync_ShouldFilterTenantBookingsByDateStateAndProfessional()
    {
        using var db = TestData.CreateDbContext();

        var empresa = new Empresa("Pet Center Alpha");
        var otherEmpresa = new Empresa("Pet Center Beta");
        var professional = new Profissional(empresa.Id, "Dra. Ana", "Banho");
        var otherProfessional = new Profissional(empresa.Id, "Dr. Beto", "Tosa");
        var otherTenantProfessional = new Profissional(otherEmpresa.Id, "Dra. Carol", "Banho");
        var service = new Servico(empresa.Id, "Banho", 30, 50m);
        var otherTenantService = new Servico(otherEmpresa.Id, "Banho", 30, 55m);

        var requestedBooking = CreateBooking(
            empresa.Id,
            professional.Id,
            service.Id,
            new DateOnly(2026, 1, 4),
            new TimeOnly(9, 0));

        var completedBooking = CreateBooking(
            empresa.Id,
            otherProfessional.Id,
            service.Id,
            new DateOnly(2026, 1, 5),
            new TimeOnly(10, 0));
        completedBooking.Confirm(TestData.ToUtc(new DateOnly(2026, 1, 5), new TimeOnly(9, 30)));
        completedBooking.Complete(75m, TestData.ToUtc(new DateOnly(2026, 1, 5), new TimeOnly(11, 0)));

        var rejectedBooking = CreateBooking(
            empresa.Id,
            professional.Id,
            service.Id,
            new DateOnly(2026, 1, 5),
            new TimeOnly(12, 0));
        rejectedBooking.Reject("Profissional indisponível.", TestData.ToUtc(new DateOnly(2026, 1, 5), new TimeOnly(11, 30)));

        var otherTenantBooking = CreateBooking(
            otherEmpresa.Id,
            otherTenantProfessional.Id,
            otherTenantService.Id,
            new DateOnly(2026, 1, 5),
            new TimeOnly(10, 0));
        otherTenantBooking.Confirm(TestData.ToUtc(new DateOnly(2026, 1, 5), new TimeOnly(9, 0)));

        db.Empresas.AddRange(empresa, otherEmpresa);
        db.Profissionais.AddRange(professional, otherProfessional, otherTenantProfessional);
        db.Servicos.AddRange(service, otherTenantService);
        db.Bookings.AddRange(requestedBooking, completedBooking, rejectedBooking, otherTenantBooking);
        await db.SaveChangesAsync();

        var sut = new ListBookingsService(
            new BookingRepository(db),
            new ProfissionalRepository(db),
            new ServicoRepository(db));

        var response = await sut.HandleAsync(new ListBookingsRequest
        {
            EmpresaId = empresa.Id,
            StartDate = new DateOnly(2026, 1, 5),
            EndDate = new DateOnly(2026, 1, 5),
            State = BookingStates.Completed,
            ProfessionalId = otherProfessional.Id
        });

        var item = Assert.Single(response);
        Assert.Equal(completedBooking.Id, item.Id);
        Assert.Equal(BookingStates.Completed, item.State);
        Assert.Equal(otherProfessional.Id, item.Professional.Id);
        Assert.Equal("Dr. Beto", item.Professional.Nome);
        Assert.Equal("Banho", item.Service.Nome);
        Assert.Equal("Nina", item.Pet.Nome);
        Assert.NotNull(item.Completion);
        Assert.Equal(75m, item.Completion!.FinalChargedPrice);
    }

    private static Booking CreateBooking(
        Guid empresaId,
        Guid professionalId,
        Guid serviceId,
        DateOnly date,
        TimeOnly startTime) =>
        new(
            empresaId,
            professionalId,
            serviceId,
            Guid.NewGuid(),
            "11 99999-0000",
            "Nina",
            "Cachorro",
            TestData.ToUtc(date, startTime),
            TestData.ToUtc(date, startTime.AddMinutes(30)));
}
