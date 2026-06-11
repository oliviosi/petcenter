using Api.Modules.Auth.Routes.Login;
using Api.Modules.Auth.Routes.Me;
using Api.Modules.Bookings.Infrastructure;
using Api.Modules.Bookings.Routes.CheckStatus;
using Api.Modules.Bookings.Routes.ConfirmFromEvent;
using Api.Modules.Bookings.Routes.Cancel;
using Api.Modules.Bookings.Routes.Complete;
using Api.Modules.Bookings.Routes.Create;
using Api.Modules.Bookings.Routes.CheckFeedbackEligibility;
using Api.Modules.Bookings.Routes.GetById;
using Api.Modules.Bookings.Routes.GetFeedbackSummary;
using Api.Modules.Bookings.Routes.GetSlots;
using Api.Modules.Bookings.Routes.List;
using Api.Modules.Bookings.Routes.ListFeedback;
using Api.Modules.Bookings.Routes.NoShow;
using Api.Modules.Bookings.Routes.RejectFromEvent;
using Api.Modules.Bookings.Routes.SubmitFeedback;
using Api.Modules.Disponibilidade.Infrastructure;
using Api.Modules.Disponibilidade.Routes.Create;
using Api.Modules.Disponibilidade.Routes.Delete;
using Api.Modules.Disponibilidade.Routes.List;
using Api.Modules.Disponibilidade.Routes.Update;
using Api.Modules.Empresas.Infrastructure;
using Api.Modules.Empresas.Routes.GetPublicByHost;
using Api.Modules.Empresas.Routes.GetPublicBySlug;
using Api.Modules.Empresas.Routes.GetPublicProfile;
using Api.Modules.Empresas.Routes.ListPublic;
using Api.Modules.Empresas.Routes.UpdatePublicProfile;
using Api.Modules.ProfessionalServiceAssignments.Infrastructure;
using Api.Modules.ProfessionalServiceAssignments.Routes.Create;
using Api.Modules.ProfessionalServiceAssignments.Routes.Delete;
using Api.Modules.ProfessionalServiceAssignments.Routes.List;
using Api.Modules.Profissionais.Infrastructure;
using Api.Modules.Profissionais.Routes.Ativar;
using Api.Modules.Profissionais.Routes.Create;
using Api.Modules.Profissionais.Routes.Desativar;
using Api.Modules.Profissionais.Routes.GetById;
using Api.Modules.Profissionais.Routes.List;
using Api.Modules.Profissionais.Routes.Update;
using Api.Modules.Servicos.Infrastructure;
using Api.Modules.Servicos.Routes.Ativar;
using Api.Modules.Servicos.Routes.Create;
using Api.Modules.Servicos.Routes.Desativar;
using Api.Modules.Servicos.Routes.List;
using Api.Modules.Servicos.Routes.Update;
using Api.Modules.Usuarios.Infrastructure;

