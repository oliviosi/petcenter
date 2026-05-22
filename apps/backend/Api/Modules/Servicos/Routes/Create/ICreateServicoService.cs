namespace Api.Modules.Servicos.Routes.Create;

public interface ICreateServicoService
{
    Task<CreateServicoResponse> HandleAsync(CreateServicoRequest request);
}
