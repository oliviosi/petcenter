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
            return [];

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

    public async Task UpdateAsync(Booking booking)
    {
        _db.Bookings.Update(booking);
        await _db.SaveChangesAsync();
    }
}
