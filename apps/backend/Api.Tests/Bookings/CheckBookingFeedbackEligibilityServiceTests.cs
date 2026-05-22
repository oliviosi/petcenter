using Api.Infrastructure.Persistence;
using Api.Modules.Bookings.Domain;
using Api.Modules.Bookings.Infrastructure;
using Api.Modules.Bookings.Routes.CheckFeedbackEligibility;
using Api.Modules.Empresas.Domain;
using Api.Modules.Profissionais.Domain;
using Api.Modules.Servicos.Domain;
using Api.Tests.Support;

namespace Api.Tests.Bookings;

public class CheckBookingFeedbackEligibilityServiceTests
{
    [Fact]
    public async Task HandleAsync_ShouldAllowCompletedBookingWithValidToken()
    {
        using var db = TestData.CreateDbContext();
        var booking = SeedCompletedBooking(db, TestData.DefaultFeedbackAccessToken);
        var sut = new CheckBookingFeedbackEligibilityService(
            new BookingRepository(db),
            new BookingFeedbackAccessTokenService());

        var response = await sut.HandleAsync(new CheckBookingFeedbackEligibilityRequest
        {
            BookingId = booking.Id,
            FeedbackAccessToken = TestData.DefaultFeedbackAccessToken
        });

        Assert.True(response.CanSubmit);
        Assert.Null(response.Reason);
    }

    [Fact]
    public async Task HandleAsync_ShouldReturnFalseWhenBookingIsNotCompleted()
    {
        using var db = TestData.CreateDbContext();
        var booking = SeedRequestedBooking(db, TestData.DefaultFeedbackAccessToken);
        var sut = new CheckBookingFeedbackEligibilityService(
            new BookingRepository(db),
            new BookingFeedbackAccessTokenService());

        var response = await sut.HandleAsync(new CheckBookingFeedbackEligibilityRequest
        {
            BookingId = booking.Id,
            FeedbackAccessToken = TestData.DefaultFeedbackAccessToken
        });

        Assert.False(response.CanSubmit);
        Assert.Equal("A reserva ainda não foi concluída.", response.Reason);
    }

    [Fact]
    public async Task HandleAsync_ShouldRejectInvalidToken()
    {
        using var db = TestData.CreateDbContext();
        var booking = SeedCompletedBooking(db, TestData.DefaultFeedbackAccessToken);
        var sut = new CheckBookingFeedbackEligibilityService(
            new BookingRepository(db),
            new BookingFeedbackAccessTokenService());

        await Assert.ThrowsAsync<BookingFeedbackTokenInvalidException>(() => sut.HandleAsync(new CheckBookingFeedbackEligibilityRequest
        {
            BookingId = booking.Id,
            FeedbackAccessToken = "token-invalido"
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
