using Api.Infrastructure.Persistence;
using Api.Modules.Bookings.Domain;
using Api.Modules.Bookings.Infrastructure;
using Api.Modules.Bookings.Routes.SubmitFeedback;
using Api.Modules.Empresas.Domain;
using Api.Modules.Profissionais.Domain;
using Api.Modules.Servicos.Domain;
using Api.Tests.Support;
using Microsoft.EntityFrameworkCore;

namespace Api.Tests.Bookings;

public class SubmitBookingFeedbackServiceTests
{
    [Fact]
    public async Task HandleAsync_ShouldPersistFeedbackAndMarkBookingAsSubmitted()
    {
        using var db = TestData.CreateDbContext();
        var booking = SeedCompletedBooking(db, TestData.DefaultFeedbackAccessToken);
        var submittedAt = TestData.ToUtc(new DateOnly(2026, 1, 6), new TimeOnly(12, 0));
        var sut = new SubmitBookingFeedbackService(
            new BookingRepository(db),
            new BookingFeedbackAccessTokenService(),
            new FixedTimeProvider(new DateTimeOffset(submittedAt)));

        var response = await sut.HandleAsync(new SubmitBookingFeedbackRequest
        {
            BookingId = booking.Id,
            FeedbackAccessToken = TestData.DefaultFeedbackAccessToken,
            ProfessionalRating = 5,
            PetshopRating = 4,
            Comment = "Atendimento excelente."
        });

        Assert.Equal(booking.Id, response.BookingId);
        Assert.Equal(5, response.ProfessionalRating);
        Assert.Equal(4, response.PetshopRating);
        Assert.Equal("Atendimento excelente.", response.Comment);
        Assert.Equal(submittedAt, response.SubmittedAt);

        var persistedBooking = await db.Bookings.FindAsync(booking.Id);
        Assert.NotNull(persistedBooking);
        Assert.Equal(submittedAt, persistedBooking!.FeedbackSubmittedAt);

        var persistedFeedback = await db.BookingFeedbacks.SingleAsync(feedback => feedback.BookingId == booking.Id);
        Assert.Equal(5, persistedFeedback.ProfessionalRating);
        Assert.Equal(4, persistedFeedback.PetshopRating);
        Assert.Equal("Atendimento excelente.", persistedFeedback.Comment);
    }

    [Fact]
    public async Task HandleAsync_ShouldRejectDuplicateSubmission()
    {
        using var db = TestData.CreateDbContext();
        var booking = SeedCompletedBooking(db, TestData.DefaultFeedbackAccessToken);
        booking.RegistrarFeedbackEnviado(TestData.ToUtc(new DateOnly(2026, 1, 6), new TimeOnly(12, 0)));
        db.BookingFeedbacks.Add(new BookingFeedback(
            booking.Id,
            booking.EmpresaId,
            booking.ProfessionalId,
            5,
            5,
            "Primeiro envio",
            booking.FeedbackSubmittedAt!.Value));
        await db.SaveChangesAsync();

        var sut = new SubmitBookingFeedbackService(
            new BookingRepository(db),
            new BookingFeedbackAccessTokenService(),
            new FixedTimeProvider(new DateTimeOffset(TestData.ToUtc(new DateOnly(2026, 1, 6), new TimeOnly(13, 0)))));

        await Assert.ThrowsAsync<BookingFeedbackNotEligibleException>(() => sut.HandleAsync(new SubmitBookingFeedbackRequest
        {
            BookingId = booking.Id,
            FeedbackAccessToken = TestData.DefaultFeedbackAccessToken,
            ProfessionalRating = 4,
            PetshopRating = 4
        }));
    }

    [Fact]
    public async Task HandleAsync_ShouldRejectWhenBookingIsNotCompleted()
    {
        using var db = TestData.CreateDbContext();
        var booking = SeedRequestedBooking(db, TestData.DefaultFeedbackAccessToken);
        var sut = new SubmitBookingFeedbackService(
            new BookingRepository(db),
            new BookingFeedbackAccessTokenService(),
            TimeProvider.System);

        await Assert.ThrowsAsync<BookingFeedbackNotEligibleException>(() => sut.HandleAsync(new SubmitBookingFeedbackRequest
        {
            BookingId = booking.Id,
            FeedbackAccessToken = TestData.DefaultFeedbackAccessToken,
            ProfessionalRating = 4,
            PetshopRating = 4
        }));
    }

    [Fact]
    public async Task HandleAsync_ShouldRejectInvalidToken()
    {
        using var db = TestData.CreateDbContext();
        var booking = SeedCompletedBooking(db, TestData.DefaultFeedbackAccessToken);
        var sut = new SubmitBookingFeedbackService(
            new BookingRepository(db),
            new BookingFeedbackAccessTokenService(),
            TimeProvider.System);

        await Assert.ThrowsAsync<BookingFeedbackTokenInvalidException>(() => sut.HandleAsync(new SubmitBookingFeedbackRequest
        {
            BookingId = booking.Id,
            FeedbackAccessToken = "token-invalido",
            ProfessionalRating = 4,
            PetshopRating = 4
        }));
    }

    private static Booking SeedRequestedBooking(AppDbContext db, string rawToken)
    {
        var empresa = new Empresa("Pet Center Feedback");
        var profissional = new Profissional(empresa.Id, "Dra. Ana", "Banho");
        var servico = new Servico(empresa.Id, "Banho", 30, 50m);
        var booking = new Booking(
            empresa.Id,
            profissional.Id,
            servico.Id,
            Guid.NewGuid(),
            "11 97777-0000",
            "Nina",
            "Gato",
            TestData.CreateProtectedFeedbackToken(rawToken),
            TestData.ToUtc(new DateOnly(2026, 1, 5), new TimeOnly(9, 0)),
            TestData.ToUtc(new DateOnly(2026, 1, 5), new TimeOnly(9, 30)));

        db.Empresas.Add(empresa);
        db.Profissionais.Add(profissional);
        db.Servicos.Add(servico);
        db.Bookings.Add(booking);
        db.SaveChanges();
        return booking;
    }

    private static Booking SeedCompletedBooking(AppDbContext db, string rawToken)
    {
        var booking = SeedRequestedBooking(db, rawToken);
        booking.Confirm(TestData.ToUtc(new DateOnly(2026, 1, 5), new TimeOnly(8, 0)));
        booking.Complete(60m, TestData.ToUtc(new DateOnly(2026, 1, 5), new TimeOnly(10, 0)));
        db.SaveChanges();
        return booking;
    }
}
