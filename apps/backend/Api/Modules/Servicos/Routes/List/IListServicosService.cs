namespace Api.Modules.Servicos.Routes.List;

public interface IListServicosService
{
    Task<List<ListServicosResponse>> HandleAsync(Guid empresaId);
}
