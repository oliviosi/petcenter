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

        return app;
    }
}
