using Microsoft.Extensions.Options;
using RabbitMQ.Client;

namespace Api.Modules.Bookings.Infrastructure;

public class BookingRabbitMqConnectionFactory : IBookingRabbitMqConnectionFactory
{
    private readonly BookingQueueOptions _options;

    public BookingRabbitMqConnectionFactory(IOptions<BookingQueueOptions> options) => _options = options.Value;

    public Task<IConnection> CreateConnectionAsync(CancellationToken cancellationToken = default)
    {
        var factory = new ConnectionFactory
        {
            HostName = _options.HostName,
            Port = _options.Port,
            UserName = _options.UserName,
            Password = _options.Password,
            VirtualHost = _options.VirtualHost,
            AutomaticRecoveryEnabled = true,
            ClientProvidedName = "petcenter-api-bookings"
        };

        return factory.CreateConnectionAsync(cancellationToken);
    }
}
