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
        var statusTokenService = new BookingStatusAccessTokenService();
        var feedbackTokenService = new BookingFeedbackAccessTokenService();

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
            publisher,
            statusTokenService,
            feedbackTokenService);

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
        Assert.False(string.IsNullOrWhiteSpace(response.BookingStatusAccessToken));
        Assert.False(string.IsNullOrWhiteSpace(response.FeedbackAccessToken));
        Assert.NotEqual(response.BookingStatusAccessToken, response.FeedbackAccessToken);
        Assert.Single(publisher.PublishedMessages);
        Assert.Equal(response.Id, publisher.PublishedMessages[0].BookingId);

        var persisted = await db.Bookings.FindAsync(response.Id);
        Assert.NotNull(persisted);
        Assert.NotEqual(response.BookingStatusAccessToken, persisted!.BookingStatusAccessTokenHash);
        Assert.NotEqual(response.FeedbackAccessToken, persisted.FeedbackAccessTokenHash);
        Assert.True(statusTokenService.VerifyToken(response.BookingStatusAccessToken, persisted.BookingStatusAccessTokenHash));
        Assert.True(feedbackTokenService.VerifyToken(response.FeedbackAccessToken, persisted.FeedbackAccessTokenHash));
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
            new FakeBookingEventPublisher(),
            new BookingStatusAccessTokenService(),
            new BookingFeedbackAccessTokenService());

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

    [Fact]
    public async Task HandleAsync_ShouldSurfacePublishFailuresAfterPersistingBooking()
    {
        using var db = TestData.CreateDbContext();
        var availabilityDate = new DateOnly(2026, 1, 5);
        var scenario = TestData.SeedPublicScenario(db, availabilityDate);
        var publisher = new FakeBookingEventPublisher
        {
            ExceptionToThrow = new InvalidOperationException("RabbitMQ indisponível.")
        };

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
            publisher,
            new BookingStatusAccessTokenService(),
            new BookingFeedbackAccessTokenService());

        var exception = await Assert.ThrowsAsync<InvalidOperationException>(() => service.HandleAsync(new CreateBookingRequest
        {
            PetshopId = scenario.Empresa.Id,
            ProfessionalId = scenario.Professional.Id,
            ServiceId = scenario.Service.Id,
            SlotStart = TestData.ToUtc(availabilityDate, new TimeOnly(9, 0)),
            SlotEnd = TestData.ToUtc(availabilityDate, new TimeOnly(9, 30)),
            OwnerContact = "11 97777-0000",
            PetName = "Nina",
            PetSpecies = "Gato"
        }));

        Assert.Equal("RabbitMQ indisponível.", exception.Message);
        Assert.Empty(publisher.PublishedMessages);

        var persisted = Assert.Single(db.Bookings);
        Assert.Equal(BookingStates.Requested, persisted.State);
    }
}
