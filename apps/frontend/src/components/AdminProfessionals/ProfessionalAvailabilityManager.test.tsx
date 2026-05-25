import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProfessionalAvailabilityManager } from "@/components/AdminProfessionals/ProfessionalAvailabilityManager";

const refresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh,
    replace: vi.fn(),
    push: vi.fn(),
  }),
}));

const professional = {
  id: "f1ab02ff-a4bf-40a2-b8a2-652d5dde3352",
  companyId: "2ce343b2-3812-4db0-a989-f7fd998155dc",
  name: "Ana",
  specialty: "Banho",
  isActive: true,
  createdAt: "2026-06-10T09:00:00Z",
} as const;

describe("ProfessionalAvailabilityManager", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("validates weekly windows before creating availability", async () => {
    render(
      <ProfessionalAvailabilityManager
        professional={professional}
        availability={[]}
        createAvailabilityAction={vi.fn()}
        updateAvailabilityAction={vi.fn()}
        deleteAvailabilityAction={vi.fn()}
      />,
    );

    const timeInputs = screen.getAllByDisplayValue(/^\d{2}:\d{2}$/);
    await userEvent.clear(timeInputs[0]);
    await userEvent.type(timeInputs[0], "18:00");
    await userEvent.clear(timeInputs[1]);
    await userEvent.type(timeInputs[1], "09:00");
    await userEvent.click(screen.getByRole("button", { name: "Salvar disponibilidade" }));

    await waitFor(() => {
      expect(
        screen.getByText("Hora de fim deve ser posterior à hora de início."),
      ).toBeInTheDocument();
    });
  });

  it("updates an existing weekly window", async () => {
    const updateAvailabilityAction = vi.fn(async () => ({
      success: true as const,
      message: "Disponibilidade atualizada com sucesso.",
    }));

    render(
      <ProfessionalAvailabilityManager
        professional={professional}
        availability={[
          {
            id: "4c4f5038-3769-45a0-b49e-984a9d862875",
            professionalId: professional.id,
            weekday: 1,
            startTime: "09:00:00",
            endTime: "17:00:00",
            createdAt: "2026-06-10T09:00:00Z",
          },
        ]}
        createAvailabilityAction={vi.fn()}
        updateAvailabilityAction={updateAvailabilityAction}
        deleteAvailabilityAction={vi.fn()}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Editar janela" }));

    const timeInputs = screen.getAllByDisplayValue(/^\d{2}:\d{2}$/);
    await userEvent.clear(timeInputs[2]);
    await userEvent.type(timeInputs[2], "10:00");
    await userEvent.clear(timeInputs[3]);
    await userEvent.type(timeInputs[3], "18:00");
    await userEvent.click(screen.getByRole("button", { name: "Salvar ajustes" }));

    await waitFor(() => {
      expect(updateAvailabilityAction).toHaveBeenCalledWith(
        professional.id,
        "4c4f5038-3769-45a0-b49e-984a9d862875",
        {
          weekday: "1",
          startTime: "10:00",
          endTime: "18:00",
        },
      );
      expect(
        screen.getByText("Disponibilidade atualizada com sucesso."),
      ).toBeInTheDocument();
      expect(refresh).toHaveBeenCalled();
    });
  });

  it("requires confirmation before deleting a weekly window", async () => {
    const deleteAvailabilityAction = vi.fn(async () => ({
      success: true as const,
      message: "Disponibilidade removida com sucesso.",
    }));

    render(
      <ProfessionalAvailabilityManager
        professional={professional}
        availability={[
          {
            id: "7264f849-e62f-4972-bc28-51753b87d1ff",
            professionalId: professional.id,
            weekday: 2,
            startTime: "09:00:00",
            endTime: "17:00:00",
            createdAt: "2026-06-10T09:00:00Z",
          },
        ]}
        createAvailabilityAction={vi.fn()}
        updateAvailabilityAction={vi.fn()}
        deleteAvailabilityAction={deleteAvailabilityAction}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Excluir" }));

    expect(screen.getAllByText("Confirmar exclusão")).toHaveLength(2);

    await userEvent.click(screen.getByRole("button", { name: "Confirmar exclusão" }));

    await waitFor(() => {
      expect(deleteAvailabilityAction).toHaveBeenCalledWith(
        professional.id,
        "7264f849-e62f-4972-bc28-51753b87d1ff",
      );
      expect(
        screen.getByText("Disponibilidade removida com sucesso."),
      ).toBeInTheDocument();
      expect(refresh).toHaveBeenCalled();
    });
  });
});
