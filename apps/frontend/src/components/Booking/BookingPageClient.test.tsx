import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BookingPageClient } from "@/components/Booking/BookingPageClient";
import type {
  BookingSearchFilters,
  PublicPetshopDetail,
  SubmitBookingAction,
} from "@/types";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

const petshop: PublicPetshopDetail = {
  id: "12f7cc46-43f4-47d9-bf45-d582adf66b5b",
  name: "Pet Feliz",
  slug: "pet-feliz",
  description: "Cuidados completos para cães e gatos.",
  city: "São Paulo",
  neighborhood: "Centro",
  contactSummary: "(11) 99999-9999",
  addressSummary: "Rua das Flores, 123",
  averageRating: 4.7,
  feedbackCount: 18,
  professionals: [
    {
      id: "7a9b4cd2-fb0c-44fb-b63f-c0e6f76c39d1",
      name: "Ana",
      specialty: "Banho",
    },
  ],
  services: [
    {
      id: "3b461b0d-bb9b-4949-8d07-99b6eddb5759",
      name: "Banho",
      durationMinutes: 60,
      basePrice: 90,
    },
  ],
};

const filters: BookingSearchFilters = {
  serviceId: "3b461b0d-bb9b-4949-8d07-99b6eddb5759",
  professionalId: "",
  startDate: "2026-01-10",
  endDate: "2026-01-16",
};

describe("BookingPageClient", () => {
  it("shows validation messages when the user submits without required data", async () => {
    const submitBookingAction: SubmitBookingAction = vi.fn(async () => ({
      success: true,
      bookingId: "8baaf24a-c298-43be-9a71-6b644597fe15",
    }));

    render(
      <BookingPageClient
        petshop={petshop}
        filters={filters}
        slots={[]}
        submitBookingAction={submitBookingAction}
      />,
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Enviar solicitação de reserva" }),
    );

    await waitFor(() => {
      expect(
        screen.getByText("Contato do responsável é obrigatório."),
      ).toBeInTheDocument();
      expect(screen.getByText("Nome do pet é obrigatório.")).toBeInTheDocument();
      expect(
        screen.getByText("Espécie do pet é obrigatória."),
      ).toBeInTheDocument();
    });
  });

  it("renders a server failure message returned by the submit action", async () => {
    const submitBookingAction: SubmitBookingAction = vi.fn(async () => ({
      success: false,
      message: "O horário informado não está disponível para reserva.",
    }));

    render(
      <BookingPageClient
        petshop={petshop}
        filters={filters}
        slots={[
          {
            petshopId: petshop.id,
            professionalId: petshop.professionals[0].id,
            serviceId: petshop.services[0].id,
            slotStart: "2026-01-10T10:00:00Z",
            slotEnd: "2026-01-10T11:00:00Z",
          },
        ]}
        submitBookingAction={submitBookingAction}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: /Disponível/ }));
    await userEvent.type(
      screen.getByPlaceholderText("(11) 99999-9999 ou voce@email.com"),
      "(11) 99999-9999",
    );
    await userEvent.type(screen.getByPlaceholderText("Ex.: Amora"), "Amora");
    await userEvent.type(
      screen.getByPlaceholderText("Ex.: Cachorro"),
      "Cachorro",
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Enviar solicitação de reserva" }),
    );

    await waitFor(() => {
      expect(
        screen.getByText("O horário informado não está disponível para reserva."),
      ).toBeInTheDocument();
    });
  });
});
