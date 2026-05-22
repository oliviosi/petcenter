using Api.Modules.Profissionais.Domain;
using Api.Modules.Profissionais.Infrastructure;

namespace Api.Modules.Profissionais.Routes.Create;

public class CreateProfissionalService : ICreateProfissionalService
{
    private readonly IProfissionalRepository _repo;

    public CreateProfissionalService(IProfissionalRepository repo) => _repo = repo;

    public async Task<CreateProfissionalResponse> HandleAsync(CreateProfissionalRequest request)
    {
        var profissional = new Profissional(request.EmpresaId, request.Nome, request.Especialidade);
        await _repo.AddAsync(profissional);

        return new CreateProfissionalResponse
        {
            Id = profissional.Id,
            EmpresaId = profissional.EmpresaId,
            Nome = profissional.Nome,
            Especialidade = profissional.Especialidade,
            Ativo = profissional.Ativo,
            CriadoEm = profissional.CriadoEm
        };
    }
}
