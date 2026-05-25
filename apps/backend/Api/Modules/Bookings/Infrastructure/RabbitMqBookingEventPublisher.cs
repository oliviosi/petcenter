using Microsoft.Extensions.Options;
using RabbitMQ.Client;
using System.Text;
using System.Text.Json;

namespace Api.Modules.Bookings.Infrastructure;

public class RabbitMqBookingEventPublisher : IBookingEventPublisher
{
    private static readonly JsonSerializerOptions SerializerOptions = new(JsonSerializerDefaults.Web);

    private readonly IBookingRabbitMqConnectionFactory _connectionFactory;
    private readonly BookingQueueOptions _options;
    private readonly ILogger<RabbitMqBookingEventPublisher> _logger;

    public RabbitMqBookingEventPublisher(
        IBookingRabbitMqConnectionFactory connectionFactory,
        IOptions<BookingQueueOptions> options,
        ILogger<RabbitMqBookingEventPublisher> logger)
    {
        _connectionFactory = connectionFactory;
        _options = options.Value;
        _logger = logger;
    }

    public async Task PublishRequestedAsync(BookingRequestedMessage message)
    {
        await using var connection = await _connectionFactory.CreateConnectionAsync();
        await using var channel = await connection.CreateChannelAsync();

        await channel.ExchangeDeclareAsync(
            exchange: _options.Exchange,
            type: _options.ExchangeType,
            durable: true,
            autoDelete: false);

        var body = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(message, SerializerOptions));

        await channel.BasicPublishAsync(
            exchange: _options.Exchange,
            routingKey: _options.RequestedRoutingKey,
            mandatory: true,
            body: body);

        _logger.LogInformation(
            "Published booking request event {EventName} for booking {BookingId}",
            BookingEventNames.Requested,
            message.BookingId);
    }
}
