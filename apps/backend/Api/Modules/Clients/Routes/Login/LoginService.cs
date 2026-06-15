using Api.Modules.Clients.Infrastructure;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Api.Modules.Clients.Routes.Login;

public interface IClientLoginService
{
    Task<LoginResponse> HandleAsync(LoginRequest request);
}

public class LoginService : IClientLoginService
{
    private readonly IClienteRepository _repo;
    private readonly IConfiguration _configuration;

    public LoginService(IClienteRepository repo, IConfiguration configuration)
    {
        _repo = repo;
        _configuration = configuration;
    }

    public async Task<LoginResponse> HandleAsync(LoginRequest request)
    {
        var cliente = await _repo.GetByEmailAsync(request.Email);
        if (cliente is null || !BCrypt.Net.BCrypt.Verify(request.Password, cliente.SenhaHash))
            throw new InvalidOperationException("Credenciais inválidas.");

        var token = GerarToken(cliente);
        return new LoginResponse { Token = token, ClientId = cliente.Id };
    }

    private string GerarToken(Domain.Cliente cliente)
    {
        var key = _configuration["Jwt:Key"] ?? throw new InvalidOperationException("Jwt:Key not configured.");
        var issuer = _configuration["Jwt:Issuer"] ?? throw new InvalidOperationException("Jwt:Issuer not configured.");
        var audience = _configuration["Jwt:Audience"] ?? throw new InvalidOperationException("Jwt:Audience not configured.");
        var expiryMinutes = int.TryParse(_configuration["Jwt:ExpiryMinutes"], out var m) ? m : 60;

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, cliente.Id.ToString()),
            new Claim("role", "client"),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expiryMinutes),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
