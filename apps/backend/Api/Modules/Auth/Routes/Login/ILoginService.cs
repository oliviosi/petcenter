namespace Api.Modules.Auth.Routes.Login;

public interface ILoginService
{
    Task<LoginResponse> HandleAsync(LoginRequest request);
}
