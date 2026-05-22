using Api.Modules.Empresas.Infrastructure;

namespace Api.Modules.Empresas.Routes.ListPublic;

public class ListPublicEmpresasService : IListPublicEmpresasService
{
    private readonly IEmpresaRepository _repo;

    public ListPublicEmpresasService(IEmpresaRepository repo) => _repo = repo;

    public async Task<List<ListPublicEmpresasResponse>> HandleAsync(ListPublicEmpresasRequest request)
    {
        var empresas = await _repo.ListPublicAsync(request.Nome, request.Cidade, request.Bairro, request.Servico);
        var ratingSummaries = await _repo.GetPublicRatingSummariesAsync(empresas.Select(empresa => empresa.Id));

        var responses = empresas.Select(empresa =>
        {
            var ratingSummary = ratingSummaries.GetValueOrDefault(empresa.Id);

            return new ListPublicEmpresasResponse
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
                FeedbackCount = ratingSummary?.FeedbackCount
            };
        }).ToList();

        if (request.MinRating.HasValue)
            responses = responses
                .Where(response => response.AverageRating.HasValue && response.AverageRating.Value >= request.MinRating.Value)
                .ToList();

        return ApplyOrdering(responses, request.OrderBy, request.OrderDirection);
    }

    private static List<ListPublicEmpresasResponse> ApplyOrdering(
        List<ListPublicEmpresasResponse> responses,
        string? orderBy,
        string? orderDirection)
    {
        var normalizedOrderBy = string.IsNullOrWhiteSpace(orderBy)
            ? "name"
            : orderBy.Trim().ToLowerInvariant();

        var normalizedOrderDirection = string.IsNullOrWhiteSpace(orderDirection)
            ? normalizedOrderBy == "rating" ? "desc" : "asc"
            : orderDirection.Trim().ToLowerInvariant();

        if (normalizedOrderBy == "rating")
        {
            var ratedResponses = responses.Where(response => response.AverageRating.HasValue);
            var unratedResponses = responses.Where(response => !response.AverageRating.HasValue)
                .OrderBy(response => response.Nome);

            var orderedRatedResponses = normalizedOrderDirection == "asc"
                ? ratedResponses
                    .OrderBy(response => response.AverageRating)
                    .ThenByDescending(response => response.FeedbackCount)
                    .ThenBy(response => response.Nome)
                : ratedResponses
                    .OrderByDescending(response => response.AverageRating)
                    .ThenByDescending(response => response.FeedbackCount)
                    .ThenBy(response => response.Nome);

            return orderedRatedResponses.Concat(unratedResponses).ToList();
        }

        return normalizedOrderDirection == "desc"
            ? responses.OrderByDescending(response => response.Nome).ToList()
            : responses.OrderBy(response => response.Nome).ToList();
    }
}
