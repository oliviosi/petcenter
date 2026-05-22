using Api.Exceptions;
using Api.Modules.Disponibilidade.Routes.Create;
using Api.Modules.Disponibilidade.Routes.Delete;
using Api.Modules.Disponibilidade.Routes.List;
using Api.Modules.Disponibilidade.Routes.Update;
using FluentValidation;
using System.Security.Claims;

namespace Api.Modules.Disponibilidade.Routes;

public static class DisponibilidadeEndpoints
{
    public static WebApplication MapDisponibilidadeEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/professionals/{professionalId:guid}/availability")
            .WithTags("Availability")
            .RequireAuthorization();

        group.MapPost("/", async (
            Guid professionalId,
            CreateDisponibilidadeRequest request,
            HttpContext httpContext,
            IValidator<CreateDisponibilidadeRequest> validator,
            ICreateDisponibilidadeService service) =>
        {
            var empresaId = ExtractEmpresaId(httpContext);
            request.ProfissionalId = professionalId;
            request.EmpresaId = empresaId;

            var validation = await validator.ValidateAsync(request);
            if (!validation.IsValid)
                return Results.ValidationProblem(validation.ToDictionary());

            var response = await service.HandleAsync(request);
            return Results.Created($"/professionals/{professionalId}/availability/{response.Id}", response);
        })
        .WithName("CreateDisponibilidade");

        group.MapGet("/", async (
            Guid professionalId,
            HttpContext httpContext,
            IListDisponibilidadeService service) =>
        {
            var empresaId = ExtractEmpresaId(httpContext);
            var response = await service.HandleAsync(professionalId, empresaId);
            return Results.Ok(response);
        })
        .WithName("ListDisponibilidade");

        group.MapPut("/{id:guid}", async (
            Guid professionalId,
            Guid id,
            UpdateDisponibilidadeRequest request,
            HttpContext httpContext,
            IValidator<UpdateDisponibilidadeRequest> validator,
            IUpdateDisponibilidadeService service) =>
        {
            var empresaId = ExtractEmpresaId(httpContext);
            request.Id = id;
            request.ProfissionalId = professionalId;
            request.EmpresaId = empresaId;

            var validation = await validator.ValidateAsync(request);
            if (!validation.IsValid)
                return Results.ValidationProblem(validation.ToDictionary());

            var response = await service.HandleAsync(request);
            return Results.Ok(response);
        })
        .WithName("UpdateDisponibilidade");

        group.MapDelete("/{id:guid}", async (
            Guid professionalId,
            Guid id,
            HttpContext httpContext,
            IDeleteDisponibilidadeService service) =>
        {
            var empresaId = ExtractEmpresaId(httpContext);
            await service.HandleAsync(id, professionalId, empresaId);
            return Results.NoContent();
        })
        .WithName("DeleteDisponibilidade");

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
