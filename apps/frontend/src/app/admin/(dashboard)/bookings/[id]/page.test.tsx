import React from "react";
import { render, screen } from "@testing-library/react";
import AdminBookingDetailPage from "@/app/admin/(dashboard)/bookings/[id]/page";

const { requireAdminSession, getAdminBookingById } = vi.hoisted(() => ({
  requireAdminSession: vi.fn(),
  getAdminBookingById: vi.fn(),
}));

vi.mock("@/lib/adminSession", () => ({
  requireAdminSession,
  getAdminLoginPath: () => "/admin/login?reason=session",
}));

vi.mock("@/lib/api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api")>("@/lib/api");

  return {
    ...actual,
    api: {
      ...actual.api,
      getAdminBookingById,
    },
  };
});

vi.mock("@/components/AdminBookings/BookingActionsPanel", () => ({
  BookingActionsPanel: () => <div>booking-actions-panel</div>,
}));

describe("AdminBookingDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireAdminSession.mockResolvedValue({
      token: "jwt-token",
      userId: "f08f83f4-a274-4a15-a2a8-bb4a4dc85ed1",
      empresaId: "7bd4a5ef-c8c8-4af8-954f-b44c2b487b22",
    });
  });

  it("renders operational details and terminal metadata", async () => {
    getAdminBookingById.mockResolvedValue({
      id: "72cb9334-8f80-445f-9e3a-a6e5042ed3f2",
      empresaId: "7bd4a5ef-c8c8-4af8-954f-b44c2b487b22",
      state: "cancelled",
      requestedAt: "2026-06-10T08:00:00Z",
      confirmedAt: "2026-06-10T08:05:00Z",
      slotStart: "2026-06-10T13:00:00Z",
      slotEnd: "2026-06-10T14:00:00Z",
      ownerContact: "(11) 96666-0000",
      professional: {
        id: "c6db98d4-60d4-4d94-b0b1-d2df84813fdb",
        name: "Ana",
        specialty: "Banho e tosa",
      },
      service: {
        id: "ba16fe64-5d2c-4892-a546-f7f8a3909808",
        name: "Banho",
        durationMinutes: 60,
        basePrice: 90,
      },
      pet: {
        clientId: "7c6c3910-0fdd-42d5-bf93-875c3339116d",
        name: "Amora",
        species: "Cachorro",
      },
      rejection: null,
      completion: null,
      cancellation: {
        cancelledAt: "2026-06-10T10:00:00Z",
        reason: "Cliente pediu remarcação.",
      },
      noShow: null,
    });

    render(
      await AdminBookingDetailPage({
        params: Promise.resolve({
          id: "72cb9334-8f80-445f-9e3a-a6e5042ed3f2",
        }),
        searchParams: Promise.resolve({
          updated: "cancel",
        }),
      }),
    );

    expect(screen.getByText("Reserva de Amora")).toBeInTheDocument();
    expect(screen.getByText("Reserva cancelada com sucesso.")).toBeInTheDocument();
    expect(screen.getByText("Cliente pediu remarcação.")).toBeInTheDocument();
    expect(screen.getByText("booking-actions-panel")).toBeInTheDocument();
  });
});
