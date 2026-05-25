import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProfessionalAssignmentsManager } from "@/components/AdminProfessionals/ProfessionalAssignmentsManager";

const refresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh,
    replace: vi.fn(),
    push: vi.fn(),
  }),
}));

const professional = {
  id: "d36e4f56-4d44-42ea-b8a3-b352517d8cd8",
  companyId: "01b821b2-8842-41f6-97f7-959cd9734b86",
  name: "Ana",
  specialty: "Banho e tosa",
  isActive: true,
  createdAt: "2026-06-10T09:00:00Z",
} as const;

const services = [
  {
    id: "50d6cd65-e24f-4844-b362-414004dd4ffb",
    companyId: "01b821b2-8842-41f6-97f7-959cd9734b86",
    name: "Banho",
    durationMinutes: 60,
    basePrice: 90,
    isActive: true,
    createdAt: "2026-06-10T09:00:00Z",
  },
] as const;

describe("ProfessionalAssignmentsManager", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("adds an active service assignment and refreshes the setup view", async () => {
    const createAssignmentAction = vi.fn(async () => ({
      success: true as const,
      message: "Serviço atribuído com sucesso.",
    }));

    render(
      <ProfessionalAssignmentsManager
        professional={professional}
        services={[...services]}
        assignments={[]}
        createAssignmentAction={createAssignmentAction}
        deleteAssignmentAction={vi.fn()}
      />,
    );

    await userEvent.selectOptions(screen.getByRole("combobox"), services[0].id);
    await userEvent.click(screen.getByRole("button", { name: "Adicionar serviço" }));

    await waitFor(() => {
      expect(createAssignmentAction).toHaveBeenCalledWith({
        professionalId: professional.id,
        serviceId: services[0].id,
      });
      expect(screen.getByText("Serviço atribuído com sucesso.")).toBeInTheDocument();
      expect(refresh).toHaveBeenCalled();
    });
  });

  it("requires confirmation before removing an assignment", async () => {
    const deleteAssignmentAction = vi.fn(async () => ({
      success: true as const,
      message: "Vínculo removido com sucesso.",
    }));

    render(
      <ProfessionalAssignmentsManager
        professional={professional}
        services={[...services]}
        assignments={[
          {
            assignmentId: "090de090-2ef1-4641-b41c-2ba6d6156188",
            companyId: professional.companyId,
            professionalId: professional.id,
            serviceId: services[0].id,
            serviceName: services[0].name,
            serviceDurationMinutes: services[0].durationMinutes,
            basePrice: services[0].basePrice,
            active: true,
            createdAt: "2026-06-10T10:00:00Z",
          },
        ]}
        createAssignmentAction={vi.fn()}
        deleteAssignmentAction={deleteAssignmentAction}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Remover vínculo" }));

    expect(screen.getAllByText("Confirmar remoção")).toHaveLength(2);

    await userEvent.click(screen.getByRole("button", { name: "Confirmar remoção" }));

    await waitFor(() => {
      expect(deleteAssignmentAction).toHaveBeenCalledWith(
        professional.id,
        services[0].id,
      );
      expect(screen.getByText("Vínculo removido com sucesso.")).toBeInTheDocument();
      expect(refresh).toHaveBeenCalled();
    });
  });
});
