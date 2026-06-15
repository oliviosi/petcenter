namespace Api.Modules.Clients.Routes.Login;

public class LoginResponse
{
    public string Token { get; set; } = string.Empty;
    public Guid ClientId { get; set; }
}
