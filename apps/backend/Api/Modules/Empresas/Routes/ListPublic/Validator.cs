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
    }
}
