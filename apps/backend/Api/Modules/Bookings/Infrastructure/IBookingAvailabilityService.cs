namespace Api.Modules.Bookings.Infrastructure;

public interface IBookingAvailabilityService
{
    Task<List<AvailableSlot>> GetAvailableSlotsAsync(BookingAvailabilityQuery query);
}
