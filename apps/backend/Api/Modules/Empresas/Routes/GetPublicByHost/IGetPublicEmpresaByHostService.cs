using Api.Modules.Empresas.Routes.GetPublicBySlug;

namespace Api.Modules.Empresas.Routes.GetPublicByHost;

public interface IGetPublicEmpresaByHostService
{
    Task<GetPublicEmpresaBySlugResponse> HandleAsync(string host);
}
