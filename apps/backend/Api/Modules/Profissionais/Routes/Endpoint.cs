using Api.Exceptions;
using Api.Modules.Profissionais.Routes.Ativar;
using Api.Modules.Profissionais.Routes.Create;
using Api.Modules.Profissionais.Routes.Desativar;
using Api.Modules.Profissionais.Routes.GetById;
using Api.Modules.Profissionais.Routes.List;
using Api.Modules.Profissionais.Routes.Update;
using FluentValidation;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Api.Modules.Profissionais.Routes;

public static class ProfissionaisEndpoints
{
    public static WebApplication MapProfissionaisEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/professionals").WithTags("Professionals").WithOpenApi().RequireAuthorization();

        group.MapPost("/", async (
            CreateProfissionalRequest request,
            HttpContext httpContext,
            IValidator<CreateProfissionalRequest> validator,
            ICreateProfissionalService service) =>
        {
            var empresaId = ExtractEmpresaId(httpContext);
            request.EmpresaId = empresaId;

            var validation = await validator.ValidateAsync(request);
            if (!validation.IsValid)
                return Results.ValidationProblem(validation.ToDictionary());

            var response = await service.HandleAsync(request);
            return Results.Created($"/professionals/{response.Id}", response);
        })
        .WithName("CreateProfissional");

        group.MapGet("/", async (
            HttpContext httpContext,
            IListProfissionaisService service) =>
        {
            var empresaId = ExtractEmpresaId(httpContext);
            var response = await service.HandleAsync(empresaId);
            return Results.Ok(response);
        })
        .WithName("ListProfissionais");

        group.MapGet("/{id:guid}", async (
            Guid id,
            HttpContext httpContext,
            IGetProfissionalByIdService service) =>
        {
            var empresaId = ExtractEmpresaId(httpContext);
            var response = await service.HandleAsync(id, empresaId);
            return Results.Ok(response);
        })
        .WithName("GetProfissionalById");

        group.MapPut("/{id:guid}", async (
            Guid id,
            UpdateProfissionalRequest request,
            HttpContext httpContext,
            IValidator<UpdateProfissionalRequest> validator,
            IUpdateProfissionalService service) =>
        {
            var empresaId = ExtractEmpresaId(httpContext);
            request.Id = id;
            request.EmpresaId = empresaId;

            var validation = await validator.ValidateAsync(request);
            if (!validation.IsValid)
                return Results.ValidationProblem(validation.ToDictionary());

            var response = await service.HandleAsync(request);
            return Results.Ok(response);
        })
        .WithName("UpdateProfissional");

        group.MapPost("/{id:guid}/activate", async (
            Guid id,
            HttpContext httpContext,
            IAtivarProfissionalService service) =>
        {
            var empresaId = ExtractEmpresaId(httpContext);
            await service.HandleAsync(id, empresaId);
            return Results.NoContent();
        })
        .WithName("ActivateProfissional");

        group.MapPost("/{id:guid}/deactivate", async (
            Guid id,
            HttpContext httpContext,
            IDesativarProfissionalService service) =>
        {
            var empresaId = ExtractEmpresaId(httpContext);
            await service.HandleAsync(id, empresaId);
            return Results.NoContent();
        })
        .WithName("DeactivateProfissional");

        return app;
    }

    private static Guid ExtractEmpresaId(HttpContext httpContext)
    {
        var claim = httpContext.User.FindFirstValue("empresa_id");
        if (!Guid.TryParse(claim, out var empresaId))
            throw new UnauthorizedException("Token inválido.");
        return empresaId;
    }
}
