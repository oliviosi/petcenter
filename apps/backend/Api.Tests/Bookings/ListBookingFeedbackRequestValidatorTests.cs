using Api.Modules.Bookings.Routes.ListFeedback;

namespace Api.Tests.Bookings;

public class ListBookingFeedbackRequestValidatorTests
{
    [Fact]
    public async Task ValidateAsync_ShouldRejectEndDateBeforeStartDate()
    {
        var sut = new ListBookingFeedbackRequestValidator();
        var request = new ListBookingFeedbackRequest
        {
            StartDate = new DateOnly(2026, 1, 7),
            EndDate = new DateOnly(2026, 1, 6)
        };

        var response = await sut.ValidateAsync(request);

        var error = Assert.Single(response.Errors);
        Assert.Equal(nameof(ListBookingFeedbackRequest.EndDate), error.PropertyName);
        Assert.Equal("Data final deve ser igual ou posterior à data inicial.", error.ErrorMessage);
    }

    [Fact]
    public void Request_ShouldNotExposeEmpresaIdForClientBinding()
    {
        var propertyNames = typeof(ListBookingFeedbackRequest)
            .GetProperties()
            .Select(property => property.Name)
            .ToArray();

        Assert.DoesNotContain("EmpresaId", propertyNames);
    }
}
