namespace Api.Modules.Empresas.Infrastructure;

public class EmailNotificationOptions
{
    public const string SectionName = "Email";

    public string FromAddress { get; set; } = "no-reply@petcenter.local";
}
