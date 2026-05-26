using Api.Modules.Bookings.Domain;

namespace Api.Modules.Bookings.Infrastructure;

public interface IBookingRepository
{
    Task AddAsync(Booking booking);
    Task<Booking?> GetByIdAsync(Guid id);
    Task<BookingFeedback?> GetFeedbackByBookingIdAsync(Guid bookingId);
    Task<List<BookingFeedback>> ListFeedbackByEmpresaAsync(
        Guid empresaId,
        DateTime? submittedFrom = null,
        DateTime? submittedToExclusive = null,
        Guid? professionalId = null);
    Task<List<Booking>> ListByEmpresaAsync(
        Guid empresaId,
        DateTime? slotStartFrom = null,
        DateTime? slotStartToExclusive = null,
        string? state = null,
        Guid? professionalId = null);
    Task<List<Booking>> ListConfirmedOverlappingAsync(Guid empresaId, IEnumerable<Guid> professionalIds, DateTime intervalStart, DateTime intervalEnd);
    Task AddFeedbackAsync(Booking booking, BookingFeedback feedback);
    Task UpdateAsync(Booking booking);
}
