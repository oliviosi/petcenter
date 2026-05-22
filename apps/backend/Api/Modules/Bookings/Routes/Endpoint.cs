using Api.Modules.Bookings.Routes.Create;
using Api.Modules.Bookings.Routes.CheckFeedbackEligibility;
using Api.Modules.Bookings.Routes.Complete;
using Api.Modules.Bookings.Routes.GetById;
using Api.Modules.Bookings.Routes.GetSlots;
using Api.Modules.Bookings.Routes.List;
using Api.Modules.Bookings.Routes.SubmitFeedback;
using Api.Exceptions;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Api.Modules.Bookings.Routes;

public static class BookingsEndpoints
{
    public static WebApplication MapBookingsEndpoints(this WebApplication app)
    {
        var petshopsGroup = app.MapGroup("/petshops").WithTags("Bookings");

        petshopsGroup.MapGet("/{id:guid}/slots", async (
            Guid id,
            [AsParameters] GetPublicSlotsRequest request,
            IValidator<GetPublicSlotsRequest> validator,
            IGetPublicSlotsService service) =>
        {
            request.PetshopId = id;

            var validation = await validator.ValidateAsync(request);
            if (!validation.IsValid)
                return Results.ValidationProblem(validation.ToDictionary());

            var response = await service.HandleAsync(request);
            return Results.Ok(response);
        })
        .WithName("GetPublicSlots");

        var bookingsGroup = app.MapGroup("/bookings").WithTags("Bookings");

        bookingsGroup.MapPost("/", async (
            CreateBookingRequest request,
            IValidator<CreateBookingRequest> validator,
            ICreateBookingService service) =>
        {
            var validation = await validator.ValidateAsync(request);
            if (!validation.IsValid)
                return Results.ValidationProblem(validation.ToDictionary());

            var response = await service.HandleAsync(request);
            return Results.Created($"/bookings/{response.Id}", response);
        })
        .WithName("CreateBooking");

        bookingsGroup.MapPost("/{id:guid}/feedback/eligibility", async (
            Guid id,
            CheckBookingFeedbackEligibilityRequest request,
            IValidator<CheckBookingFeedbackEligibilityRequest> validator,
            ICheckBookingFeedbackEligibilityService service) =>
        {
            request.BookingId = id;

            var validation = await validator.ValidateAsync(request);
            if (!validation.IsValid)
                return Results.ValidationProblem(validation.ToDictionary());

            var response = await service.HandleAsync(request);
            return Results.Ok(response);
        })
        .WithName("CheckBookingFeedbackEligibility");

        bookingsGroup.MapPost("/{id:guid}/feedback", async (
            Guid id,
            SubmitBookingFeedbackRequest request,
            IValidator<SubmitBookingFeedbackRequest> validator,
            ISubmitBookingFeedbackService service) =>
        {
            request.BookingId = id;

            var validation = await validator.ValidateAsync(request);
            if (!validation.IsValid)
                return Results.ValidationProblem(validation.ToDictionary());

            var response = await service.HandleAsync(request);
            return Results.Ok(response);
        })
        .WithName("SubmitBookingFeedback");

        bookingsGroup.MapGet("/", async (
            [AsParameters] ListBookingsRequest request,
            HttpContext httpContext,
            IValidator<ListBookingsRequest> validator,
            IListBookingsService service) =>
        {
            request.EmpresaId = ExtractEmpresaId(httpContext);

            var validation = await validator.ValidateAsync(request);
            if (!validation.IsValid)
                return Results.ValidationProblem(validation.ToDictionary());

            var response = await service.HandleAsync(request);
            return Results.Ok(response);
        })
        .WithName("ListBookings")
        .RequireAuthorization();

        bookingsGroup.MapGet("/{id:guid}", async (
            Guid id,
            HttpContext httpContext,
            IGetBookingByIdService service) =>
        {
            var empresaId = ExtractEmpresaId(httpContext);
            var response = await service.HandleAsync(id, empresaId);
            return Results.Ok(response);
        })
        .WithName("GetBookingById")
        .RequireAuthorization();

        bookingsGroup.MapPost("/{id:guid}/complete", async (
            Guid id,
            CompleteBookingRequest request,
            HttpContext httpContext,
            IValidator<CompleteBookingRequest> validator,
            ICompleteBookingService service) =>
        {
            request.BookingId = id;
            request.EmpresaId = ExtractEmpresaId(httpContext);

            var validation = await validator.ValidateAsync(request);
            if (!validation.IsValid)
                return Results.ValidationProblem(validation.ToDictionary());

            var response = await service.HandleAsync(request);
            return Results.Ok(response);
        })
        .WithName("CompleteBooking")
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
