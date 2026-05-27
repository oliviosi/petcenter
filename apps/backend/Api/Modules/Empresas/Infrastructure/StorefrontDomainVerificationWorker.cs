using Microsoft.Extensions.Options;

namespace Api.Modules.Empresas.Infrastructure;

public class StorefrontDomainVerificationWorker : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly StorefrontDomainVerificationOptions _options;
    private readonly ILogger<StorefrontDomainVerificationWorker> _logger;

    public StorefrontDomainVerificationWorker(
        IServiceScopeFactory scopeFactory,
        IOptions<StorefrontDomainVerificationOptions> options,
        ILogger<StorefrontDomainVerificationWorker> logger)
    {
        _scopeFactory = scopeFactory;
        _options = options.Value;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            await using var scope = _scopeFactory.CreateAsyncScope();
            var verificationService = scope.ServiceProvider.GetRequiredService<IStorefrontDomainVerificationService>();
            await verificationService.ProcessPendingAsync(stoppingToken);

            _logger.LogDebug("Next storefront domain verification run in {Delay}.", _options.WorkerInterval);
            await Task.Delay(_options.WorkerInterval, stoppingToken);
        }
    }
}
