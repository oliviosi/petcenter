using System.ComponentModel.DataAnnotations;

namespace Api.Modules.Bookings.Infrastructure;

public class BookingQueueOptions
{
    public const string SectionName = "RabbitMq:Bookings";

    [Required]
    public string HostName { get; set; } = string.Empty;

    [Range(1, 65535)]
    public int Port { get; set; } = 5672;

    [Required]
    public string UserName { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;

    [Required]
    public string VirtualHost { get; set; } = "/";

    [Required]
    public string Exchange { get; set; } = string.Empty;

    [Required]
    public string ExchangeType { get; set; } = string.Empty;

    [Required]
    public string RequestedRoutingKey { get; set; } = string.Empty;

    [Required]
    public string ConfirmedQueue { get; set; } = string.Empty;

    [Required]
    public string ConfirmedRoutingKey { get; set; } = string.Empty;

    [Required]
    public string RejectedQueue { get; set; } = string.Empty;

    [Required]
    public string RejectedRoutingKey { get; set; } = string.Empty;
}
