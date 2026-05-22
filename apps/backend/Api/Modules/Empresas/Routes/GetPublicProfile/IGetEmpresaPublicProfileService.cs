namespace Api.Modules.Empresas.Routes.GetPublicProfile;

public interface IGetEmpresaPublicProfileService
{
    Task<GetEmpresaPublicProfileResponse> HandleAsync(Guid empresaId);
}
