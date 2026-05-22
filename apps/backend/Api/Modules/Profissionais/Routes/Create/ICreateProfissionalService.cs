namespace Api.Modules.Profissionais.Routes.Create;

public interface ICreateProfissionalService
{
    Task<CreateProfissionalResponse> HandleAsync(CreateProfissionalRequest request);
}
