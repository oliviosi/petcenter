using Api.Exceptions;
using Api.Modules.Empresas.Domain;
using Api.Modules.Empresas.Infrastructure;
using Api.Modules.Usuarios.Domain;
using Api.Modules.Usuarios.Infrastructure;

namespace Api.Modules.Auth.Routes.Me;

public class GetMeService : IGetMeService
{
    private readonly IUsuarioRepository _usuarioRepo;
    private readonly IEmpresaRepository _empresaRepo;

    public GetMeService(IUsuarioRepository usuarioRepo, IEmpresaRepository empresaRepo)
    {
        _usuarioRepo = usuarioRepo;
        _empresaRepo = empresaRepo;
    }

    public async Task<GetMeResponse> HandleAsync(GetMeRequest request)
    {
        var usuario = await _usuarioRepo.GetByIdAsync(request.UserId, request.EmpresaId);
        if (usuario is null)
            throw new UsuarioNotFoundException();

        var empresa = await _empresaRepo.GetByIdAsync(request.EmpresaId);
        if (empresa is null)
            throw new EmpresaNotFoundException(request.EmpresaId);

        return new GetMeResponse
        {
            UserId = usuario.Id,
            Email = usuario.Email,
            Empresa = new EmpresaSummary
            {
                Id = empresa.Id,
                Nome = empresa.Nome
            }
        };
    }
}
