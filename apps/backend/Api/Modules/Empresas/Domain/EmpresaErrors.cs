using Api.Exceptions;

namespace Api.Modules.Empresas.Domain;

public class EmpresaNotFoundException : NotFoundException
{
    public EmpresaNotFoundException(Guid id)
        : base($"Empresa '{id}' não encontrada.") { }
}

public class EmpresaPublicaNotFoundException : NotFoundException
{
    public EmpresaPublicaNotFoundException(string slug)
        : base($"Empresa pública '{slug}' não encontrada.") { }
}

public class EmpresaSlugConflictException : ConflictException
{
    public EmpresaSlugConflictException(string slug)
        : base($"Slug '{slug}' já está em uso.") { }
}

public class EmpresaCustomDomainConflictException : ConflictException
{
    public EmpresaCustomDomainConflictException(string domain)
        : base($"Domínio personalizado '{domain}' já está em uso.") { }
}

public class EmpresaPerfilPublicoIncompletoException : DomainException
{
    public EmpresaPerfilPublicoIncompletoException()
        : base("Preencha slug, descrição, cidade, bairro, resumo de contato e resumo de endereço para publicar a empresa.") { }
}
