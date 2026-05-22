namespace Api.Modules.Profissionais.Routes.GetById;

public interface IGetProfissionalByIdService
{
    Task<GetProfissionalByIdResponse> HandleAsync(Guid id, Guid empresaId);
}
