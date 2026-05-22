namespace Api.Modules.Disponibilidade.Routes.List;

public interface IListDisponibilidadeService
{
    Task<List<ListDisponibilidadeResponse>> HandleAsync(Guid profissionalId, Guid empresaId);
}
