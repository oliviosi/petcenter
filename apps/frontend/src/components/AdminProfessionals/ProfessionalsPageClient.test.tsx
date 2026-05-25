import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProfessionalsPageClient } from "@/components/AdminProfessionals/ProfessionalsPageClient";

const refresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh,
    replace: vi.fn(),
    push: vi.fn(),
  }),
}));

describe("ProfessionalsPageClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows empty and validation states for professionals setup", async () => {
    render(
      <ProfessionalsPageClient
        professionals={[]}
        createProfessionalAction={vi.fn(async () => ({
          success: true,
          message: "ok",
        }))}
        updateProfessionalAction={vi.fn()}
        activateProfessionalAction={vi.fn()}
        deactivateProfessionalAction={vi.fn()}
      />,
    );

    expect(screen.getByText("Nenhum profissional cadastrado")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Salvar profissional" }));

    await waitFor(() => {
      expect(screen.getByText("Nome é obrigatório.")).toBeInTheDocument();
    });
  });

  it("requires confirmation before deactivating a professional", async () => {
    const deactivateProfessionalAction = vi.fn(async () => ({
      success: true as const,
      message: "Profissional desativado com sucesso.",
    }));

    render(
      <ProfessionalsPageClient
        professionals={[
          {
            id: "6378d041-d537-45b1-b658-c7d779ee098c",
            companyId: "67e6fa55-5e01-4a35-bf8d-36327f6f84dc",
            name: "Ana",
            specialty: "Banho e tosa",
            isActive: true,
            createdAt: "2026-06-10T09:00:00Z",
          },
        ]}
        createProfessionalAction={vi.fn()}
        updateProfessionalAction={vi.fn()}
        activateProfessionalAction={vi.fn()}
        deactivateProfessionalAction={deactivateProfessionalAction}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Desativar" }));

    expect(screen.getAllByText("Confirmar desativação")).toHaveLength(2);

    await userEvent.click(
      screen.getByRole("button", { name: "Confirmar desativação" }),
    );

    await waitFor(() => {
      expect(deactivateProfessionalAction).toHaveBeenCalledWith(
        "6378d041-d537-45b1-b658-c7d779ee098c",
      );
      expect(
        screen.getByText("Profissional desativado com sucesso."),
      ).toBeInTheDocument();
      expect(refresh).toHaveBeenCalled();
    });
  });
});
