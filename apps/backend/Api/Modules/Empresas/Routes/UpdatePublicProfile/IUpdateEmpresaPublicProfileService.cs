namespace Api.Modules.Empresas.Routes.UpdatePublicProfile;

public interface IUpdateEmpresaPublicProfileService
{
    Task<UpdateEmpresaPublicProfileResponse> HandleAsync(UpdateEmpresaPublicProfileRequest request);
}
