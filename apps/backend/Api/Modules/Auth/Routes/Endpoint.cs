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

        return app;
    }
}
