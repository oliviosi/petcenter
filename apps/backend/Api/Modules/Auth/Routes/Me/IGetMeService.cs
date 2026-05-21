namespace Api.Modules.Auth.Routes.Me;

public interface IGetMeService
{
    Task<GetMeResponse> HandleAsync(GetMeRequest request);
}
