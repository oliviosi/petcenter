namespace Api.Modules.Profissionais.Routes.Update;

public interface IUpdateProfissionalService
{
    Task<UpdateProfissionalResponse> HandleAsync(UpdateProfissionalRequest request);
}
