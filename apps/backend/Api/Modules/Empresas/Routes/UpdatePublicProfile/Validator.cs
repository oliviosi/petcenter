using Api.Modules.Empresas.Domain;
using FluentValidation;

namespace Api.Modules.Empresas.Routes.UpdatePublicProfile;

public class UpdateEmpresaPublicProfileRequestValidator : AbstractValidator<UpdateEmpresaPublicProfileRequest>
{
    public UpdateEmpresaPublicProfileRequestValidator()
    {
        RuleFor(x => x.Slug)
            .NotEmpty().When(x => x.Publica).WithMessage("Slug é obrigatório quando a empresa estiver pública.")
            .MaximumLength(120).WithMessage("Slug deve ter no máximo 120 caracteres.")
            .Matches("^[a-z0-9]+(?:-[a-z0-9]+)*$").When(x => !string.IsNullOrWhiteSpace(x.Slug))
            .WithMessage("Slug deve conter apenas letras minúsculas, números e hífens.");

        RuleFor(x => x.Descricao)
            .NotEmpty().When(x => x.Publica).WithMessage("Descrição é obrigatória quando a empresa estiver pública.")
            .MaximumLength(1000).WithMessage("Descrição deve ter no máximo 1000 caracteres.");

        RuleFor(x => x.Cidade)
            .NotEmpty().When(x => x.Publica).WithMessage("Cidade é obrigatória quando a empresa estiver pública.")
            .MaximumLength(120).WithMessage("Cidade deve ter no máximo 120 caracteres.");

        RuleFor(x => x.Bairro)
            .NotEmpty().When(x => x.Publica).WithMessage("Bairro é obrigatório quando a empresa estiver pública.")
            .MaximumLength(120).WithMessage("Bairro deve ter no máximo 120 caracteres.");

        RuleFor(x => x.ResumoContato)
            .NotEmpty().When(x => x.Publica).WithMessage("Resumo de contato é obrigatório quando a empresa estiver pública.")
            .MaximumLength(300).WithMessage("Resumo de contato deve ter no máximo 300 caracteres.");

        RuleFor(x => x.ResumoEndereco)
            .NotEmpty().When(x => x.Publica).WithMessage("Resumo de endereço é obrigatório quando a empresa estiver pública.")
            .MaximumLength(300).WithMessage("Resumo de endereço deve ter no máximo 300 caracteres.");

        RuleFor(x => x.DominioPersonalizadoDesejado)
            .MaximumLength(253).WithMessage("Domínio personalizado deve ter no máximo 253 caracteres.")
            .Matches("^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\\.)+[a-z]{2,63}$")
            .When(x => !string.IsNullOrWhiteSpace(x.DominioPersonalizadoDesejado))
            .WithMessage("Domínio personalizado deve conter um host válido, como agenda.petshop.com.br ou petshop.com.br.")
            .Must(BeSupportedStorefrontDomain)
            .When(x => !string.IsNullOrWhiteSpace(x.DominioPersonalizadoDesejado))
            .WithMessage("Domínio personalizado deve ser um subdomínio válido ou um domínio raiz suportado, como agenda.petshop.com.br ou petshop.com.br.");
    }

    private static bool BeSupportedStorefrontDomain(string? domain) =>
        StorefrontCustomDomainAnalysis.TryCreate(domain) is not null;
}
