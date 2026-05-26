using Api.Modules.Empresas.Domain;
using Api.Modules.Empresas.Infrastructure;
using Api.Modules.Empresas.Routes.GetPublicBySlug;
using Api.Modules.Profissionais.Infrastructure;
using Api.Modules.Servicos.Infrastructure;

namespace Api.Modules.Empresas.Routes.GetPublicByHost;

public class GetPublicEmpresaByHostService : IGetPublicEmpresaByHostService
{
    private readonly IEmpresaRepository _empresaRepo;
    private readonly IProfissionalRepository _profissionalRepo;
    private readonly IServicoRepository _servicoRepo;

    public GetPublicEmpresaByHostService(
        IEmpresaRepository empresaRepo,
        IProfissionalRepository profissionalRepo,
        IServicoRepository servicoRepo)
    {
        _empresaRepo = empresaRepo;
        _profissionalRepo = profissionalRepo;
        _servicoRepo = servicoRepo;
    }

    public async Task<GetPublicEmpresaBySlugResponse> HandleAsync(string host)
    {
        var empresa = await _empresaRepo.GetPublicByHostAsync(host)
            ?? throw new EmpresaPublicaNotFoundException(host);

        var ratingSummary = await _empresaRepo.GetPublicRatingSummaryAsync(empresa.Id);
        var profissionais = await _profissionalRepo.ListAtivosByEmpresaAsync(empresa.Id);
        var servicos = await _servicoRepo.ListAtivosByEmpresaAsync(empresa.Id);

        return new GetPublicEmpresaBySlugResponse
        {
            Id = empresa.Id,
            Nome = empresa.Nome,
            Slug = empresa.Slug ?? string.Empty,
            Descricao = empresa.Descricao ?? string.Empty,
            Cidade = empresa.Cidade ?? string.Empty,
            Bairro = empresa.Bairro ?? string.Empty,
            ResumoContato = empresa.ResumoContato ?? string.Empty,
            ResumoEndereco = empresa.ResumoEndereco ?? string.Empty,
            AverageRating = ratingSummary?.AverageRating,
            FeedbackCount = ratingSummary?.FeedbackCount,
            Profissionais = profissionais.Select(profissional => new GetPublicEmpresaProfissionalResponse
            {
                Id = profissional.Id,
                Nome = profissional.Nome,
                Especialidade = profissional.Especialidade
            }).ToList(),
            Servicos = servicos.Select(servico => new GetPublicEmpresaServicoResponse
            {
                Id = servico.Id,
                Nome = servico.Nome,
                DuracaoMinutos = servico.DuracaoMinutos,
                PrecoBase = servico.PrecoBase
            }).ToList()
        };
    }
}
