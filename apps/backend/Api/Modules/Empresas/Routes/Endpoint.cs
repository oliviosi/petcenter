using Api.Exceptions;
using Api.Modules.Empresas.Routes.GetPublicByHost;
using Api.Modules.Empresas.Routes.GetPublicBySlug;
using Api.Modules.Empresas.Routes.GetPublicProfile;
using Api.Modules.Empresas.Routes.ListPublic;
using Api.Modules.Empresas.Routes.UpdatePublicProfile;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Api.Modules.Empresas.Routes;

public static class EmpresasEndpoints
{
    public static WebApplication MapEmpresasEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/petshops").WithTags("Petshops");

        group.MapGet("/public-profile", async (
            HttpContext httpContext,
            IGetEmpresaPublicProfileService service) =>
        {
            var empresaId = ExtractEmpresaId(httpContext);
            var response = await service.HandleAsync(empresaId);
            return Results.Ok(response);
        })
        .WithName("GetEmpresaPublicProfile")
        .RequireAuthorization();

        group.MapPut("/public-profile", async (
            UpdateEmpresaPublicProfileRequest request,
            HttpContext httpContext,
            IValidator<UpdateEmpresaPublicProfileRequest> validator,
            IUpdateEmpresaPublicProfileService service) =>
        {
            request.EmpresaId = ExtractEmpresaId(httpContext);

            var validation = await validator.ValidateAsync(request);
            if (!validation.IsValid)
                return Results.ValidationProblem(validation.ToDictionary());

            var response = await service.HandleAsync(request);
            return Results.Ok(response);
        })
        .WithName("UpdateEmpresaPublicProfile")
        .RequireAuthorization();

        group.MapGet("/public", async (
            [AsParameters] ListPublicEmpresasRequest request,
            IValidator<ListPublicEmpresasRequest> validator,
            IListPublicEmpresasService service) =>
        {
            var validation = await validator.ValidateAsync(request);
            if (!validation.IsValid)
                return Results.ValidationProblem(validation.ToDictionary());

            var response = await service.HandleAsync(request);
            return Results.Ok(response);
        })
        .WithName("ListPublicEmpresas");

        group.MapGet("/public/by-host", async (
            [FromQuery] string host,
            IGetPublicEmpresaByHostService service) =>
        {
            var response = await service.HandleAsync(host);
            return Results.Ok(response);
        })
        .WithName("GetPublicEmpresaByHost");

        group.MapGet("/public/{slug}", async (
            string slug,
            IGetPublicEmpresaBySlugService service) =>
        {
            var response = await service.HandleAsync(slug);
            return Results.Ok(response);
        })
        .WithName("GetPublicEmpresaBySlug");

        // Admin tenant domain health endpoints
        var admin = app.MapGroup("/admin/tenants").WithTags("Admin:Tenants");

        admin.MapGet("/{tenantId:guid}/domain-health", async (
            Guid tenantId,
            HttpContext httpContext,
            Api.Modules.Empresas.Infrastructure.IDomainHealthService service) =>
        {
            var empresaId = ExtractEmpresaId(httpContext);
            if (empresaId != tenantId)
                return Results.Unauthorized();

            var dto = await service.GetDomainHealthAsync(tenantId);
            return Results.Ok(dto);
        })
        .WithName("GetTenantDomainHealth")
        .RequireAuthorization();

        admin.MapGet("/{tenantId:guid}/domain-health/notifications", async (
            Guid tenantId,
            int page,
            int pageSize,
            HttpContext httpContext,
            Api.Modules.Empresas.Infrastructure.IDomainHealthService service) =>
        {
            var empresaId = ExtractEmpresaId(httpContext);
            if (empresaId != tenantId)
                return Results.Unauthorized();

            var (items, total) = await service.GetNotificationsAsync(tenantId, page <= 0 ? 1 : page, pageSize <= 0 ? 20 : pageSize);
            return Results.Ok(new { items, total });
        })
        .WithName("ListTenantDomainNotifications")
        .RequireAuthorization();

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
