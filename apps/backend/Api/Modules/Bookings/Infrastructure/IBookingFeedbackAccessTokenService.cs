namespace Api.Modules.Bookings.Infrastructure;

public interface IBookingFeedbackAccessTokenService
{
    string GenerateToken();
    string ProtectToken(string rawToken);
    bool VerifyToken(string rawToken, string protectedToken);
}
