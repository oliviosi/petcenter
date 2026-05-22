using Api.Modules.Profissionais.Domain;
using Api.Modules.Profissionais.Infrastructure;

namespace Api.Modules.Profissionais.Routes.Update;

public class UpdateProfissionalService : IUpdateProfissionalService
{
    private readonly IProfissionalRepository _repo;

    public UpdateProfissionalService(IProfissionalRepository repo) => _repo = repo;

    public async Task<UpdateProfissionalResponse> HandleAsync(UpdateProfissionalRequest request)
    {
        var profissional = await _repo.GetByIdAsync(request.Id, request.EmpresaId)
            ?? throw new ProfissionalNotFoundException(request.Id);

        profissional.DefinirNome(request.Nome);
        if (request.Especialidade is not null)
            profissional.DefinirEspecialidade(request.Especialidade);

        await _repo.UpdateAsync(profissional);

        return new UpdateProfissionalResponse
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
