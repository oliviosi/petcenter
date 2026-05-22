using Api.Infrastructure.Persistence;
using Api.Modules.Bookings.Domain;
using Api.Modules.Bookings.Infrastructure;
using Api.Modules.Disponibilidade.Domain;
using Api.Modules.Empresas.Domain;
using Api.Modules.ProfessionalServiceAssignments.Domain;
using Api.Modules.Profissionais.Domain;
using Api.Modules.Servicos.Domain;
using Microsoft.EntityFrameworkCore;

namespace Api.Tests.Support;

public static class TestData
{
    public const string DefaultFeedbackAccessToken = "feedback-token-tests";

    public static AppDbContext CreateDbContext(string? databaseName = null)
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName ?? Guid.NewGuid().ToString("N"))
            .Options;

        return new AppDbContext(options);
    }

    public static SeededScenario SeedPublicScenario(
        AppDbContext db,
        DateOnly availabilityDate,
        bool withConfirmedBooking = false)
    {
        var empresa = new Empresa("Pet Center Booking");
        empresa.DefinirSlug("pet-center-booking");
        empresa.DefinirDescricao("Perfil público para testes.");
        empresa.DefinirCidade("São Paulo");
        empresa.DefinirBairro("Centro");
        empresa.DefinirResumoContato("11 99999-0000");
        empresa.DefinirResumoEndereco("Rua das Flores, 100");
        empresa.PublicarNoCatalogo();

        var profissional = new Profissional(empresa.Id, "Dra. Ana", "Banho");
        var servico = new Servico(empresa.Id, "Banho", 30, 50m);
        var assignment = new ProfessionalServiceAssignment(empresa.Id, profissional.Id, servico.Id);
        var availability = new DisponibilidadeProfissional(
            profissional.Id,
            availabilityDate.DayOfWeek,
            new TimeOnly(9, 0),
            new TimeOnly(10, 0));

        db.Empresas.Add(empresa);
        db.Profissionais.Add(profissional);
        db.Servicos.Add(servico);
        db.ProfessionalServiceAssignments.Add(assignment);
        db.DisponibilidadesProfissionais.Add(availability);

        Booking? confirmedBooking = null;
        if (withConfirmedBooking)
        {
            confirmedBooking = new Booking(
                empresa.Id,
                profissional.Id,
                servico.Id,
                Guid.NewGuid(),
                "11 98888-0000",
                "Toto",
                "Cachorro",
                CreateProtectedFeedbackToken(),
                ToUtc(availabilityDate, new TimeOnly(9, 30)),
                ToUtc(availabilityDate, new TimeOnly(10, 0)));
            confirmedBooking.Confirm(ToUtc(availabilityDate, new TimeOnly(8, 0)));
            db.Bookings.Add(confirmedBooking);
        }

        db.SaveChanges();

        return new SeededScenario
        {
            Empresa = empresa,
            Professional = profissional,
            Service = servico,
            Assignment = assignment,
            Availability = availability,
            ConfirmedBooking = confirmedBooking
        };
    }

    public static DateTime ToUtc(DateOnly date, TimeOnly time) =>
        DateTime.SpecifyKind(date.ToDateTime(time), DateTimeKind.Utc);

    public static string CreateProtectedFeedbackToken(string? rawToken = null) =>
        new BookingFeedbackAccessTokenService().ProtectToken(rawToken ?? DefaultFeedbackAccessToken);
}

public class SeededScenario
{
    public Empresa Empresa { get; set; } = null!;
    public Profissional Professional { get; set; } = null!;
    public Servico Service { get; set; } = null!;
    public ProfessionalServiceAssignment Assignment { get; set; } = null!;
    public DisponibilidadeProfissional Availability { get; set; } = null!;
    public Booking? ConfirmedBooking { get; set; }
}
