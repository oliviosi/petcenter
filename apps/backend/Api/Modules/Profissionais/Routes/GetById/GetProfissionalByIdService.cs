using Api.Modules.Profissionais.Domain;
using Api.Modules.Profissionais.Infrastructure;

namespace Api.Modules.Profissionais.Routes.GetById;

public class GetProfissionalByIdService : IGetProfissionalByIdService
{
    private readonly IProfissionalRepository _repo;

    public GetProfissionalByIdService(IProfissionalRepository repo) => _repo = repo;

    public async Task<GetProfissionalByIdResponse> HandleAsync(Guid id, Guid empresaId)
    {
        var profissional = await _repo.GetByIdAsync(id, empresaId)
            ?? throw new ProfissionalNotFoundException(id);

        return new GetProfissionalByIdResponse
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
