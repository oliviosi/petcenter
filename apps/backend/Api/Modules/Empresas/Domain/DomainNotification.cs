using System;

namespace Api.Modules.Empresas.Domain;

public class DomainNotification
{
    public Guid Id { get; set; }
    public Guid EmpresaId { get; set; }
    public string Category { get; set; } = null!;
    public string? Reason { get; set; }
    public string? Payload { get; set; }
    public DateTime? SentAt { get; set; }
    public string? Outcome { get; set; }
    public int Attempts { get; set; }
    public DateTime CreatedAt { get; set; }
}
