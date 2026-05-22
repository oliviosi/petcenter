namespace Api.Modules.Disponibilidade.Routes.Update;

public interface IUpdateDisponibilidadeService
{
    Task<UpdateDisponibilidadeResponse> HandleAsync(UpdateDisponibilidadeRequest request);
}
