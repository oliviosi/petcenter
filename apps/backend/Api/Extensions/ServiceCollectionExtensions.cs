using Api.Modules.Auth.Routes.Login;
using Api.Modules.Auth.Routes.Me;
using Api.Modules.Empresas.Infrastructure;
using Api.Modules.Usuarios.Infrastructure;

namespace Api.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddModuleServices(this IServiceCollection services)
    {
        services.AddScoped<IEmpresaRepository, EmpresaRepository>();
        services.AddScoped<IUsuarioRepository, UsuarioRepository>();
        services.AddScoped<ILoginService, LoginService>();
        services.AddScoped<IGetMeService, GetMeService>();

        return services;
    }
}
