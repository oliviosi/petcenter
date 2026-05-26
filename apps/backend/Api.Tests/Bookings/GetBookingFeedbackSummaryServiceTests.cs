using Api.Modules.Bookings.Domain;
using Api.Modules.Bookings.Infrastructure;
using Api.Modules.Bookings.Routes.GetFeedbackSummary;
using Api.Modules.Empresas.Domain;
using Api.Modules.Profissionais.Domain;
using Api.Modules.Profissionais.Infrastructure;
using Api.Tests.Support;

namespace Api.Tests.Bookings;

public class GetBookingFeedbackSummaryServiceTests
{
    [Fact]
    public async Task HandleAsync_ShouldAggregateOnlyAuthenticatedTenantFeedback()
    {
        using var db = TestData.CreateDbContext();

        var empresa = new Empresa("Pet Center Alpha");
        var otherEmpresa = new Empresa("Pet Center Beta");
        var firstProfessional = new Profissional(empresa.Id, "Dra. Ana", "Banho");
        var secondProfessional = new Profissional(empresa.Id, "Dr. Beto", "Tosa");
        var otherTenantProfessional = new Profissional(otherEmpresa.Id, "Dra. Carol", "Consulta");

        db.Empresas.AddRange(empresa, otherEmpresa);
        db.Profissionais.AddRange(firstProfessional, secondProfessional, otherTenantProfessional);
        db.BookingFeedbacks.AddRange(
            new BookingFeedback(Guid.NewGuid(), empresa.Id, firstProfessional.Id, 5, 4, "Ótimo.", TestData.ToUtc(new DateOnly(2026, 1, 5), new TimeOnly(10, 0))),
            new BookingFeedback(Guid.NewGuid(), empresa.Id, firstProfessional.Id, 3, 5, "Bom.", TestData.ToUtc(new DateOnly(2026, 1, 6), new TimeOnly(11, 0))),
            new BookingFeedback(Guid.NewGuid(), empresa.Id, secondProfessional.Id, 4, 2, null, TestData.ToUtc(new DateOnly(2026, 1, 7), new TimeOnly(12, 0))),
            new BookingFeedback(Guid.NewGuid(), otherEmpresa.Id, otherTenantProfessional.Id, 1, 1, "Outro tenant.", TestData.ToUtc(new DateOnly(2026, 1, 8), new TimeOnly(13, 0))));
        await db.SaveChangesAsync();

        var sut = new GetBookingFeedbackSummaryService(
            new BookingRepository(db),
            new ProfissionalRepository(db));

        var response = await sut.HandleAsync(empresa.Id);

        Assert.True(response.Petshop.IsRated);
        Assert.Equal(3, response.Petshop.FeedbackCount);
        Assert.Equal(3.67m, response.Petshop.AverageRating);

        Assert.Equal(2, response.Professionals.Count);

        var firstProfessionalSummary = Assert.Single(response.Professionals, item => item.ProfessionalId == firstProfessional.Id);
        Assert.Equal("Dra. Ana", firstProfessionalSummary.Nome);
        Assert.Equal("Banho", firstProfessionalSummary.Especialidade);
        Assert.Equal(2, firstProfessionalSummary.FeedbackCount);
        Assert.Equal(4.00m, firstProfessionalSummary.AverageRating);

        var secondProfessionalSummary = Assert.Single(response.Professionals, item => item.ProfessionalId == secondProfessional.Id);
        Assert.Equal("Dr. Beto", secondProfessionalSummary.Nome);
        Assert.Equal(1, secondProfessionalSummary.FeedbackCount);
        Assert.Equal(4.00m, secondProfessionalSummary.AverageRating);
    }

    [Fact]
    public async Task HandleAsync_ShouldReturnExplicitUnratedSummaryWhenTenantHasNoFeedback()
    {
        using var db = TestData.CreateDbContext();

        var empresa = new Empresa("Pet Center Alpha");
        var professional = new Profissional(empresa.Id, "Dra. Ana", "Banho");

        db.Empresas.Add(empresa);
        db.Profissionais.Add(professional);
        await db.SaveChangesAsync();

        var sut = new GetBookingFeedbackSummaryService(
            new BookingRepository(db),
            new ProfissionalRepository(db));

        var response = await sut.HandleAsync(empresa.Id);

        Assert.False(response.Petshop.IsRated);
        Assert.Equal(0, response.Petshop.FeedbackCount);
        Assert.Null(response.Petshop.AverageRating);
        Assert.Empty(response.Professionals);
    }
}
