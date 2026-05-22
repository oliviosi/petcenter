namespace Api.Modules.Profissionais.Routes.Ativar;

public interface IAtivarProfissionalService
{
    Task HandleAsync(Guid id, Guid empresaId);
}
