namespace Api.Modules.Servicos.Routes.Desativar;

public interface IDesativarServicoService
{
    Task HandleAsync(Guid id, Guid empresaId);
}
