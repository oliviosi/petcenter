namespace Api.Modules.Empresas.Domain;

public class StorefrontCustomDomainAnalysis
{
    private static readonly HashSet<string> CompositePublicSuffixes = new(StringComparer.OrdinalIgnoreCase)
    {
        "ac.uk",
        "co.uk",
        "gov.uk",
        "org.uk",
        "com.au",
        "net.au",
        "org.au",
        "co.nz",
        "com.ar",
        "com.br",
        "edu.br",
        "emp.br",
        "eng.br",
        "esp.br",
        "gov.br",
        "ind.br",
        "jus.br",
        "mil.br",
        "net.br",
        "nom.br",
        "org.br",
        "psi.br",
        "tur.br",
        "wiki.br"
    };

    public string Domain { get; init; } = string.Empty;
    public StorefrontCustomDomainMode Mode { get; init; }
    public string ZoneDomain { get; init; } = string.Empty;
    public string RecordName { get; init; } = string.Empty;

    public static StorefrontCustomDomainAnalysis Create(string domain) =>
        TryCreate(domain) ?? throw new ArgumentException("Domínio personalizado inválido.");

    public static StorefrontCustomDomainAnalysis? TryCreate(string? domain)
    {
        if (string.IsNullOrWhiteSpace(domain))
            return null;

        var normalizedDomain = NormalizeDomain(domain);
        var labels = normalizedDomain.Split('.', StringSplitOptions.RemoveEmptyEntries);
        if (labels.Length < 2)
            return null;

        var publicSuffixLabelCount = DeterminePublicSuffixLabelCount(labels);
        var registrableDomainLabelCount = publicSuffixLabelCount + 1;
        if (labels.Length < registrableDomainLabelCount)
            return null;

        var zoneLabels = labels[^registrableDomainLabelCount..];
        var zoneDomain = string.Join('.', zoneLabels);

        if (labels.Length == registrableDomainLabelCount)
        {
            return new StorefrontCustomDomainAnalysis
            {
                Domain = normalizedDomain,
                Mode = StorefrontCustomDomainMode.Apex,
                ZoneDomain = zoneDomain,
                RecordName = "@"
            };
        }

        return new StorefrontCustomDomainAnalysis
        {
            Domain = normalizedDomain,
            Mode = StorefrontCustomDomainMode.Subdomain,
            ZoneDomain = zoneDomain,
            RecordName = string.Join('.', labels[..^registrableDomainLabelCount])
        };
    }

    private static int DeterminePublicSuffixLabelCount(string[] labels)
    {
        if (labels.Length >= 2)
        {
            var lastTwoLabels = string.Join('.', labels[^2..]);
            if (CompositePublicSuffixes.Contains(lastTwoLabels))
                return 2;
        }

        if (labels.Length >= 3
            && labels[^1].Length == 2
            && labels[^2].Length <= 3)
        {
            return 2;
        }

        return 1;
    }

    private static string NormalizeDomain(string domain) =>
        domain.Trim().ToLowerInvariant().TrimEnd('.');
}
