namespace Api.Modules.Servicos.Routes.Update;

public interface IUpdateServicoService
{
    Task<UpdateServicoResponse> HandleAsync(UpdateServicoRequest request);
}
