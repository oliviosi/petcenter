using Api.Exceptions;
using Api.Modules.ProfessionalServiceAssignments.Routes.Create;
using Api.Modules.ProfessionalServiceAssignments.Routes.Delete;
using Api.Modules.ProfessionalServiceAssignments.Routes.List;
using FluentValidation;
using System.Security.Claims;

namespace Api.Modules.ProfessionalServiceAssignments.Routes;

public static class ProfessionalServiceAssignmentsEndpoints
{
    public static WebApplication MapProfessionalServiceAssignmentsEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/professionals/{professionalId:guid}/services")
            .WithTags("ProfessionalServiceAssignments")
            .RequireAuthorization();

        group.MapPost("/", async (
            Guid professionalId,
            CreateProfessionalServiceAssignmentRequest request,
            HttpContext httpContext,
            IValidator<CreateProfessionalServiceAssignmentRequest> validator,
            ICreateProfessionalServiceAssignmentService service) =>
        {
            request.ProfessionalId = professionalId;
            request.EmpresaId = ExtractEmpresaId(httpContext);

            var validation = await validator.ValidateAsync(request);
            if (!validation.IsValid)
                return Results.ValidationProblem(validation.ToDictionary());

            var response = await service.HandleAsync(request);
            return Results.Created($"/professionals/{professionalId}/services/{response.ServiceId}", response);
        })
        .WithName("CreateProfessionalServiceAssignment");

        group.MapGet("/", async (
            Guid professionalId,
            HttpContext httpContext,
            IListProfessionalServiceAssignmentsService service) =>
        {
            var empresaId = ExtractEmpresaId(httpContext);
            var response = await service.HandleAsync(professionalId, empresaId);
            return Results.Ok(response);
        })
        .WithName("ListProfessionalServiceAssignments");

        group.MapDelete("/{serviceId:guid}", async (
            Guid professionalId,
            Guid serviceId,
            HttpContext httpContext,
            IDeleteProfessionalServiceAssignmentService service) =>
        {
            var empresaId = ExtractEmpresaId(httpContext);
            await service.HandleAsync(professionalId, serviceId, empresaId);
            return Results.NoContent();
        })
        .WithName("DeleteProfessionalServiceAssignment");

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
