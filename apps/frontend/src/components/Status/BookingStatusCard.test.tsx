import React from "react";
import { render, screen } from "@testing-library/react";
import { BookingStatusCard } from "@/components/Status/BookingStatusCard";
import type { BookingStatusSessionSummary, PublicBookingStatus } from "@/types";

const sessionSummary: BookingStatusSessionSummary = {
  statusToken: "token",
  petshopSlug: "pet-feliz",
  petshopName: "Pet Feliz",
  serviceName: "Banho",
  professionalName: "Ana",
  ownerContact: "(11) 99999-9999",
  petName: "Amora",
  petSpecies: "Cachorro",
};

const booking: PublicBookingStatus = {
  id: "a1d67d50-df27-48f1-bd13-e3fc5dd5b198",
  petshopId: "12f7cc46-43f4-47d9-bf45-d582adf66b5b",
  professionalId: "7a9b4cd2-fb0c-44fb-b63f-c0e6f76c39d1",
  serviceId: "3b461b0d-bb9b-4949-8d07-99b6eddb5759",
  state: "requested",
  requestedAt: "2026-01-10T08:00:00Z",
  confirmedAt: null,
  slotStart: "2026-01-10T10:00:00Z",
  slotEnd: "2026-01-10T11:00:00Z",
  rejection: null,
  cancellation: null,
  completion: null,
  noShow: null,
};

describe("BookingStatusCard", () => {
  it("renders the requested state copy", () => {
    render(<BookingStatusCard booking={booking} sessionSummary={sessionSummary} />);

    expect(screen.getByText("Solicitação recebida")).toBeInTheDocument();
    expect(
      screen.getByText(/aguarda análise do petshop/i),
    ).toBeInTheDocument();
    expect(screen.getByText("Pet Feliz")).toBeInTheDocument();
  });

  it("renders rejection details when available", () => {
    render(
      <BookingStatusCard
        booking={{
          ...booking,
          state: "rejected",
          rejection: {
            rejectedAt: "2026-01-10T08:30:00Z",
            reason: "Não há capacidade operacional neste horário.",
          },
        }}
        sessionSummary={sessionSummary}
      />,
    );

    expect(screen.getByText("Solicitação recusada")).toBeInTheDocument();
    expect(
      screen.getByText("Não há capacidade operacional neste horário."),
    ).toBeInTheDocument();
  });

  it("shows the feedback call-to-action for completed bookings with token", () => {
    render(
      <BookingStatusCard
        booking={{
          ...booking,
          state: "completed",
          completion: {
            completedAt: "2026-01-10T12:00:00Z",
          },
        }}
        sessionSummary={{
          ...sessionSummary,
          feedbackAccessToken: "feedback-token",
        }}
      />,
    );

    expect(screen.getByText("Feedback do atendimento")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Avaliar atendimento" }),
    ).toHaveAttribute("href", `/bookings/${booking.id}/feedback`);
  });

  it("explains when completed feedback is unavailable in the current browser", () => {
    render(
      <BookingStatusCard
        booking={{
          ...booking,
          state: "completed",
          completion: {
            completedAt: "2026-01-10T12:00:00Z",
          },
        }}
        sessionSummary={sessionSummary}
      />,
    );

    expect(
      screen.getByText(/só fica disponível no mesmo navegador/i),
    ).toBeInTheDocument();
  });
});
