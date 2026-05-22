namespace Api.Modules.Bookings.Infrastructure;

public class InboxEntry
{
    public string MessageId { get; private set; } = string.Empty;
    public string EventName { get; private set; } = string.Empty;
    public DateTime ProcessedAt { get; private set; } = DateTime.UtcNow;
    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;

    private InboxEntry() { }

    public InboxEntry(string messageId, string eventName, DateTime processedAt)
    {
        if (string.IsNullOrWhiteSpace(messageId))
            throw new ArgumentException("MessageId é obrigatório.");
        if (string.IsNullOrWhiteSpace(eventName))
            throw new ArgumentException("Nome do evento é obrigatório.");

        MessageId = messageId.Trim();
        EventName = eventName.Trim();
        ProcessedAt = processedAt.Kind == DateTimeKind.Utc
            ? processedAt
            : DateTime.SpecifyKind(processedAt, DateTimeKind.Utc);
        CreatedAt = DateTime.UtcNow;
    }
}
