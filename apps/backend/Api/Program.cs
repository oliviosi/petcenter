using Api.Configurations;
using Api.Extensions;
using Api.Modules.Empresas.Infrastructure;
using Api.Infrastructure.Persistence;
using Api.Middlewares;
using Api.Modules.Bookings.Infrastructure;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Logging.ClearProviders();
builder.Logging.AddJsonConsole();

builder.Services.AddEndpointsApiExplorer();
// Use FullName-based schema Ids to avoid conflicts between types with same class name in different namespaces
builder.Services.AddSwaggerGen(options =>
{
    options.CustomSchemaIds(type => (type.FullName ?? type.Name).Replace('+', '.'));
});

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        var origins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
        if (origins.Length == 0)
            throw new InvalidOperationException("Cors:AllowedOrigins é obrigatório.");
        policy.WithOrigins(origins).AllowAnyHeader().AllowAnyMethod();
    });
});

builder.Services.AddValidatorsFromAssemblyContaining<Program>();

var jwtKey = builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException("Jwt:Key é obrigatório.");
var jwtIssuer = builder.Configuration["Jwt:Issuer"]
    ?? throw new InvalidOperationException("Jwt:Issuer é obrigatório.");
var jwtAudience = builder.Configuration["Jwt:Audience"]
    ?? throw new InvalidOperationException("Jwt:Audience é obrigatório.");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.MapInboundClaims = false;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });
builder.Services.AddAuthorization();

builder.Services.Configure<DatabaseOptions>(builder.Configuration.GetSection("Database"));
builder.Services.AddOptions<StorefrontDomainVerificationOptions>()
    .Bind(builder.Configuration.GetSection(StorefrontDomainVerificationOptions.SectionName))
    .ValidateDataAnnotations()
    .Validate(options => !string.IsNullOrWhiteSpace(options.ExpectedTarget), "StorefrontDomainVerification:ExpectedTarget é obrigatório.")
    .Validate(options => options.ApexExpectedTargets.Length > 0, "StorefrontDomainVerification:ApexExpectedTargets deve ter ao menos um destino configurado.")
    .Validate(options => options.ApexExpectedTargets.All(target => !string.IsNullOrWhiteSpace(target)), "StorefrontDomainVerification:ApexExpectedTargets não pode conter valores vazios.")
    .Validate(options => options.WorkerInterval > TimeSpan.Zero, "StorefrontDomainVerification:WorkerInterval deve ser maior que zero.")
    .Validate(options => options.RetryDelay > TimeSpan.Zero, "StorefrontDomainVerification:RetryDelay deve ser maior que zero.")
    .Validate(options => options.BatchSize > 0, "StorefrontDomainVerification:BatchSize deve ser maior que zero.")
    .ValidateOnStart();
builder.Services.AddOptions<StorefrontDomainCertificateReadinessOptions>()
    .Bind(builder.Configuration.GetSection(StorefrontDomainCertificateReadinessOptions.SectionName))
    .ValidateDataAnnotations()
    .Validate(options => !string.IsNullOrWhiteSpace(options.ProbePath), "StorefrontDomainCertificateReadiness:ProbePath é obrigatório.")
    .Validate(options => options.RequestTimeout > TimeSpan.Zero, "StorefrontDomainCertificateReadiness:RequestTimeout deve ser maior que zero.")
    .Validate(options => options.RetryDelay > TimeSpan.Zero, "StorefrontDomainCertificateReadiness:RetryDelay deve ser maior que zero.")
    .Validate(options => options.SuccessStatusCodes.Length > 0, "StorefrontDomainCertificateReadiness:SuccessStatusCodes deve ter ao menos um código.")
    .ValidateOnStart();
builder.Services.AddOptions<NotificationOptions>()
    .Bind(builder.Configuration.GetSection("NotificationOptions"))
    .Configure(options =>
    {
        options.MaxAttempts = builder.Configuration.GetValue<int?>("NOTIFY_MAX_ATTEMPTS") ?? options.MaxAttempts;
        options.BaseDelayMs = builder.Configuration.GetValue<int?>("NOTIFY_RETRY_BASE_MS") ?? options.BaseDelayMs;
    })
    .Validate(options => options.MaxAttempts > 0, "NotificationOptions:MaxAttempts deve ser maior que zero.")
    .Validate(options => options.BaseDelayMs > 0, "NotificationOptions:BaseDelayMs deve ser maior que zero.")
    .ValidateOnStart();
builder.Services.AddOptions<EmailNotificationOptions>()
    .Bind(builder.Configuration.GetSection(EmailNotificationOptions.SectionName))
    .Configure(options =>
    {
        options.FromAddress = builder.Configuration["EMAIL_FROM_ADDRESS"] ?? options.FromAddress;
    })
    .Validate(options => !string.IsNullOrWhiteSpace(options.FromAddress), "Email:FromAddress é obrigatório.")
    .ValidateOnStart();
builder.Services.AddOptions<BookingQueueOptions>()
    .Bind(builder.Configuration.GetSection(BookingQueueOptions.SectionName))
    .ValidateDataAnnotations()
    .Validate(options => options.Port > 0, "RabbitMq:Bookings:Port deve ser maior que zero.")
    .ValidateOnStart();
builder.Services.AddHttpClient();

var connectionString = builder.Configuration.GetConnectionString("Default");
if (string.IsNullOrWhiteSpace(connectionString))
    throw new InvalidOperationException("Connection string 'Default' é obrigatória.");

builder.Services.AddDbContext<AppDbContext>(o => o.UseNpgsql(connectionString));

builder.Services.AddModuleServices();

var app = builder.Build();

// Swagger and dev seed moved below (after endpoint mapping) so OpenAPI includes all mapped endpoints.


app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/health", () => Results.Ok(new
{
    status = "Healthy",
    service = "API",
    timestamp = DateTimeOffset.UtcNow
}))
.WithName("HealthCheck")
.WithTags("Health");

app.MapModuleEndpoints();

// Diagnostic: list mapped endpoints at startup to help debug OpenAPI discovery (remove after debugging)
var _endpointDataSource = app.Services.GetRequiredService<Microsoft.AspNetCore.Routing.EndpointDataSource>();
Console.WriteLine($"--- Registered endpoints (count: {_endpointDataSource.Endpoints.Count}) ---");
foreach (var _ep in _endpointDataSource.Endpoints)
{
    Console.WriteLine($"Type: {_ep.GetType().FullName}; DisplayName: {_ep.DisplayName}");
    if (_ep is Microsoft.AspNetCore.Routing.RouteEndpoint _re)
    {
        Console.WriteLine($"  RoutePattern: {_re.RoutePattern.RawText}");
    }
    Console.WriteLine($"  Metadata: {string.Join(',', _ep.Metadata.Select(m => m.GetType().Name))}");
}
Console.WriteLine("--- end endpoints ---");

// Always enable Swagger UI locally to aid debugging; Seed development data only in Development
app.UseSwagger();
app.UseSwaggerUI();
if (app.Environment.IsDevelopment())
{
    await app.SeedDevelopmentDataAsync();
}

app.Run();
