using Api.Modules.Servicos.Domain;
using Api.Modules.Servicos.Infrastructure;

namespace Api.Modules.Servicos.Routes.Update;

public class UpdateServicoService : IUpdateServicoService
{
    private readonly IServicoRepository _repo;

    public UpdateServicoService(IServicoRepository repo) => _repo = repo;

    public async Task<UpdateServicoResponse> HandleAsync(UpdateServicoRequest request)
    {
        var servico = await _repo.GetByIdAsync(request.Id, request.EmpresaId)
            ?? throw new ServicoNotFoundException(request.Id);

        servico.DefinirNome(request.Nome);
        servico.DefinirDuracao(request.DuracaoMinutos);
        servico.DefinirPreco(request.PrecoBase);
        await _repo.UpdateAsync(servico);

        return new UpdateServicoResponse
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
