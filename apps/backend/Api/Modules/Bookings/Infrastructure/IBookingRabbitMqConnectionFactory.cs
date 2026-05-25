using RabbitMQ.Client;

namespace Api.Modules.Bookings.Infrastructure;

public interface IBookingRabbitMqConnectionFactory
{
    Task<IConnection> CreateConnectionAsync(CancellationToken cancellationToken = default);
}
