using Api.Modules.Bookings.Infrastructure;

namespace Api.Tests.Bookings;

public class BookingStatusAccessTokenServiceTests
{
    private readonly BookingStatusAccessTokenService _sut = new();

    [Fact]
    public void VerifyToken_ShouldReturnTrueForMatchingToken()
    {
        var rawToken = _sut.GenerateToken();
        var protectedToken = _sut.ProtectToken(rawToken);

        var result = _sut.VerifyToken(rawToken, protectedToken);

        Assert.True(result);
    }

    [Fact]
    public void VerifyToken_ShouldReturnFalseForDifferentToken()
    {
        var protectedToken = _sut.ProtectToken(_sut.GenerateToken());

        var result = _sut.VerifyToken("token-invalido", protectedToken);

        Assert.False(result);
    }
}
