using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Api.Modules.Clients.Routes.Login;
using Api.Modules.Clients.Routes.Register;

namespace Api.Modules.Clients.Routes;

public static class ClientsEndpoints
{
    public static WebApplication MapClientsEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/clients").WithTags("Clients").WithOpenApi();

        group.MapPost("/register", async (RegisterRequest request, IClientRegisterService service) =>
        {
            var id = await service.HandleAsync(request);
            return Results.Ok(new { id });
        })
        .WithName("ClientRegister");

        group.MapPost("/login", async (LoginRequest request, IClientLoginService service) =>
        {
            var response = await service.HandleAsync(request);
            return Results.Ok(response);
        })
        .WithName("ClientLogin");

        // Magic link spike endpoints
        group.MapPost("/magic/generate", async (GenerateMagicRequest request, IMagicLinkService magicService) =>
        {
            // For the spike: generate a short-lived magic token for the provided owner contact (email)
            var token = await magicService.GenerateAsync(request.OwnerContact);
            return Results.Ok(new { token });
        })
        .WithName("ClientMagicGenerate");

        group.MapGet("/magic", async (string token, IMagicLinkService magicService, IConfiguration config) =>
        {
            var owner = await magicService.ConsumeAsync(token);
            if (owner is null) return Results.NotFound();

            // Generate a JWT similar to LoginService but with limited claims for the spike
            var key = config["Jwt:Key"] ?? throw new InvalidOperationException("Jwt:Key not configured.");
            var issuer = config["Jwt:Issuer"] ?? "petcenter";
            var audience = config["Jwt:Audience"] ?? "petcenter";
            var expiryMinutes = int.TryParse(config["Jwt:ExpiryMinutes"], out var m) ? m : 60;

            var securityKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(key));
            var credentials = new Microsoft.IdentityModel.Tokens.SigningCredentials(securityKey, Microsoft.IdentityModel.Tokens.SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new System.Security.Claims.Claim("email", owner),
                new System.Security.Claims.Claim("role", "client"),
                new System.Security.Claims.Claim(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var tokenObj = new System.IdentityModel.Tokens.Jwt.JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(expiryMinutes),
                signingCredentials: credentials);

            var tokenString = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler().WriteToken(tokenObj);

            return Results.Ok(new Api.Modules.Clients.Routes.Login.LoginResponse { Token = tokenString, ClientId = Guid.Empty });
        })
        .WithName("ClientMagicConsume");

        return app;
    }
}
