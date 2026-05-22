namespace Api.Modules.Disponibilidade.Routes.Create;

public interface ICreateDisponibilidadeService
{
    Task<CreateDisponibilidadeResponse> HandleAsync(CreateDisponibilidadeRequest request);
}
