namespace Api.Modules.Empresas.Infrastructure;

public class NotificationOptions
{
    public int MaxAttempts { get; set; } = 3;
    public int BaseDelayMs { get; set; } = 500;
}
