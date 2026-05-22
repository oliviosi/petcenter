using Api.Modules.Bookings.Domain;
using Api.Modules.Bookings.Infrastructure;
using Api.Modules.Bookings.Routes.Create;
using Api.Modules.Disponibilidade.Infrastructure;
using Api.Modules.Empresas.Infrastructure;
using Api.Modules.ProfessionalServiceAssignments.Infrastructure;
using Api.Modules.Profissionais.Infrastructure;
using Api.Modules.Servicos.Infrastructure;
using Api.Tests.Support;

namespace Api.Tests.Bookings;

public class CreateBookingServiceTests
{
    [Fact]
    public async Task HandleAsync_ShouldPersistRequestedBookingAndPublishEvent()
    {
        using var db = TestData.CreateDbContext();
        var availabilityDate = new DateOnly(2026, 1, 5);
        var scenario = TestData.SeedPublicScenario(db, availabilityDate);
        var publisher = new FakeBookingEventPublisher();

        var service = new CreateBookingService(
            new EmpresaRepository(db),
            new ProfissionalRepository(db),
            new ServicoRepository(db),
            new BookingAvailabilityService(
                new EmpresaRepository(db),
                new ProfissionalRepository(db),
                new ServicoRepository(db),
                new ProfessionalServiceAssignmentRepository(db),
                new DisponibilidadeRepository(db),
                new BookingRepository(db)),
            new BookingRepository(db),
            publisher);

        var response = await service.HandleAsync(new CreateBookingRequest
        {
            PetshopId = scenario.Empresa.Id,
            ProfessionalId = scenario.Professional.Id,
            ServiceId = scenario.Service.Id,
            SlotStart = TestData.ToUtc(availabilityDate, new TimeOnly(9, 0)),
            SlotEnd = TestData.ToUtc(availabilityDate, new TimeOnly(9, 30)),
            OwnerContact = "11 97777-0000",
            PetName = "Nina",
            PetSpecies = "Gato"
        });

        Assert.Equal(BookingStates.Requested, response.State);
        Assert.Single(publisher.PublishedMessages);
        Assert.Equal(response.Id, publisher.PublishedMessages[0].BookingId);
    }

    [Fact]
    public async Task HandleAsync_ShouldRejectUnavailableSlots()
    {
        using var db = TestData.CreateDbContext();
        var availabilityDate = new DateOnly(2026, 1, 5);
        var scenario = TestData.SeedPublicScenario(db, availabilityDate);

        var service = new CreateBookingService(
            new EmpresaRepository(db),
            new ProfissionalRepository(db),
            new ServicoRepository(db),
            new BookingAvailabilityService(
                new EmpresaRepository(db),
                new ProfissionalRepository(db),
                new ServicoRepository(db),
                new ProfessionalServiceAssignmentRepository(db),
                new DisponibilidadeRepository(db),
                new BookingRepository(db)),
            new BookingRepository(db),
            new FakeBookingEventPublisher());

        await Assert.ThrowsAsync<BookingSlotUnavailableException>(() => service.HandleAsync(new CreateBookingRequest
        {
            PetshopId = scenario.Empresa.Id,
            ProfessionalId = scenario.Professional.Id,
            ServiceId = scenario.Service.Id,
            SlotStart = TestData.ToUtc(availabilityDate, new TimeOnly(9, 15)),
            SlotEnd = TestData.ToUtc(availabilityDate, new TimeOnly(9, 45)),
            OwnerContact = "11 97777-0000",
            PetName = "Nina",
            PetSpecies = "Gato"
        }));
    }
}
