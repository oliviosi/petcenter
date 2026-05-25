import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ServicesPageClient } from "@/components/AdminServices/ServicesPageClient";

const refresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh,
    replace: vi.fn(),
    push: vi.fn(),
  }),
}));

describe("ServicesPageClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows empty and validation states for services setup", async () => {
    render(
      <ServicesPageClient
        services={[]}
        createServiceAction={vi.fn(async () => ({
          success: true,
          message: "ok",
        }))}
        updateServiceAction={vi.fn()}
        activateServiceAction={vi.fn()}
        deactivateServiceAction={vi.fn()}
      />,
    );

    expect(screen.getByText("Nenhum serviço cadastrado")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Salvar serviço" }));

    await waitFor(() => {
      expect(screen.getByText("Nome é obrigatório.")).toBeInTheDocument();
      expect(screen.getByText("Duração é obrigatória.")).toBeInTheDocument();
      expect(screen.getByText("Preço base é obrigatório.")).toBeInTheDocument();
    });
  });

  it("requires confirmation before deactivating a service", async () => {
    const deactivateServiceAction = vi.fn(async () => ({
      success: true as const,
      message: "Serviço desativado com sucesso.",
    }));

    render(
      <ServicesPageClient
        services={[
          {
            id: "cf9e540b-6255-4498-9ed9-c843ecdd657d",
            companyId: "5a06cc97-b072-4a86-bd2a-3b852dc602f7",
            name: "Banho premium",
            durationMinutes: 60,
            basePrice: 120,
            isActive: true,
            createdAt: "2026-06-10T09:00:00Z",
          },
        ]}
        createServiceAction={vi.fn()}
        updateServiceAction={vi.fn()}
        activateServiceAction={vi.fn()}
        deactivateServiceAction={deactivateServiceAction}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Desativar" }));

    expect(screen.getAllByText("Confirmar desativação")).toHaveLength(2);

    await userEvent.click(
      screen.getByRole("button", { name: "Confirmar desativação" }),
    );

    await waitFor(() => {
      expect(deactivateServiceAction).toHaveBeenCalledWith(
        "cf9e540b-6255-4498-9ed9-c843ecdd657d",
      );
      expect(screen.getByText("Serviço desativado com sucesso.")).toBeInTheDocument();
      expect(refresh).toHaveBeenCalled();
    });
  });
});
