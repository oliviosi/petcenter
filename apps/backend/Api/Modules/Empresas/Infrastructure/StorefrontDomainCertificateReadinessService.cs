using Microsoft.Extensions.Options;

namespace Api.Modules.Empresas.Infrastructure;

public class StorefrontDomainCertificateReadinessService : IStorefrontDomainCertificateReadinessService
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly StorefrontDomainCertificateReadinessOptions _options;

    public StorefrontDomainCertificateReadinessService(
        IHttpClientFactory httpClientFactory,
        IOptions<StorefrontDomainCertificateReadinessOptions> options)
    {
        _httpClientFactory = httpClientFactory;
        _options = options.Value;
    }

    public async Task<StorefrontDomainCertificateReadinessResult> CheckAsync(
        string domain,
        CancellationToken cancellationToken = default)
    {
        var dominioNormalizado = NormalizeHost(domain);
        var uri = BuildProbeUri(dominioNormalizado);

        using var timeoutCts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
        timeoutCts.CancelAfter(_options.RequestTimeout);

        try
        {
            var client = _httpClientFactory.CreateClient(nameof(StorefrontDomainCertificateReadinessService));
            using var request = new HttpRequestMessage(HttpMethod.Get, uri);
            using var response = await client.SendAsync(
                request,
                HttpCompletionOption.ResponseHeadersRead,
                timeoutCts.Token);

            var statusCode = (int)response.StatusCode;
            var pronto = _options.SuccessStatusCodes.Contains(statusCode);

            return new StorefrontDomainCertificateReadinessResult
            {
                IsReady = pronto,
                Message = pronto
                    ? $"HTTPS pronto para o domínio '{dominioNormalizado}'."
                    : $"HTTPS ainda não está pronto para o domínio '{dominioNormalizado}'."
            };
        }
        catch (HttpRequestException)
        {
            return new StorefrontDomainCertificateReadinessResult
            {
                IsReady = false,
                Message = $"HTTPS ainda não está pronto para o domínio '{dominioNormalizado}'."
            };
        }
        catch (TaskCanceledException) when (!cancellationToken.IsCancellationRequested)
        {
            return new StorefrontDomainCertificateReadinessResult
            {
                IsReady = false,
                Message = $"A verificação HTTPS do domínio '{dominioNormalizado}' expirou e será tentada novamente."
            };
        }
    }

    private Uri BuildProbeUri(string domain)
    {
        var path = string.IsNullOrWhiteSpace(_options.ProbePath) ? "/" : _options.ProbePath.Trim();
        if (!path.StartsWith('/'))
            path = $"/{path}";

        return new UriBuilder(Uri.UriSchemeHttps, domain)
        {
            Path = path
        }.Uri;
    }

    private static string NormalizeHost(string host) =>
        host.Trim().ToLowerInvariant().TrimEnd('.').Split(':', 2)[0];
}
