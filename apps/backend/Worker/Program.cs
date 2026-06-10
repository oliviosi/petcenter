using Worker;
using Api.Modules.Empresas.Infrastructure;

var builder = Host.CreateApplicationBuilder(args);

// Register the domain notification consumer and in-memory publisher for local testing
builder.Services.AddHostedService<DomainNotificationConsumer>();
builder.Services.AddScoped<INotificationPublisher, InMemoryNotificationPublisher>();

var host = builder.Build();
host.Run();
