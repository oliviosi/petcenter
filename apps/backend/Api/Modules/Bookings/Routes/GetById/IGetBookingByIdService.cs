namespace Api.Modules.Bookings.Routes.GetById;

public interface IGetBookingByIdService
{
    Task<GetBookingByIdResponse> HandleAsync(Guid id, Guid empresaId);
}
