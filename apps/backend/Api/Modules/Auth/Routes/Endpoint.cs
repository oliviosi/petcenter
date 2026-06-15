using Api.Exceptions;
using Api.Modules.Auth.Routes.Login;
using Api.Modules.Auth.Routes.Me;
using FluentValidation;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Api.Modules.Auth.Routes;

public static class AuthEndpoints
{
    public static WebApplication MapAuthEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/auth").WithTags("Auth");

        group.MapPost("/login", async (
            LoginRequest request,
            IValidator<LoginRequest> validator,
            ILoginService service) =>
        {
            var validation = await validator.ValidateAsync(request);
            if (!validation.IsValid)
                return Results.ValidationProblem(validation.ToDictionary());

            var response = await service.HandleAsync(request);
            return Results.Ok(response);
        })
        .WithName("Login");

        group.MapGet("/me", async (
            HttpContext httpContext,
            IGetMeService service) =>
        {
            var subClaim = httpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            if (!Guid.TryParse(subClaim, out var userId))
                throw new UnauthorizedException("Token inválido.");

            var empresaIdClaim = httpContext.User.FindFirstValue("empresa_id");
            if (!Guid.TryParse(empresaIdClaim, out var empresaId))
                throw new UnauthorizedException("Token inválido.");

            var request = new GetMeRequest { UserId = userId, EmpresaId = empresaId };
            var response = await service.HandleAsync(request);
            return Results.Ok(response);
        })
        .WithName("GetMe")
        .RequireAuthorization();

        // External OAuth start (Google)
        group.MapGet("/external/google", (IConfiguration configuration) =>
        {
            var clientId = configuration["Google:ClientId"];
            var redirectUri = configuration["Google:RedirectUri"];

            if (string.IsNullOrWhiteSpace(clientId) || string.IsNullOrWhiteSpace(redirectUri))
            {
                return Results.BadRequest(new { title = "Google OAuth não está configurado." });
            }

            var state = Guid.NewGuid().ToString();
            var url = $"https://accounts.google.com/o/oauth2/v2/auth?client_id={Uri.EscapeDataString(clientId)}&redirect_uri={Uri.EscapeDataString(redirectUri)}&response_type=code&scope=openid%20email%20profile&access_type=online&state={Uri.EscapeDataString(state)}";

            return Results.Redirect(url);
        })
        .WithName("AuthExternalGoogle");

