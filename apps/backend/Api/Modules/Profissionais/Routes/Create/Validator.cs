using FluentValidation;

namespace Api.Modules.Profissionais.Routes.Create;

public class CreateProfissionalRequestValidator : AbstractValidator<CreateProfissionalRequest>
{
    public CreateProfissionalRequestValidator()
    {
        RuleFor(x => x.Nome)
            .NotEmpty().WithMessage("Nome é obrigatório.")
            .MaximumLength(200).WithMessage("Nome deve ter no máximo 200 caracteres.");

        RuleFor(x => x.Especialidade)
            .NotEmpty().WithMessage("Especialidade não pode ser vazia.")
            .MaximumLength(200).WithMessage("Especialidade deve ter no máximo 200 caracteres.")
            .When(x => x.Especialidade is not null);
    }
}
