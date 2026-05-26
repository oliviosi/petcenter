import React from "react";
import { render, screen } from "@testing-library/react";
import AdminFeedbackPage from "@/app/admin/(dashboard)/feedback/page";
import { ApiRequestError } from "@/lib/api";

const { requireAdminSession, getAdminFeedbackSummary, listAdminFeedback } = vi.hoisted(() => ({
  requireAdminSession: vi.fn(),
  getAdminFeedbackSummary: vi.fn(),
  listAdminFeedback: vi.fn(),
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
      getAdminFeedbackSummary,
      listAdminFeedback,
    },
  };
});

describe("AdminFeedbackPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireAdminSession.mockResolvedValue({
      token: "jwt-token",
      userId: "848bb286-97d7-4863-b023-a3eb5dca4564",
      empresaId: "2f07f803-8df8-4ded-ad43-cde8c4474d28",
    });
  });

  it("renders the tenant feedback summary and booking-backed entries", async () => {
    getAdminFeedbackSummary.mockResolvedValue({
      petshop: {
        averageRating: 4.8,
        feedbackCount: 12,
        isRated: true,
      },
      professionals: [
        {
          professionalId: "08da93aa-cf47-4e15-a273-3a90d9f7b282",
          name: "Ana",
          specialty: "Banho e tosa",
          averageRating: 4.9,
          feedbackCount: 7,
          isRated: true,
        },
      ],
    });
    listAdminFeedback.mockResolvedValue([
      {
        bookingId: "5f8c0c83-09f6-4a14-baf8-46914d5cb234",
        professional: {
          id: "08da93aa-cf47-4e15-a273-3a90d9f7b282",
          name: "Ana",
          specialty: "Banho e tosa",
        },
        petshopRating: 5,
        professionalRating: 4,
        comment: "Atendimento muito cuidadoso com a Amora.",
        submittedAt: "2026-06-11T16:00:00Z",
      },
    ]);

    render(
      await AdminFeedbackPage({
        searchParams: Promise.resolve({}),
      }),
    );

    expect(screen.getByText("Feedback dos clientes")).toBeInTheDocument();
    expect(screen.getByText("4.8 ★")).toBeInTheDocument();
    expect(screen.getAllByText("Ana")).toHaveLength(3);
    expect(
      screen.getByText("Atendimento muito cuidadoso com a Amora."),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Abrir reserva" })).toHaveAttribute(
      "href",
      "/admin/bookings/5f8c0c83-09f6-4a14-baf8-46914d5cb234",
    );
    expect(getAdminFeedbackSummary).toHaveBeenCalledWith("jwt-token");
    expect(listAdminFeedback).toHaveBeenCalledWith(
      {
        startDate: "",
        endDate: "",
        professionalId: "",
      },
      "jwt-token",
    );
  });

  it("shows the filtered empty state when no feedback matches the current query", async () => {
    getAdminFeedbackSummary.mockResolvedValue({
      petshop: {
        averageRating: null,
        feedbackCount: 0,
        isRated: false,
      },
      professionals: [],
    });
    listAdminFeedback.mockResolvedValue([]);

    render(
      await AdminFeedbackPage({
        searchParams: Promise.resolve({
          startDate: "2026-06-01",
          endDate: "2026-06-02",
          professionalId: "4f11ea9f-f9be-4b95-a3cc-c954c4d71b34",
        }),
      }),
    );

    expect(screen.getByText("Nenhum feedback encontrado")).toBeInTheDocument();
    expect(screen.getByText("Sem avaliações")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Limpar filtros" })).toHaveAttribute(
      "href",
      "/admin/feedback",
    );
    expect(listAdminFeedback).toHaveBeenCalledWith(
      {
        startDate: "2026-06-01",
        endDate: "2026-06-02",
        professionalId: "4f11ea9f-f9be-4b95-a3cc-c954c4d71b34",
      },
      "jwt-token",
    );
  });

  it("renders a recoverable error state when the dashboard cannot be loaded", async () => {
    getAdminFeedbackSummary.mockRejectedValue(
      new ApiRequestError({
        title: "Falha temporária ao consultar o feedback.",
        status: 500,
      }),
    );

    render(
      await AdminFeedbackPage({
        searchParams: Promise.resolve({ startDate: "2026-06-01" }),
      }),
    );

    expect(
      screen.getByText("Não foi possível carregar o painel de feedback"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Falha temporária ao consultar o feedback."),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tentar novamente" })).toHaveAttribute(
      "href",
      "/admin/feedback?startDate=2026-06-01",
    );
  });
});
