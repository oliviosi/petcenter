using Api.Modules.Bookings.Domain;
using Api.Modules.Bookings.Infrastructure;
using Api.Modules.Bookings.Routes.GetSlots;
using Api.Modules.Disponibilidade.Infrastructure;
using Api.Modules.Empresas.Infrastructure;
using Api.Modules.ProfessionalServiceAssignments.Infrastructure;
using Api.Modules.Profissionais.Infrastructure;
using Api.Modules.Servicos.Infrastructure;
using Api.Tests.Support;

namespace Api.Tests.Bookings;

public class GetPublicSlotsServiceTests
{
    [Fact]
    public async Task HandleAsync_ShouldGenerateSlotsAndExcludeConfirmedOverlap()
    {
        using var db = TestData.CreateDbContext();
        var availabilityDate = new DateOnly(2026, 1, 5);
        var scenario = TestData.SeedPublicScenario(db, availabilityDate, withConfirmedBooking: true);

        var availabilityService = new BookingAvailabilityService(
            new EmpresaRepository(db),
            new ProfissionalRepository(db),
            new ServicoRepository(db),
            new ProfessionalServiceAssignmentRepository(db),
            new DisponibilidadeRepository(db),
            new BookingRepository(db));

        var service = new GetPublicSlotsService(
            availabilityService,
            new FixedTimeProvider(new DateTimeOffset(TestData.ToUtc(new DateOnly(2026, 1, 1), new TimeOnly(0, 0)))));

        var response = await service.HandleAsync(new GetPublicSlotsRequest
        {
            PetshopId = scenario.Empresa.Id,
            ServiceId = scenario.Service.Id,
            StartDate = availabilityDate,
            EndDate = availabilityDate
        });

        Assert.Single(response);
        Assert.Equal(TestData.ToUtc(availabilityDate, new TimeOnly(9, 0)), response[0].SlotStart);
        Assert.Equal(TestData.ToUtc(availabilityDate, new TimeOnly(9, 30)), response[0].SlotEnd);
    }

    [Fact]
    public async Task HandleAsync_ShouldRejectIntervalsBeyondThirtyDays()
    {
        using var db = TestData.CreateDbContext();
        var availabilityDate = new DateOnly(2026, 1, 5);
        var scenario = TestData.SeedPublicScenario(db, availabilityDate);

        var availabilityService = new BookingAvailabilityService(
            new EmpresaRepository(db),
            new ProfissionalRepository(db),
            new ServicoRepository(db),
            new ProfessionalServiceAssignmentRepository(db),
            new DisponibilidadeRepository(db),
            new BookingRepository(db));

        var service = new GetPublicSlotsService(
            availabilityService,
            new FixedTimeProvider(new DateTimeOffset(TestData.ToUtc(new DateOnly(2026, 1, 1), new TimeOnly(0, 0)))));

        await Assert.ThrowsAsync<PublicSlotsIntervalOutOfRangeException>(() => service.HandleAsync(new GetPublicSlotsRequest
        {
            PetshopId = scenario.Empresa.Id,
            ServiceId = scenario.Service.Id,
            StartDate = new DateOnly(2026, 1, 1),
            EndDate = new DateOnly(2026, 2, 1)
        }));
    }
}
