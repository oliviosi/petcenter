using Api.Modules.Empresas.Domain;
using Api.Modules.Empresas.Infrastructure;
using System.Net;

namespace Api.Modules.Empresas.Routes;

public static class StorefrontCustomDomainApiMapper
{
    public static string ToApiStatus(StorefrontCustomDomainStatus status) => status switch
    {
        StorefrontCustomDomainStatus.PendingSetup => "pending_setup",
        StorefrontCustomDomainStatus.Verifying => "verifying_dns",
        StorefrontCustomDomainStatus.ProvisioningTls => "provisioning_tls",
        StorefrontCustomDomainStatus.Active => "active",
        StorefrontCustomDomainStatus.Failed => "dns_failed",
        StorefrontCustomDomainStatus.TlsFailed => "tls_failed",
        _ => "removed"
    };

    public static string ToApiDnsStatus(StorefrontCustomDomainDnsStatus status) => status switch
    {
        StorefrontCustomDomainDnsStatus.PendingSetup => "pending_setup",
        StorefrontCustomDomainDnsStatus.Verifying => "verifying",
        StorefrontCustomDomainDnsStatus.Verified => "verified",
        StorefrontCustomDomainDnsStatus.Failed => "failed",
        _ => "removed"
    };

    public static string ToApiTlsStatus(StorefrontCustomDomainTlsStatus status) => status switch
    {
        StorefrontCustomDomainTlsStatus.Provisioning => "provisioning",
        StorefrontCustomDomainTlsStatus.Ready => "ready",
        StorefrontCustomDomainTlsStatus.Failed => "failed",
        _ => "not_started"
    };

    public static string ToApiMode(StorefrontCustomDomainMode mode) => mode switch
    {
        StorefrontCustomDomainMode.Apex => "apex",
        StorefrontCustomDomainMode.Subdomain => "subdomain",
        _ => "none"
    };

    public static StorefrontCustomDomainOnboardingGuidanceResponse BuildOnboardingGuidance(
        string? domain,
        StorefrontDomainVerificationOptions options)
    {
        var analysis = StorefrontCustomDomainAnalysis.TryCreate(domain);
        if (analysis is null)
            return new StorefrontCustomDomainOnboardingGuidanceResponse();

        var expectedTargets = GetExpectedTargets(analysis.Mode, options);
        var expectedHostnames = expectedTargets
            .Where(target => !IPAddress.TryParse(target, out _))
            .ToArray();
        var expectedIps = expectedTargets
            .Where(target => IPAddress.TryParse(target, out _))
            .ToArray();

        if (analysis.Mode == StorefrontCustomDomainMode.Apex)
        {
            return new StorefrontCustomDomainOnboardingGuidanceResponse
            {
                Modo = "apex",
                TipoRegistro = "apex_supported_targets",
                NomeRegistro = "@",
                ZonaDns = analysis.ZoneDomain,
                ValoresEsperados = expectedTargets,
                HostnamesEsperados = expectedHostnames,
                IpsEsperados = expectedIps,
                InstrucaoPrimaria = "Configure o domínio raiz para resolver para um dos destinos apex suportados.",
                InstrucaoSecundaria = BuildApexSecondaryInstruction(expectedHostnames, expectedIps),
                OrientacaoRedirecionamentoWwwOpcional =
                    $"Opcionalmente, você pode redirecionar 'www.{analysis.ZoneDomain}' para '{analysis.ZoneDomain}', mas isso não é obrigatório para ativação."
            };
        }

        return new StorefrontCustomDomainOnboardingGuidanceResponse
        {
            Modo = "subdomain",
            TipoRegistro = "cname",
            NomeRegistro = analysis.RecordName,
            ZonaDns = analysis.ZoneDomain,
            ValoresEsperados = expectedTargets,
            HostnamesEsperados = expectedHostnames,
            IpsEsperados = expectedIps,
            InstrucaoPrimaria = BuildSubdomainPrimaryInstruction(analysis.RecordName, expectedHostnames, expectedTargets),
            InstrucaoSecundaria = "Depois que o DNS propagar, a verificação e o provisionamento HTTPS continuarão automaticamente."
        };
    }

    private static string[] GetExpectedTargets(StorefrontCustomDomainMode mode, StorefrontDomainVerificationOptions options) =>
        mode == StorefrontCustomDomainMode.Apex
            ? options.ApexExpectedTargets
                .Select(NormalizeExpectedTarget)
                .Where(target => !string.IsNullOrWhiteSpace(target))
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToArray()
            : [NormalizeExpectedTarget(options.ExpectedTarget)];

    private static string BuildApexSecondaryInstruction(string[] expectedHostnames, string[] expectedIps)
    {
        if (expectedIps.Length > 0 && expectedHostnames.Length > 0)
        {
            return "Use registros A/AAAA com os IPs informados ou, se seu provedor suportar ALIAS/ANAME/flattening, faça o domínio raiz resolver para um dos hostnames esperados.";
        }

        if (expectedIps.Length > 0)
            return "Use registros A/AAAA com os IPs informados para o domínio raiz.";

        if (expectedHostnames.Length > 0)
            return "Se seu provedor suportar ALIAS/ANAME/flattening, faça o domínio raiz resolver para um dos hostnames esperados.";

        return string.Empty;
    }

    private static string BuildSubdomainPrimaryInstruction(
        string recordName,
        string[] expectedHostnames,
        string[] expectedTargets)
    {
        if (expectedHostnames.Length > 0)
            return $"Crie um registro CNAME para '{recordName}' apontando para '{expectedHostnames[0]}'.";

        return $"Aponte o subdomínio '{recordName}' para um dos destinos suportados: {string.Join(", ", expectedTargets)}.";
    }

    private static string NormalizeExpectedTarget(string target)
    {
        var normalizedTarget = target.Trim().TrimEnd('.');
        if (IPAddress.TryParse(normalizedTarget, out var ipAddress))
            return ipAddress.ToString();

        return normalizedTarget.ToLowerInvariant();
    }
}
