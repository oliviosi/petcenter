using System.Threading.Tasks;

namespace Api.Modules.Empresas.Infrastructure
{
    public interface INotificationPublisher
    {
        Task PublishAsync(NotificationMessage message);
    }
}
