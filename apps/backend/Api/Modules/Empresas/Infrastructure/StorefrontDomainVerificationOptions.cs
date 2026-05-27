using System.ComponentModel.DataAnnotations;

namespace Api.Modules.Empresas.Infrastructure;

public class StorefrontDomainVerificationOptions
{
    public const string SectionName = "StorefrontDomainVerification";

    [Required]
    public string ExpectedTarget { get; set; } = string.Empty;

    public TimeSpan WorkerInterval { get; set; } = TimeSpan.FromMinutes(5);

    public TimeSpan RetryDelay { get; set; } = TimeSpan.FromMinutes(15);

    [Range(1, 500)]
    public int BatchSize { get; set; } = 25;
}