namespace Api.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddModuleServices(this IServiceCollection services)
    {
        services.AddSingleton<TimeProvider>(TimeProvider.System);

        // Auth / core
        services.AddScoped<IEmpresaRepository, EmpresaRepository>();
        services.AddScoped<IUsuarioRepository, UsuarioRepository>();
        services.AddScoped<ILoginService, LoginService>();
        services.AddScoped<IGetMeService, GetMeService>();
        services.AddScoped<IGetEmpresaPublicProfileService, GetEmpresaPublicProfileService>();
        services.AddScoped<IUpdateEmpresaPublicProfileService, UpdateEmpresaPublicProfileService>();
        services.AddScoped<IStorefrontDomainResolver, StorefrontDomainResolver>();
        services.AddScoped<IStorefrontDomainDnsVerificationService, StorefrontDomainDnsVerificationService>();
        services.AddScoped<IStorefrontDomainCertificateReadinessService, StorefrontDomainCertificateReadinessService>();
        services.AddScoped<IStorefrontDomainVerificationService, StorefrontDomainVerificationService>();
        services.AddScoped<IListPublicEmpresasService, ListPublicEmpresasService>();
        services.AddScoped<IGetPublicEmpresaByHostService, GetPublicEmpresaByHostService>();
        services.AddScoped<IGetPublicEmpresaBySlugService, GetPublicEmpresaBySlugService>();
        services.AddHostedService<StorefrontDomainVerificationWorker>();

        // Notifications
        services.AddScoped<Api.Modules.Empresas.Infrastructure.INotificationService, Api.Modules.Empresas.Infrastructure.EmailNotificationProvider>();
        services.AddScoped<Api.Modules.Empresas.Infrastructure.INotificationPublisher, Api.Modules.Empresas.Infrastructure.InMemoryNotificationPublisher>();
        // Register DomainNotificationConsumer in-process when enabled via env var
        var runNotificationWorker = string.Equals(System.Environment.GetEnvironmentVariable("NOTIFICATION_RUN_IN_PROCESS"), "true", StringComparison.OrdinalIgnoreCase);
        if (runNotificationWorker)
        {
            services.AddHostedService<Api.Workers.DomainNotificationConsumer>();
        }
        // Domain health / dashboard
        services.AddScoped<Api.Modules.Empresas.Infrastructure.IDomainHealthService, Api.Modules.Empresas.Infrastructure.DomainHealthService>();

        // Profissionais
        services.AddScoped<IProfissionalRepository, ProfissionalRepository>();
        services.AddScoped<ICreateProfissionalService, CreateProfissionalService>();
        services.AddScoped<IListProfissionaisService, ListProfissionaisService>();
        services.AddScoped<IGetProfissionalByIdService, GetProfissionalByIdService>();
        services.AddScoped<IUpdateProfissionalService, UpdateProfissionalService>();
        services.AddScoped<IAtivarProfissionalService, AtivarProfissionalService>();
        services.AddScoped<IDesativarProfissionalService, DesativarProfissionalService>();

        // Servicos
        services.AddScoped<IServicoRepository, ServicoRepository>();
        services.AddScoped<ICreateServicoService, CreateServicoService>();
        services.AddScoped<IListServicosService, ListServicosService>();
        services.AddScoped<IUpdateServicoService, UpdateServicoService>();
        services.AddScoped<IAtivarServicoService, AtivarServicoService>();
        services.AddScoped<IDesativarServicoService, DesativarServicoService>();

        // Disponibilidade
        services.AddScoped<IDisponibilidadeRepository, DisponibilidadeRepository>();
        services.AddScoped<ICreateDisponibilidadeService, CreateDisponibilidadeService>();
        services.AddScoped<IListDisponibilidadeService, ListDisponibilidadeService>();
        services.AddScoped<IDeleteDisponibilidadeService, DeleteDisponibilidadeService>();
        services.AddScoped<IUpdateDisponibilidadeService, UpdateDisponibilidadeService>();

        // Professional-service assignments
        services.AddScoped<IProfessionalServiceAssignmentRepository, ProfessionalServiceAssignmentRepository>();
        services.AddScoped<ICreateProfessionalServiceAssignmentService, CreateProfessionalServiceAssignmentService>();
        services.AddScoped<IListProfessionalServiceAssignmentsService, ListProfessionalServiceAssignmentsService>();
        services.AddScoped<IDeleteProfessionalServiceAssignmentService, DeleteProfessionalServiceAssignmentService>();

        // Bookings
        services.AddScoped<IBookingRepository, BookingRepository>();
        services.AddScoped<IInboxEntryRepository, InboxEntryRepository>();
        services.AddSingleton<IBookingRabbitMqConnectionFactory, BookingRabbitMqConnectionFactory>();
        services.AddSingleton<IBookingEventPublisher, RabbitMqBookingEventPublisher>();
        services.AddScoped<IBookingAvailabilityService, BookingAvailabilityService>();
        services.AddScoped<IBookingStatusAccessTokenService, BookingStatusAccessTokenService>();
        services.AddScoped<IBookingFeedbackAccessTokenService, BookingFeedbackAccessTokenService>();
        services.AddScoped<IGetPublicSlotsService, GetPublicSlotsService>();
        services.AddScoped<ICreateBookingService, CreateBookingService>();
        services.AddScoped<ICheckBookingStatusService, CheckBookingStatusService>();
        services.AddScoped<ICheckBookingFeedbackEligibilityService, CheckBookingFeedbackEligibilityService>();
        services.AddScoped<ISubmitBookingFeedbackService, SubmitBookingFeedbackService>();
        services.AddScoped<IGetBookingFeedbackSummaryService, GetBookingFeedbackSummaryService>();
        services.AddScoped<IListBookingFeedbackService, ListBookingFeedbackService>();
        services.AddScoped<IListBookingsService, ListBookingsService>();
        services.AddScoped<IGetBookingByIdService, GetBookingByIdService>();
        services.AddScoped<ICompleteBookingService, CompleteBookingService>();
        services.AddScoped<ICancelBookingService, CancelBookingService>();
        services.AddScoped<INoShowBookingService, NoShowBookingService>();
        services.AddScoped<IConfirmBookingFromEventService, ConfirmBookingFromEventService>();
        services.AddScoped<IRejectBookingFromEventService, RejectBookingFromEventService>();
        // Register booking queue consumer only when enabled (env var BOOKING_RUN_IN_PROCESS=true)
        var runBookingConsumer = string.Equals(System.Environment.GetEnvironmentVariable("BOOKING_RUN_IN_PROCESS"), "true", System.StringComparison.OrdinalIgnoreCase);
        if (runBookingConsumer)
        {
            services.AddHostedService<BookingQueueConsumerService>();
        }

        return services;
    }
}
