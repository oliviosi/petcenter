namespace Api.Modules.Profissionais.Routes.Desativar;

public interface IDesativarProfissionalService
{
    Task HandleAsync(Guid id, Guid empresaId);
}
