using Api.Infrastructure.Persistence;
using Api.Modules.Bookings.Domain;
using Microsoft.EntityFrameworkCore;

namespace Api.Modules.Bookings.Infrastructure;

public class BookingRepository : IBookingRepository
{
    private readonly AppDbContext _db;

    public BookingRepository(AppDbContext db) => _db = db;

    public async Task AddAsync(Booking booking)
    {
        _db.Bookings.Add(booking);
        await _db.SaveChangesAsync();
    }

    public async Task<Booking?> GetByIdAsync(Guid id) =>
        await _db.Bookings.FirstOrDefaultAsync(b => b.Id == id);

    public async Task<BookingFeedback?> GetFeedbackByBookingIdAsync(Guid bookingId) =>
        await _db.BookingFeedbacks.FirstOrDefaultAsync(feedback => feedback.BookingId == bookingId);

    public async Task<List<BookingFeedback>> ListFeedbackByEmpresaAsync(
        Guid empresaId,
        DateTime? submittedFrom = null,
        DateTime? submittedToExclusive = null,
        Guid? professionalId = null)
    {
        var query = _db.BookingFeedbacks.AsNoTracking()
            .Where(feedback => feedback.EmpresaId == empresaId);

        if (submittedFrom.HasValue)
            query = query.Where(feedback => feedback.SubmittedAt >= submittedFrom.Value);

        if (submittedToExclusive.HasValue)
            query = query.Where(feedback => feedback.SubmittedAt < submittedToExclusive.Value);

        if (professionalId.HasValue)
            query = query.Where(feedback => feedback.ProfessionalId == professionalId.Value);

        return await query
            .OrderByDescending(feedback => feedback.SubmittedAt)
            .ThenByDescending(feedback => feedback.Id)
            .ToListAsync();
    }

    public async Task<List<Booking>> ListByEmpresaAsync(
        Guid empresaId,
        DateTime? slotStartFrom = null,
        DateTime? slotStartToExclusive = null,
        string? state = null,
        Guid? professionalId = null)
    {
        var query = _db.Bookings.AsNoTracking()
            .Where(b => b.EmpresaId == empresaId);

        if (slotStartFrom.HasValue)
            query = query.Where(b => b.SlotStart >= slotStartFrom.Value);

        if (slotStartToExclusive.HasValue)
            query = query.Where(b => b.SlotStart < slotStartToExclusive.Value);

        if (!string.IsNullOrWhiteSpace(state))
            query = query.Where(b => b.State == state);

        if (professionalId.HasValue)
            query = query.Where(b => b.ProfessionalId == professionalId.Value);

        return await query
            .OrderBy(b => b.SlotStart)
            .ThenBy(b => b.Id)
            .ToListAsync();
    }

    public async Task<List<Booking>> ListConfirmedOverlappingAsync(
        Guid empresaId,
        IEnumerable<Guid> professionalIds,
        DateTime intervalStart,
        DateTime intervalEnd)
    {
        var ids = professionalIds.Distinct().ToArray();
        if (ids.Length == 0)
                    return new List<Booking>();

        return await _db.Bookings.AsNoTracking()
            .Where(b =>
                b.EmpresaId == empresaId
                && ids.Contains(b.ProfessionalId)
                && (b.State == BookingStates.Confirmed || b.State == BookingStates.Completed)
                && b.SlotStart < intervalEnd
                && b.SlotEnd > intervalStart)
            .OrderBy(b => b.SlotStart)
            .ToListAsync();
    }

    public async Task AddFeedbackAsync(Booking booking, BookingFeedback feedback)
    {
        _db.Bookings.Update(booking);
        _db.BookingFeedbacks.Add(feedback);
        await _db.SaveChangesAsync();
    }

    public async Task UpdateAsync(Booking booking)
    {
        _db.Bookings.Update(booking);
        await _db.SaveChangesAsync();
    }
}
