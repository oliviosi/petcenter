namespace Api.Modules.Empresas.Routes.ListPublic;

public interface IListPublicEmpresasService
{
    Task<List<ListPublicEmpresasResponse>> HandleAsync(ListPublicEmpresasRequest request);
}
