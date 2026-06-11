using Worker;
using Microsoft.Extensions.Hosting;

var builder = Host.CreateApplicationBuilder(args);

// Worker project deprecated - no registrations by default.
// Use NOTIFICATION_RUN_IN_PROCESS in Api to run the consumer in-process if needed.

var host = builder.Build();
host.Run();