        // External OAuth callback (Google)
        group.MapGet("/external/google/callback", async (HttpRequest httpRequest, IConfiguration configuration, IHttpClientFactory httpClientFactory, Api.Modules.Clients.Infrastructure.IClienteRepository clienteRepo) =>
        {
            var query = httpRequest.Query;
            var code = query["code"].ToString();
            var state = query["state"].ToString();

            if (string.IsNullOrWhiteSpace(code))
                return Results.BadRequest(new { title = "Código OAuth ausente." });

            var clientId = configuration["Google:ClientId"];
            var clientSecret = configuration["Google:ClientSecret"];
            var redirectUri = configuration["Google:RedirectUri"];

            if (string.IsNullOrWhiteSpace(clientId) || string.IsNullOrWhiteSpace(clientSecret) || string.IsNullOrWhiteSpace(redirectUri))
                return Results.BadRequest(new { title = "Google OAuth não está completamente configurado." });

            var http = httpClientFactory.CreateClient();

            var tokenRequest = new Dictionary<string, string>
            {
                ["code"] = code,
                ["client_id"] = clientId,
                ["client_secret"] = clientSecret,
                ["redirect_uri"] = redirectUri,
                ["grant_type"] = "authorization_code"
            };

            var tokenResponse = await http.PostAsync("https://oauth2.googleapis.com/token", new FormUrlEncodedContent(tokenRequest));
            if (!tokenResponse.IsSuccessStatusCode)
            {
                return Results.BadRequest(new { title = "Falha ao trocar code por token no Google." });
            }

            var tokenJson = await tokenResponse.Content.ReadAsStringAsync();
            using var doc = System.Text.Json.JsonDocument.Parse(tokenJson);
            var root = doc.RootElement;

            string? accessToken = root.TryGetProperty("access_token", out var at) ? at.GetString() : null;
            string? idToken = root.TryGetProperty("id_token", out var it) ? it.GetString() : null;

            string email = null!;
            string name = null!;

            if (!string.IsNullOrWhiteSpace(accessToken))
            {
                var userInfoReq = new System.Net.Http.HttpRequestMessage(System.Net.Http.HttpMethod.Get, "https://www.googleapis.com/oauth2/v3/userinfo");
                userInfoReq.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);
                var userInfoRes = await http.SendAsync(userInfoReq);
                if (!userInfoRes.IsSuccessStatusCode)
                    return Results.BadRequest(new { title = "Falha ao obter perfil do Google." });

                var userJson = await userInfoRes.Content.ReadAsStringAsync();
                using var userDoc = System.Text.Json.JsonDocument.Parse(userJson);
                var userRoot = userDoc.RootElement;
                email = userRoot.GetProperty("email").GetString();
                name = userRoot.TryGetProperty("name", out var nm) ? nm.GetString() : string.Empty;
            }
            else if (!string.IsNullOrWhiteSpace(idToken))
            {
                // decode id_token claims without validation (we trust Google here for simplicity)
                var handler = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler();
                var jwt = handler.ReadJwtToken(idToken);
                email = jwt.Claims.FirstOrDefault(c => c.Type == "email")?.Value;
                name = jwt.Claims.FirstOrDefault(c => c.Type == "name")?.Value ?? string.Empty;
            }
            else
            {
                return Results.BadRequest(new { title = "Nenhum token recebido do Google." });
            }

            if (string.IsNullOrWhiteSpace(email))
                return Results.BadRequest(new { title = "Email não disponível no perfil do Google." });

            // find or create client
            var existing = await clienteRepo.GetByEmailAsync(email);
            Api.Modules.Clients.Domain.Cliente cliente;
            if (existing is not null)
            {
                cliente = existing;
            }
            else
            {
                // create a random password hash for OAuth users
                var randomPassword = Guid.NewGuid().ToString();
                var hash = BCrypt.Net.BCrypt.HashPassword(randomPassword);
                cliente = new Api.Modules.Clients.Domain.Cliente(email, hash, name ?? string.Empty);
                await clienteRepo.AddAsync(cliente);
            }

            // generate JWT for cliente (mirror LoginService.GerarToken)
            var key = configuration["Jwt:Key"] ?? throw new InvalidOperationException("Jwt:Key not configured.");
            var issuer = configuration["Jwt:Issuer"] ?? throw new InvalidOperationException("Jwt:Issuer not configured.");
            var audience = configuration["Jwt:Audience"] ?? throw new InvalidOperationException("Jwt:Audience not configured.");
            var expiryMinutes = int.TryParse(configuration["Jwt:ExpiryMinutes"], out var m) ? m : 60;

            var securityKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(key));
            var credentials = new Microsoft.IdentityModel.Tokens.SigningCredentials(securityKey, Microsoft.IdentityModel.Tokens.SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new System.Security.Claims.Claim(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub, cliente.Id.ToString()),
                new System.Security.Claims.Claim("role", "client"),
                new System.Security.Claims.Claim(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new System.IdentityModel.Tokens.Jwt.JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(expiryMinutes),
                signingCredentials: credentials);

            var tokenString = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler().WriteToken(token);

            // redirect back to frontend with token as query param; use configured frontend base if available
            var frontendBase = configuration["Frontend:BaseUrl"];
            var redirectTarget = string.IsNullOrWhiteSpace(frontendBase)
                ? $"/login?client_token={Uri.EscapeDataString(tokenString)}"
                : (frontendBase.TrimEnd('/') + $"/login?client_token={Uri.EscapeDataString(tokenString)}");

            return Results.Redirect(redirectTarget);
        })
        .WithName("AuthExternalGoogleCallback");

        return app;
    }
}
