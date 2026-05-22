namespace Api.Modules.Bookings.Infrastructure;

public interface IBookingStatusAccessTokenService
{
    string GenerateToken();
    string ProtectToken(string rawToken);
    bool VerifyToken(string rawToken, string protectedToken);
}
