namespace Api.Modules.Bookings.Routes.GetSlots;

public interface IGetPublicSlotsService
{
    Task<List<GetPublicSlotsResponse>> HandleAsync(GetPublicSlotsRequest request);
}
