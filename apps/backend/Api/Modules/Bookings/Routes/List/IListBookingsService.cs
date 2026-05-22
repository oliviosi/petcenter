namespace Api.Modules.Bookings.Routes.List;

public interface IListBookingsService
{
    Task<List<ListBookingsResponse>> HandleAsync(ListBookingsRequest request);
}
