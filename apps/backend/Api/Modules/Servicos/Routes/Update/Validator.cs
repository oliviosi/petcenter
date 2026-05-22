using FluentValidation;

namespace Api.Modules.Servicos.Routes.Update;

public class UpdateServicoRequestValidator : AbstractValidator<UpdateServicoRequest>
{
    public UpdateServicoRequestValidator()
    {
        RuleFor(x => x.Nome)
            .NotEmpty().WithMessage("Nome é obrigatório.")
            .MaximumLength(200).WithMessage("Nome deve ter no máximo 200 caracteres.");

        RuleFor(x => x.DuracaoMinutos)
            .GreaterThan(0).WithMessage("Duração deve ser maior que zero.");

        RuleFor(x => x.PrecoBase)
            .GreaterThanOrEqualTo(0).WithMessage("Preço base não pode ser negativo.");
    }
}
