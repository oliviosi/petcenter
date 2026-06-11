using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Api.Workers
{
    public class DomainNotificationConsumer : BackgroundService
    {
        private readonly ILogger<DomainNotificationConsumer> _logger;

        public DomainNotificationConsumer(ILogger<DomainNotificationConsumer> logger)
        {
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("DomainNotificationConsumer started.");

            while (!stoppingToken.IsCancellationRequested)
            {
                // Placeholder: read messages from RabbitMQ and process.
                _logger.LogDebug("Polling for domain notification messages (placeholder).");
                await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);
            }

            _logger.LogInformation("DomainNotificationConsumer stopping.");
        }
    }
}
