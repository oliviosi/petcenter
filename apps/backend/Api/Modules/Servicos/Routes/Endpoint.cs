using Api.Exceptions;
using Api.Modules.Servicos.Routes.Ativar;
using Api.Modules.Servicos.Routes.Create;
using Api.Modules.Servicos.Routes.Desativar;
using Api.Modules.Servicos.Routes.List;
using Api.Modules.Servicos.Routes.Update;
using FluentValidation;
using System.Security.Claims;

namespace Api.Modules.Servicos.Routes;

public static class ServicosEndpoints
{
    public static WebApplication MapServicosEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/services").WithTags("Services").RequireAuthorization();

        group.MapPost("/", async (
            CreateServicoRequest request,
            HttpContext httpContext,
            IValidator<CreateServicoRequest> validator,
            ICreateServicoService service) =>
        {
            var empresaId = ExtractEmpresaId(httpContext);
            request.EmpresaId = empresaId;

            var validation = await validator.ValidateAsync(request);
            if (!validation.IsValid)
                return Results.ValidationProblem(validation.ToDictionary());

            var response = await service.HandleAsync(request);
            return Results.Created($"/services/{response.Id}", response);
        })
        .WithName("CreateServico");

        group.MapGet("/", async (
            HttpContext httpContext,
            IListServicosService service) =>
        {
            var empresaId = ExtractEmpresaId(httpContext);
            var response = await service.HandleAsync(empresaId);
            return Results.Ok(response);
        })
        .WithName("ListServicos");

        group.MapPut("/{id:guid}", async (
            Guid id,
            UpdateServicoRequest request,
            HttpContext httpContext,
            IValidator<UpdateServicoRequest> validator,
            IUpdateServicoService service) =>
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
        .WithName("UpdateServico");

        group.MapPost("/{id:guid}/activate", async (
            Guid id,
            HttpContext httpContext,
            IAtivarServicoService service) =>
        {
            var empresaId = ExtractEmpresaId(httpContext);
            await service.HandleAsync(id, empresaId);
            return Results.NoContent();
        })
        .WithName("ActivateServico");

        group.MapPost("/{id:guid}/deactivate", async (
            Guid id,
            HttpContext httpContext,
            IDesativarServicoService service) =>
        {
            var empresaId = ExtractEmpresaId(httpContext);
            await service.HandleAsync(id, empresaId);
            return Results.NoContent();
        })
        .WithName("DeactivateServico");

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
