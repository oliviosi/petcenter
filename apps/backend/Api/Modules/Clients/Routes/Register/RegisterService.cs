using Api.Modules.Clients.Domain;
using Api.Modules.Clients.Infrastructure;
using BCrypt.Net;

namespace Api.Modules.Clients.Routes.Register;

public interface IClientRegisterService
{
    Task<Guid> HandleAsync(RegisterRequest request);
}

public class RegisterService : IClientRegisterService
{
    private readonly IClienteRepository _repo;

    public RegisterService(IClienteRepository repo) => _repo = repo;

    public async Task<Guid> HandleAsync(RegisterRequest request)
    {
        var existing = await _repo.GetByEmailAsync(request.Email);
        if (existing is not null)
            throw new InvalidOperationException("Email já cadastrado.");

        var hash = BCrypt.Net.BCrypt.HashPassword(request.Password);
        var cliente = new Cliente(request.Email, hash, request.Nome);
        await _repo.AddAsync(cliente);
        return cliente.Id;
    }
}
