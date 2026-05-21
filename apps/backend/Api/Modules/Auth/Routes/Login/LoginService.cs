using Api.Modules.Usuarios.Domain;
using Api.Modules.Usuarios.Infrastructure;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Api.Modules.Auth.Routes.Login;

public class LoginService : ILoginService
{
    private readonly IUsuarioRepository _usuarioRepo;
    private readonly IConfiguration _configuration;

    public LoginService(IUsuarioRepository usuarioRepo, IConfiguration configuration)
    {
        _usuarioRepo = usuarioRepo;
        _configuration = configuration;
    }

    public async Task<LoginResponse> HandleAsync(LoginRequest request)
    {
        var usuario = await _usuarioRepo.GetByEmailAsync(request.Email);
        if (usuario is null || !BCrypt.Net.BCrypt.Verify(request.Password, usuario.SenhaHash))
            throw new CredenciaisInvalidasException();

        var token = GerarToken(usuario);
        return new LoginResponse
        {
            Token = token,
            UserId = usuario.Id,
            EmpresaId = usuario.EmpresaId
        };
    }

    private string GerarToken(Usuario usuario)
    {
        var key = _configuration["Jwt:Key"]
            ?? throw new InvalidOperationException("Jwt:Key not configured.");
        var issuer = _configuration["Jwt:Issuer"]
            ?? throw new InvalidOperationException("Jwt:Issuer not configured.");
        var audience = _configuration["Jwt:Audience"]
            ?? throw new InvalidOperationException("Jwt:Audience not configured.");
        var expiryMinutes = int.TryParse(_configuration["Jwt:ExpiryMinutes"], out var m) ? m : 60;

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, usuario.Id.ToString()),
            new Claim("empresa_id", usuario.EmpresaId.ToString()),
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
