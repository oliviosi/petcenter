import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BookingActionsPanel } from "@/components/AdminBookings/BookingActionsPanel";

const replace = vi.fn();
const refresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace,
    refresh,
    push: vi.fn(),
  }),
}));

describe("BookingActionsPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("validates the completion flow and redirects after success", async () => {
    const completeBookingAction = vi.fn(async () => ({
      success: true as const,
      redirectTo: "/admin/bookings/a1?updated=complete",
    }));

    render(
      <BookingActionsPanel
        bookingId="a1d67d50-df27-48f1-bd13-e3fc5dd5b198"
        state="confirmed"
        completeBookingAction={completeBookingAction}
        cancelBookingAction={vi.fn()}
        noShowBookingAction={vi.fn()}
      />,
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Confirmar conclusão" }),
    );

    await waitFor(() => {
      expect(screen.getByText("Preço final é obrigatório.")).toBeInTheDocument();
      expect(
        screen.getByText("Confirme a ação antes de continuar."),
      ).toBeInTheDocument();
    });

    await userEvent.type(screen.getByPlaceholderText("0,00"), "125.50");
    await userEvent.click(screen.getByRole("checkbox"));
    await userEvent.click(
      screen.getByRole("button", { name: "Confirmar conclusão" }),
    );

    await waitFor(() => {
      expect(completeBookingAction).toHaveBeenCalledWith({
        bookingId: "a1d67d50-df27-48f1-bd13-e3fc5dd5b198",
        finalChargedPrice: "125.5",
        confirm: true,
      });
      expect(replace).toHaveBeenCalledWith("/admin/bookings/a1?updated=complete");
    });
  });

  it("shows server feedback during the cancellation flow", async () => {
    const cancelBookingAction = vi.fn(async () => ({
      success: false as const,
      message: "A reserva já não pode mais ser cancelada.",
    }));

    render(
      <BookingActionsPanel
        bookingId="a1d67d50-df27-48f1-bd13-e3fc5dd5b198"
        state="requested"
        completeBookingAction={vi.fn()}
        cancelBookingAction={cancelBookingAction}
        noShowBookingAction={vi.fn()}
      />,
    );

    await userEvent.type(
      screen.getByPlaceholderText("Explique por que a reserva precisa ser cancelada."),
      "Cliente desistiu.",
    );
    await userEvent.click(screen.getByRole("checkbox"));
    await userEvent.click(
      screen.getByRole("button", { name: "Confirmar cancelamento" }),
    );

    await waitFor(() => {
      expect(cancelBookingAction).toHaveBeenCalled();
      expect(
        screen.getByText("A reserva já não pode mais ser cancelada."),
      ).toBeInTheDocument();
    });
  });
});
