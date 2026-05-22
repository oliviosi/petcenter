namespace Api.Modules.Servicos.Routes.Ativar;

public interface IAtivarServicoService
{
    Task HandleAsync(Guid id, Guid empresaId);
}
