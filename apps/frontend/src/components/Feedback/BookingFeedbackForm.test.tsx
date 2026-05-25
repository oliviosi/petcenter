import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BookingFeedbackForm } from "@/components/Feedback/BookingFeedbackForm";
import type {
  BookingStatusSessionSummary,
  SubmitBookingFeedbackAction,
} from "@/types";

const sessionSummary: BookingStatusSessionSummary = {
  statusToken: "status-token",
  feedbackAccessToken: "feedback-token",
  petshopSlug: "pet-feliz",
  petshopName: "Pet Feliz",
  serviceName: "Banho",
  professionalName: "Ana",
  ownerContact: "(11) 99999-9999",
  petName: "Amora",
  petSpecies: "Cachorro",
};

describe("BookingFeedbackForm", () => {
  it("shows validation messages when the user submits without ratings", async () => {
    const submitFeedbackAction: SubmitBookingFeedbackAction = vi.fn(async () => ({
      success: true,
      feedback: {
        bookingId: "a1d67d50-df27-48f1-bd13-e3fc5dd5b198",
        professionalRating: 5,
        petshopRating: 5,
        comment: null,
        submittedAt: "2026-01-10T12:30:00Z",
      },
    }));

    render(
      <BookingFeedbackForm
        bookingId="a1d67d50-df27-48f1-bd13-e3fc5dd5b198"
        feedbackAccessToken="feedback-token"
        sessionSummary={sessionSummary}
        submitFeedbackAction={submitFeedbackAction}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Enviar feedback" }));

    await waitFor(() => {
      expect(
        screen.getByText("Avalie o atendimento do profissional."),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Avalie a experiência com o petshop."),
      ).toBeInTheDocument();
    });
  });

  it("shows the success state after a valid submission", async () => {
    const submitFeedbackAction: SubmitBookingFeedbackAction = vi.fn(async () => ({
      success: true,
      feedback: {
        bookingId: "a1d67d50-df27-48f1-bd13-e3fc5dd5b198",
        professionalRating: 5,
        petshopRating: 4,
        comment: "Equipe muito atenciosa.",
        submittedAt: "2026-01-10T12:30:00Z",
      },
    }));

    render(
      <BookingFeedbackForm
        bookingId="a1d67d50-df27-48f1-bd13-e3fc5dd5b198"
        feedbackAccessToken="feedback-token"
        sessionSummary={sessionSummary}
        submitFeedbackAction={submitFeedbackAction}
      />,
    );

    const professionalOptions = screen.getAllByRole("radio", {
      name: /5 excelente/i,
    });
    const petshopOptions = screen.getAllByRole("radio", {
      name: /4 muito bom/i,
    });

    await userEvent.click(professionalOptions[0]);
    await userEvent.click(petshopOptions[1]);
    await userEvent.type(
      screen.getByPlaceholderText("Conte o que mais gostou ou o que pode melhorar."),
      "Equipe muito atenciosa.",
    );
    await userEvent.click(screen.getByRole("button", { name: "Enviar feedback" }));

    await waitFor(() => {
      expect(
        screen.getByText("Feedback enviado com sucesso"),
      ).toBeInTheDocument();
    });
  });
});
