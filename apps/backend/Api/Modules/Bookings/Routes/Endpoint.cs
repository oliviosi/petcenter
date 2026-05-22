using Api.Modules.Bookings.Routes.Create;
using Api.Modules.Bookings.Routes.GetSlots;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;

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

        return app;
    }
}
