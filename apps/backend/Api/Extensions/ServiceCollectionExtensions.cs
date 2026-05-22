using Api.Modules.Auth.Routes.Login;
using Api.Modules.Auth.Routes.Me;
using Api.Modules.Disponibilidade.Infrastructure;
using Api.Modules.Disponibilidade.Routes.Create;
using Api.Modules.Disponibilidade.Routes.Delete;
using Api.Modules.Disponibilidade.Routes.List;
using Api.Modules.Disponibilidade.Routes.Update;
using Api.Modules.Empresas.Infrastructure;
using Api.Modules.Empresas.Routes.GetPublicBySlug;
using Api.Modules.Empresas.Routes.GetPublicProfile;
using Api.Modules.Empresas.Routes.ListPublic;
using Api.Modules.Empresas.Routes.UpdatePublicProfile;
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
        // Auth / core
        services.AddScoped<IEmpresaRepository, EmpresaRepository>();
        services.AddScoped<IUsuarioRepository, UsuarioRepository>();
        services.AddScoped<ILoginService, LoginService>();
        services.AddScoped<IGetMeService, GetMeService>();
        services.AddScoped<IGetEmpresaPublicProfileService, GetEmpresaPublicProfileService>();
        services.AddScoped<IUpdateEmpresaPublicProfileService, UpdateEmpresaPublicProfileService>();
        services.AddScoped<IListPublicEmpresasService, ListPublicEmpresasService>();
        services.AddScoped<IGetPublicEmpresaBySlugService, GetPublicEmpresaBySlugService>();

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

        return services;
    }
}
