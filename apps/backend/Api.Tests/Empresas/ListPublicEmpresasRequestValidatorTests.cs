using Api.Modules.Empresas.Routes.ListPublic;

namespace Api.Tests.Empresas;

public class ListPublicEmpresasRequestValidatorTests
{
    private readonly ListPublicEmpresasRequestValidator _validator = new();

    [Theory]
    [InlineData(0)]
    [InlineData(5.1)]
    public void Validate_ShouldRejectMinRatingOutsideScale(decimal minRating)
    {
        var result = _validator.Validate(new ListPublicEmpresasRequest
        {
            MinRating = minRating
        });

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, error => error.PropertyName == nameof(ListPublicEmpresasRequest.MinRating));
    }

    [Fact]
    public void Validate_ShouldRejectUnsupportedOrderBy()
    {
        var result = _validator.Validate(new ListPublicEmpresasRequest
        {
            OrderBy = "distance"
        });

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, error => error.PropertyName == nameof(ListPublicEmpresasRequest.OrderBy));
    }

    [Fact]
    public void Validate_ShouldRejectUnsupportedOrderDirection()
    {
        var result = _validator.Validate(new ListPublicEmpresasRequest
        {
            OrderDirection = "sideways"
        });

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, error => error.PropertyName == nameof(ListPublicEmpresasRequest.OrderDirection));
    }
}
