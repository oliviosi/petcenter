using Api.Modules.Bookings.Domain;
using Api.Modules.Bookings.Infrastructure;

namespace Api.Modules.Bookings.Routes.GetSlots;

public class GetPublicSlotsService : IGetPublicSlotsService
{
    private readonly IBookingAvailabilityService _availabilityService;
    private readonly TimeProvider _timeProvider;

    public GetPublicSlotsService(IBookingAvailabilityService availabilityService, TimeProvider timeProvider)
    {
        _availabilityService = availabilityService;
        _timeProvider = timeProvider;
    }

    public async Task<List<GetPublicSlotsResponse>> HandleAsync(GetPublicSlotsRequest request)
    {
        var today = DateOnly.FromDateTime(_timeProvider.GetUtcNow().UtcDateTime);
        var startDate = request.StartDate ?? today;
        var endDate = request.EndDate ?? startDate.AddDays(7);

        if (startDate < today || endDate < startDate)
            throw new PublicSlotsIntervalInvalidException();

        var maxDate = today.AddDays(30);
        if (endDate > maxDate)
            throw new PublicSlotsIntervalOutOfRangeException(maxDate);

        var slots = await _availabilityService.GetAvailableSlotsAsync(new BookingAvailabilityQuery
        {
            PetshopId = request.PetshopId!.Value,
            ServiceId = request.ServiceId,
            ProfessionalId = request.ProfessionalId,
            StartDate = startDate,
            EndDate = endDate
        });

        return slots.Select(slot => new GetPublicSlotsResponse
        {
            PetshopId = slot.PetshopId,
            ProfessionalId = slot.ProfessionalId,
            ServiceId = slot.ServiceId,
            SlotStart = slot.SlotStart,
            SlotEnd = slot.SlotEnd
        }).ToList();
    }
}
