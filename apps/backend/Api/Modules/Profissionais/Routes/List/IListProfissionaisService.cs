namespace Api.Modules.Profissionais.Routes.List;

public interface IListProfissionaisService
{
    Task<List<ListProfissionaisResponse>> HandleAsync(Guid empresaId);
}
