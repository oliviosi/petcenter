using FluentValidation;

namespace Api.Modules.Empresas.Routes.ListPublic;

public class ListPublicEmpresasRequestValidator : AbstractValidator<ListPublicEmpresasRequest>
{
    public ListPublicEmpresasRequestValidator()
    {
        RuleFor(x => x.Nome)
            .MaximumLength(200).WithMessage("Nome deve ter no máximo 200 caracteres.")
            .When(x => x.Nome is not null);

        RuleFor(x => x.Cidade)
            .MaximumLength(120).WithMessage("Cidade deve ter no máximo 120 caracteres.")
            .When(x => x.Cidade is not null);

        RuleFor(x => x.Bairro)
            .MaximumLength(120).WithMessage("Bairro deve ter no máximo 120 caracteres.")
            .When(x => x.Bairro is not null);

        RuleFor(x => x.Servico)
            .MaximumLength(200).WithMessage("Serviço deve ter no máximo 200 caracteres.")
            .When(x => x.Servico is not null);

        RuleFor(x => x.MinRating)
            .InclusiveBetween(1m, 5m).WithMessage("A nota mínima deve estar entre 1 e 5.")
            .When(x => x.MinRating.HasValue);

        RuleFor(x => x.OrderBy)
            .Must(value => value is null || IsSupportedOrderBy(value))
            .WithMessage("Ordenação inválida. Use 'name' ou 'rating'.");

        RuleFor(x => x.OrderDirection)
            .Must(value => value is null || IsSupportedOrderDirection(value))
            .WithMessage("Direção de ordenação inválida. Use 'asc' ou 'desc'.");
    }

    private static bool IsSupportedOrderBy(string value)
    {
        var normalizedValue = value.Trim().ToLowerInvariant();
        return normalizedValue is "name" or "rating";
    }

    private static bool IsSupportedOrderDirection(string value)
    {
        var normalizedValue = value.Trim().ToLowerInvariant();
        return normalizedValue is "asc" or "desc";
    }
}
