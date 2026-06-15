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

        return app;
    }
}
