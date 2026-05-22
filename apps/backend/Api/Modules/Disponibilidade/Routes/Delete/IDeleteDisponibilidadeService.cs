namespace Api.Modules.Disponibilidade.Routes.Delete;

public interface IDeleteDisponibilidadeService
{
    Task HandleAsync(Guid id, Guid profissionalId, Guid empresaId);
}
