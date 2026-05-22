using Api.Modules.Servicos.Domain;
using Api.Modules.Servicos.Infrastructure;

namespace Api.Modules.Servicos.Routes.Create;

public class CreateServicoService : ICreateServicoService
{
    private readonly IServicoRepository _repo;

    public CreateServicoService(IServicoRepository repo) => _repo = repo;

    public async Task<CreateServicoResponse> HandleAsync(CreateServicoRequest request)
    {
        var servico = new Servico(request.EmpresaId, request.Nome, request.DuracaoMinutos, request.PrecoBase);
        await _repo.AddAsync(servico);

        return new CreateServicoResponse
        {
            Id = servico.Id,
            EmpresaId = servico.EmpresaId,
            Nome = servico.Nome,
            DuracaoMinutos = servico.DuracaoMinutos,
            PrecoBase = servico.PrecoBase,
            Ativo = servico.Ativo,
            CriadoEm = servico.CriadoEm
        };
    }
}
