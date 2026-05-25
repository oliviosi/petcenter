import React from "react";
import { render, screen } from "@testing-library/react";
import BookingFeedbackPage from "@/app/(public)/bookings/[bookingId]/feedback/page";
import { ApiRequestError } from "@/lib/api";

const { getBookingSession, checkBookingFeedbackEligibility } = vi.hoisted(
  () => ({
    getBookingSession: vi.fn(),
    checkBookingFeedbackEligibility: vi.fn(),
  }),
);

vi.mock("@/lib/bookingSession", () => ({
  getBookingSession,
}));

vi.mock("@/lib/api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api")>("@/lib/api");

  return {
    ...actual,
    api: {
      checkBookingFeedbackEligibility,
    },
  };
});

vi.mock("@/components/Feedback/BookingFeedbackForm", () => ({
  BookingFeedbackForm: ({ bookingId }: { bookingId: string }) => (
    <div>feedback-form-{bookingId}</div>
  ),
}));

vi.mock("@/app/(public)/bookings/[bookingId]/feedback/actions", () => ({
  submitBookingFeedbackAction: vi.fn(),
}));

describe("BookingFeedbackPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    getBookingSession.mockResolvedValue({
      statusToken: "status-token",
      feedbackAccessToken: "feedback-token",
      petshopSlug: "pet-feliz",
      petshopName: "Pet Feliz",
      serviceName: "Banho",
      professionalName: "Ana",
      ownerContact: "(11) 99999-9999",
      petName: "Amora",
      petSpecies: "Cachorro",
    });
  });

  it("renders the feedback form when the booking is eligible", async () => {
    checkBookingFeedbackEligibility.mockResolvedValue({
      bookingId: "a1d67d50-df27-48f1-bd13-e3fc5dd5b198",
      canSubmit: true,
      reason: null,
    });

    render(
      await BookingFeedbackPage({
        params: Promise.resolve({
          bookingId: "a1d67d50-df27-48f1-bd13-e3fc5dd5b198",
        }),
      }),
    );

    expect(screen.getByText("Avaliar atendimento")).toBeInTheDocument();
    expect(
      screen.getByText(
        "feedback-form-a1d67d50-df27-48f1-bd13-e3fc5dd5b198",
      ),
    ).toBeInTheDocument();
  });

  it("shows the invalid token state when eligibility rejects the token", async () => {
    checkBookingFeedbackEligibility.mockRejectedValue(
      new ApiRequestError({
        title: "Token de feedback inválido.",
        status: 401,
      }),
    );

    render(
      await BookingFeedbackPage({
        params: Promise.resolve({
          bookingId: "a1d67d50-df27-48f1-bd13-e3fc5dd5b198",
        }),
      }),
    );

    expect(
      screen.getByText("O link de feedback não é mais válido"),
    ).toBeInTheDocument();
  });

  it("shows the already submitted state when feedback is no longer available", async () => {
    checkBookingFeedbackEligibility.mockResolvedValue({
      bookingId: "a1d67d50-df27-48f1-bd13-e3fc5dd5b198",
      canSubmit: false,
      reason: "Feedback já enviado para esta reserva.",
    });

    render(
      await BookingFeedbackPage({
        params: Promise.resolve({
          bookingId: "a1d67d50-df27-48f1-bd13-e3fc5dd5b198",
        }),
      }),
    );

    expect(screen.getByText("Já recebemos a sua avaliação")).toBeInTheDocument();
    expect(screen.getByText("Feedback já enviado")).toBeInTheDocument();
  });
});
