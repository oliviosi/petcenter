namespace Api.Modules.Auth.Routes.Login;

public class LoginResponse
{
    public string Token { get; set; } = string.Empty;
    public Guid UserId { get; set; }
    public Guid EmpresaId { get; set; }
}
