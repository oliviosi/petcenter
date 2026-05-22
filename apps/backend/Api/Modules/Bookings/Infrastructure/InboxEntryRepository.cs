using Api.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Api.Modules.Bookings.Infrastructure;

public class InboxEntryRepository : IInboxEntryRepository
{
    private readonly AppDbContext _db;

    public InboxEntryRepository(AppDbContext db) => _db = db;

    public async Task<bool> ExistsAsync(string messageId) =>
        await _db.InboxEntries.AnyAsync(i => i.MessageId == messageId);

    public async Task AddAsync(InboxEntry entry)
    {
        _db.InboxEntries.Add(entry);
        await _db.SaveChangesAsync();
    }
}
