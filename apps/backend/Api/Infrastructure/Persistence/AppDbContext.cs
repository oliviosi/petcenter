using Api.Modules.Disponibilidade.Domain;
using Api.Modules.Disponibilidade.Infrastructure;
using Api.Modules.Bookings.Domain;
using Api.Modules.Bookings.Infrastructure;
using Api.Modules.Empresas.Domain;
using Api.Modules.Empresas.Infrastructure;
using Api.Modules.ProfessionalServiceAssignments.Domain;
using Api.Modules.ProfessionalServiceAssignments.Infrastructure;
using Api.Modules.Profissionais.Domain;
using Api.Modules.Profissionais.Infrastructure;
using Api.Modules.Servicos.Domain;
using Api.Modules.Servicos.Infrastructure;
using Api.Modules.Usuarios.Domain;
using Api.Modules.Usuarios.Infrastructure;
using Api.Modules.Clients.Domain;
using Api.Modules.Clients.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Api.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Empresa> Empresas => Set<Empresa>();
    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<Cliente> Clientes => Set<Cliente>();
    public DbSet<Profissional> Profissionais => Set<Profissional>();
    public DbSet<Servico> Servicos => Set<Servico>();
    public DbSet<DisponibilidadeProfissional> DisponibilidadesProfissionais => Set<DisponibilidadeProfissional>();
    public DbSet<ProfessionalServiceAssignment> ProfessionalServiceAssignments => Set<ProfessionalServiceAssignment>();
    public DbSet<Booking> Bookings => Set<Booking>();
    public DbSet<BookingFeedback> BookingFeedbacks => Set<BookingFeedback>();
    public DbSet<InboxEntry> InboxEntries => Set<InboxEntry>();
    public DbSet<Api.Modules.Empresas.Domain.DomainNotification> DomainNotifications => Set<Api.Modules.Empresas.Domain.DomainNotification>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new EmpresaConfiguration());
        modelBuilder.ApplyConfiguration(new UsuarioConfiguration());
        modelBuilder.ApplyConfiguration(new ClienteConfiguration());
        modelBuilder.ApplyConfiguration(new ProfissionalConfiguration());
        modelBuilder.ApplyConfiguration(new ServicoConfiguration());
        modelBuilder.ApplyConfiguration(new DisponibilidadeConfiguration());
        modelBuilder.ApplyConfiguration(new ProfessionalServiceAssignmentConfiguration());
        modelBuilder.ApplyConfiguration(new BookingConfiguration());
        modelBuilder.ApplyConfiguration(new BookingFeedbackConfiguration());
        modelBuilder.ApplyConfiguration(new InboxEntryConfiguration());
            modelBuilder.ApplyConfiguration(new Api.Modules.Empresas.Infrastructure.DomainNotificationConfiguration());
    }
}
