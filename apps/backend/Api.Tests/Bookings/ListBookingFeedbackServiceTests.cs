using Api.Modules.Bookings.Domain;
using Api.Modules.Bookings.Infrastructure;
using Api.Modules.Bookings.Routes.ListFeedback;
using Api.Modules.Empresas.Domain;
using Api.Modules.Profissionais.Domain;
using Api.Modules.Profissionais.Infrastructure;
using Api.Tests.Support;

namespace Api.Tests.Bookings;

public class ListBookingFeedbackServiceTests
{
    [Fact]
    public async Task HandleAsync_ShouldFilterFeedbackEntriesWithinTenantScope()
    {
        using var db = TestData.CreateDbContext();

        var empresa = new Empresa("Pet Center Alpha");
        var otherEmpresa = new Empresa("Pet Center Beta");
        var professional = new Profissional(empresa.Id, "Dra. Ana", "Banho");
        var otherProfessional = new Profissional(empresa.Id, "Dr. Beto", "Tosa");
        var otherTenantProfessional = new Profissional(otherEmpresa.Id, "Dra. Carol", "Consulta");

        db.Empresas.AddRange(empresa, otherEmpresa);
        db.Profissionais.AddRange(professional, otherProfessional, otherTenantProfessional);
        db.BookingFeedbacks.AddRange(
            new BookingFeedback(Guid.Parse("00000000-0000-0000-0000-000000000001"), empresa.Id, professional.Id, 5, 4, "Primeiro.", TestData.ToUtc(new DateOnly(2026, 1, 5), new TimeOnly(10, 0))),
            new BookingFeedback(Guid.Parse("00000000-0000-0000-0000-000000000002"), empresa.Id, professional.Id, 4, 5, "Segundo.", TestData.ToUtc(new DateOnly(2026, 1, 6), new TimeOnly(11, 0))),
            new BookingFeedback(Guid.Parse("00000000-0000-0000-0000-000000000003"), empresa.Id, otherProfessional.Id, 2, 3, null, TestData.ToUtc(new DateOnly(2026, 1, 7), new TimeOnly(12, 0))),
            new BookingFeedback(Guid.Parse("00000000-0000-0000-0000-000000000004"), otherEmpresa.Id, otherTenantProfessional.Id, 1, 1, "Outro tenant.", TestData.ToUtc(new DateOnly(2026, 1, 6), new TimeOnly(13, 0))));
        await db.SaveChangesAsync();

        var sut = new ListBookingFeedbackService(
            new BookingRepository(db),
            new ProfissionalRepository(db));

        var response = await sut.HandleAsync(empresa.Id, new ListBookingFeedbackRequest
        {
            StartDate = new DateOnly(2026, 1, 5),
            EndDate = new DateOnly(2026, 1, 6),
            ProfessionalId = professional.Id
        });

        Assert.Equal(2, response.Count);
        Assert.All(response, item => Assert.Equal(professional.Id, item.Professional.Id));
        Assert.Equal(Guid.Parse("00000000-0000-0000-0000-000000000002"), response[0].BookingId);
        Assert.Equal(Guid.Parse("00000000-0000-0000-0000-000000000001"), response[1].BookingId);
        Assert.Equal("Dra. Ana", response[0].Professional.Nome);
        Assert.Equal("Banho", response[0].Professional.Especialidade);
        Assert.Equal("Segundo.", response[0].Comment);
    }

    [Fact]
    public async Task HandleAsync_ShouldRejectProfessionalFromAnotherTenant()
    {
        using var db = TestData.CreateDbContext();

        var empresa = new Empresa("Pet Center Alpha");
        var otherEmpresa = new Empresa("Pet Center Beta");
        var professional = new Profissional(empresa.Id, "Dra. Ana", "Banho");
        var otherTenantProfessional = new Profissional(otherEmpresa.Id, "Dra. Carol", "Consulta");

        db.Empresas.AddRange(empresa, otherEmpresa);
        db.Profissionais.AddRange(professional, otherTenantProfessional);
        await db.SaveChangesAsync();

        var sut = new ListBookingFeedbackService(
            new BookingRepository(db),
            new ProfissionalRepository(db));

        await Assert.ThrowsAsync<ProfissionalNotFoundException>(() => sut.HandleAsync(empresa.Id, new ListBookingFeedbackRequest
        {
            ProfessionalId = otherTenantProfessional.Id
        }));
    }
}
