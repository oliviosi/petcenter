namespace Api.Modules.Empresas.Infrastructure;

public class EmpresaPublicRatingSummary
{
    public Guid EmpresaId { get; set; }
    public decimal AverageRating { get; set; }
    public int FeedbackCount { get; set; }
}
