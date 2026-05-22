using Microsoft.AspNetCore.WebUtilities;
using System.Security.Cryptography;

namespace Api.Modules.Bookings.Infrastructure;

public class BookingStatusAccessTokenService : IBookingStatusAccessTokenService
{
    public string GenerateToken() =>
        WebEncoders.Base64UrlEncode(RandomNumberGenerator.GetBytes(32));

    public string ProtectToken(string rawToken)
    {
        if (string.IsNullOrWhiteSpace(rawToken))
            throw new ArgumentException("Token de status é obrigatório.");

        return BCrypt.Net.BCrypt.HashPassword(rawToken.Trim());
    }

    public bool VerifyToken(string rawToken, string protectedToken)
    {
        if (string.IsNullOrWhiteSpace(rawToken) || string.IsNullOrWhiteSpace(protectedToken))
            return false;

        return BCrypt.Net.BCrypt.Verify(rawToken.Trim(), protectedToken);
    }
}
