using Api.Modules.Bookings.Routes.ConfirmFromEvent;
using Api.Modules.Bookings.Routes.RejectFromEvent;
using Microsoft.Extensions.Options;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using System.Text.Json;

namespace Api.Modules.Bookings.Infrastructure;

public class BookingQueueConsumerService : BackgroundService
{
    private static readonly JsonSerializerOptions SerializerOptions = new(JsonSerializerDefaults.Web);

    private readonly IBookingRabbitMqConnectionFactory _connectionFactory;
    private readonly BookingQueueOptions _options;
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<BookingQueueConsumerService> _logger;

    public BookingQueueConsumerService(
        IBookingRabbitMqConnectionFactory connectionFactory,
        IOptions<BookingQueueOptions> options,
        IServiceScopeFactory scopeFactory,
        ILogger<BookingQueueConsumerService> logger)
    {
        _connectionFactory = connectionFactory;
        _options = options.Value;
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // Attempt to create a connection with retry loop. If RabbitMQ is unavailable, keep retrying
        // without crashing the host so the API remains available.
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await using var connection = await _connectionFactory.CreateConnectionAsync(stoppingToken);
                await using var channel = await connection.CreateChannelAsync(cancellationToken: stoppingToken);

                await channel.ExchangeDeclareAsync(
                    exchange: _options.Exchange,
                    type: _options.ExchangeType,
                    durable: true,
                    autoDelete: false,
                    cancellationToken: stoppingToken);

                await DeclareAndBindQueueAsync(
                    channel,
                    _options.ConfirmedQueue,
                    _options.ConfirmedRoutingKey,
                    stoppingToken);

                await DeclareAndBindQueueAsync(
                    channel,
                    _options.RejectedQueue,
                    _options.RejectedRoutingKey,
                    stoppingToken);

                var confirmedConsumer = new AsyncEventingBasicConsumer(channel);
                confirmedConsumer.ReceivedAsync += async (_, eventArgs) =>
                    await HandleMessageAsync(
                        channel,
                        eventArgs,
                        BookingEventNames.Confirmed,
                        payload => HandleConfirmedAsync(payload, stoppingToken));

                var rejectedConsumer = new AsyncEventingBasicConsumer(channel);
                rejectedConsumer.ReceivedAsync += async (_, eventArgs) =>
                    await HandleMessageAsync(
                        channel,
                        eventArgs,
                        BookingEventNames.Rejected,
                        payload => HandleRejectedAsync(payload, stoppingToken));

                await channel.BasicConsumeAsync(
                    queue: _options.ConfirmedQueue,
                    autoAck: false,
                    consumer: confirmedConsumer,
                    cancellationToken: stoppingToken);

                await channel.BasicConsumeAsync(
                    queue: _options.RejectedQueue,
                    autoAck: false,
                    consumer: rejectedConsumer,
                    cancellationToken: stoppingToken);

                _logger.LogInformation(
                    "Booking queue consumers started for queues {ConfirmedQueue} and {RejectedQueue}",
                    _options.ConfirmedQueue,
                    _options.RejectedQueue);

                // Keep the connection and channel open for the lifetime of the service
                await Task.Delay(Timeout.Infinite, stoppingToken);
                return;
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
            {
                _logger.LogInformation("BookingQueueConsumerService startup canceled.");
                return;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to connect to RabbitMQ at startup. Will retry in 5s.");
                try
                {
                    await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);
                }
                catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
                {
                    _logger.LogInformation("BookingQueueConsumerService retry canceled.");
                    return;
                }
            }
        }

        _logger.LogWarning("BookingQueueConsumerService did not establish a RabbitMQ connection and will not start consumers.");
        return;
    }

    private async Task HandleMessageAsync(
        IChannel channel,
        BasicDeliverEventArgs eventArgs,
        string eventName,
        Func<ReadOnlyMemory<byte>, Task> handler)
    {
        try
        {
            await handler(eventArgs.Body);
            await channel.BasicAckAsync(eventArgs.DeliveryTag, multiple: false);
        }
        catch (JsonException exception)
        {
            _logger.LogError(exception, "Invalid booking event payload for {EventName}", eventName);
            await channel.BasicNackAsync(eventArgs.DeliveryTag, multiple: false, requeue: false);
        }
        catch (Exception exception)
        {
            _logger.LogError(exception, "Failed to process booking event {EventName}", eventName);
            await channel.BasicNackAsync(eventArgs.DeliveryTag, multiple: false, requeue: true);
        }
    }

    private async Task HandleConfirmedAsync(ReadOnlyMemory<byte> payload, CancellationToken cancellationToken)
    {
        var message = DeserializeMessage<BookingConfirmedMessage>(payload, BookingEventNames.Confirmed);

        await using var scope = _scopeFactory.CreateAsyncScope();
        var service = scope.ServiceProvider.GetRequiredService<IConfirmBookingFromEventService>();
        await service.HandleAsync(message);
    }

    private async Task HandleRejectedAsync(ReadOnlyMemory<byte> payload, CancellationToken cancellationToken)
    {
        var message = DeserializeMessage<BookingRejectedMessage>(payload, BookingEventNames.Rejected);

        await using var scope = _scopeFactory.CreateAsyncScope();
        var service = scope.ServiceProvider.GetRequiredService<IRejectBookingFromEventService>();
        await service.HandleAsync(message);
    }

    private async Task DeclareAndBindQueueAsync(
        IChannel channel,
        string queueName,
        string routingKey,
        CancellationToken cancellationToken)
    {
        await channel.QueueDeclareAsync(
            queue: queueName,
            durable: true,
            exclusive: false,
            autoDelete: false,
            cancellationToken: cancellationToken);

        await channel.QueueBindAsync(
            queue: queueName,
            exchange: _options.Exchange,
            routingKey: routingKey,
            cancellationToken: cancellationToken);
    }

    private static TMessage DeserializeMessage<TMessage>(ReadOnlyMemory<byte> payload, string eventName)
    {
        var message = JsonSerializer.Deserialize<TMessage>(Encoding.UTF8.GetString(payload.Span), SerializerOptions);
        if (message is null)
            throw new JsonException($"Payload inválido para {eventName}.");

        return message;
    }
}
