import React from "react";
import { render, screen } from "@testing-library/react";
import AdminBookingsPage from "@/app/admin/(dashboard)/bookings/page";

const { requireAdminSession, listAdminBookings } = vi.hoisted(() => ({
  requireAdminSession: vi.fn(),
  listAdminBookings: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: vi.fn(),
    refresh: vi.fn(),
    push: vi.fn(),
  }),
  redirect: vi.fn(),
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
      listAdminBookings,
    },
  };
});

describe("AdminBookingsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireAdminSession.mockResolvedValue({
      token: "jwt-token",
      userId: "848bb286-97d7-4863-b023-a3eb5dca4564",
      empresaId: "2f07f803-8df8-4ded-ad43-cde8c4474d28",
    });
  });

  it("renders the default upcoming queue for authenticated users", async () => {
    const booking = {
      id: "5f8c0c83-09f6-4a14-baf8-46914d5cb234",
      state: "confirmed" as const,
      requestedAt: "2026-06-10T09:00:00Z",
      confirmedAt: "2026-06-10T09:05:00Z",
      slotStart: "2026-06-11T13:00:00Z",
      slotEnd: "2026-06-11T14:00:00Z",
      ownerContact: "(11) 98888-0000",
      professional: {
        id: "08da93aa-cf47-4e15-a273-3a90d9f7b282",
        name: "Ana",
        specialty: "Banho e tosa",
      },
      service: {
        id: "84c832be-6dfd-44e0-9604-3878304dddc6",
        name: "Banho",
        durationMinutes: 60,
        basePrice: 90,
      },
      pet: {
        name: "Amora",
        species: "Cachorro",
      },
      rejection: null,
      completion: null,
      cancellation: null,
      noShow: null,
    };

    listAdminBookings.mockResolvedValueOnce([booking]).mockResolvedValueOnce([booking]);

    render(
      await AdminBookingsPage({
        searchParams: Promise.resolve({}),
      }),
    );

    expect(screen.getByText("Fila de reservas")).toBeInTheDocument();
    expect(screen.getByText("Amora • Banho")).toBeInTheDocument();
    expect(screen.getByDisplayValue(new Date().toISOString().slice(0, 10))).toBeInTheDocument();
    expect(listAdminBookings).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        startDate: new Date().toISOString().slice(0, 10),
      }),
      "jwt-token",
    );
  });

  it("applies explicit filters and shows the filtered empty state", async () => {
    listAdminBookings.mockResolvedValueOnce([]).mockResolvedValueOnce([
      {
        id: "588d1116-4514-4f16-9c95-d321f3d76034",
        state: "rejected" as const,
        requestedAt: "2026-06-01T09:00:00Z",
        confirmedAt: null,
        slotStart: "2026-06-01T10:00:00Z",
        slotEnd: "2026-06-01T11:00:00Z",
        ownerContact: "(11) 97777-0000",
        professional: {
          id: "4f11ea9f-f9be-4b95-a3cc-c954c4d71b34",
          name: "João",
          specialty: "Tosa",
        },
        service: {
          id: "3e0682c7-f5ba-4dbd-8d50-9dcce7ad5d3a",
          name: "Tosa",
          durationMinutes: 45,
          basePrice: 120,
        },
        pet: {
          name: "Luna",
          species: "Gato",
        },
        rejection: {
          rejectedAt: "2026-06-01T09:10:00Z",
          reason: "Profissional indisponível.",
        },
        completion: null,
        cancellation: null,
        noShow: null,
      },
    ]);

    render(
      await AdminBookingsPage({
        searchParams: Promise.resolve({
          state: "rejected",
          startDate: "2026-06-01",
          endDate: "2026-06-02",
          professionalId: "4f11ea9f-f9be-4b95-a3cc-c954c4d71b34",
        }),
      }),
    );

    expect(screen.getByText("Nenhuma reserva encontrada")).toBeInTheDocument();
    expect(listAdminBookings).toHaveBeenNthCalledWith(
      1,
      {
        state: "rejected",
        startDate: "2026-06-01",
        endDate: "2026-06-02",
        professionalId: "4f11ea9f-f9be-4b95-a3cc-c954c4d71b34",
      },
      "jwt-token",
    );
  });
});
