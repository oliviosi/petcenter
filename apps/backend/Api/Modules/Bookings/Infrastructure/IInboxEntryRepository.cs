namespace Api.Modules.Bookings.Infrastructure;

public interface IInboxEntryRepository
{
    Task<bool> ExistsAsync(string messageId);
    Task AddAsync(InboxEntry entry);
}
