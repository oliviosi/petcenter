namespace Api.Modules.Empresas.Routes.GetPublicBySlug;

public interface IGetPublicEmpresaBySlugService
{
    Task<GetPublicEmpresaBySlugResponse> HandleAsync(string slug);
}
