using Api.Modules.Bookings.Domain;

namespace Api.Modules.Bookings.Infrastructure;

public interface IBookingRepository
{
    Task AddAsync(Booking booking);
    Task<Booking?> GetByIdAsync(Guid id);
    Task<List<Booking>> ListByEmpresaAsync(
        Guid empresaId,
        DateTime? slotStartFrom = null,
        DateTime? slotStartToExclusive = null,
        string? state = null,
        Guid? professionalId = null);
    Task<List<Booking>> ListConfirmedOverlappingAsync(Guid empresaId, IEnumerable<Guid> professionalIds, DateTime intervalStart, DateTime intervalEnd);
    Task UpdateAsync(Booking booking);
}
