using System.ComponentModel.DataAnnotations;

namespace Api.Modules.Empresas.Infrastructure;

public class StorefrontDomainCertificateReadinessOptions
{
    public const string SectionName = "StorefrontDomainCertificateReadiness";

    [Required]
    public string ProbePath { get; set; } = "/";

    public int[] SuccessStatusCodes { get; set; } = [200, 301, 302, 307, 308];

    public TimeSpan RequestTimeout { get; set; } = TimeSpan.FromSeconds(10);

    public TimeSpan RetryDelay { get; set; } = TimeSpan.FromMinutes(15);
}
