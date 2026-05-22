using FluentValidation;

namespace Api.Modules.Disponibilidade.Routes.Create;

public class CreateDisponibilidadeRequestValidator : AbstractValidator<CreateDisponibilidadeRequest>
{
    public CreateDisponibilidadeRequestValidator()
    {
        RuleFor(x => x.DiaSemana)
            .InclusiveBetween(0, 6).WithMessage("Dia da semana deve estar entre 0 (domingo) e 6 (sábado).");

        RuleFor(x => x.HoraFim)
            .GreaterThan(x => x.HoraInicio).WithMessage("Hora de fim deve ser posterior à hora de início.");
    }
}
