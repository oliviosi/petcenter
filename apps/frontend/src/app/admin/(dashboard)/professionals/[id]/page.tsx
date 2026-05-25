import { notFound, redirect } from "next/navigation";
import { ProfessionalAvailabilityManager } from "@/components/AdminProfessionals/ProfessionalAvailabilityManager";
import { ProfessionalAssignmentsManager } from "@/components/AdminProfessionals/ProfessionalAssignmentsManager";
import { ProfessionalProfilePanel } from "@/components/AdminProfessionals/ProfessionalProfilePanel";
import { DashboardErrorState } from "@/components/AdminBookings/DashboardErrorState";
import { Button } from "@/components/ui/Button";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { ApiRequestError, api } from "@/lib/api";
import { getAdminLoginPath, requireAdminSession } from "@/lib/adminSession";
import {
  submitUpdateProfessionalAction,
} from "../actions";
import {
  submitCreateAvailabilityAction,
  submitCreateProfessionalAssignmentAction,
  submitDeleteAvailabilityAction,
  submitDeleteProfessionalAssignmentAction,
  submitUpdateAvailabilityAction,
} from "./actions";

interface AdminProfessionalDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminProfessionalDetailPage({
  params,
}: AdminProfessionalDetailPageProps) {
  const session = await requireAdminSession();
  const { id } = await params;

  try {
    const [professional, services, assignments, availability] = await Promise.all([
      api.getAdminProfessionalById(id, session.token),
      api.listAdminServices(session.token),
      api.listAdminProfessionalServices(id, session.token),
      api.listAdminProfessionalAvailability(id, session.token),
    ]);

    return (
      <PageWrapper
        title={`Setup de ${professional.name}`}
        description="Centralize o perfil, os serviços atribuídos e a disponibilidade semanal recorrente deste profissional no mesmo fluxo operacional."
        actions={
          <Button href="/admin/professionals" variant="secondary">
            Voltar para profissionais
          </Button>
        }
      >
        <div className="space-y-6">
          <ProfessionalProfilePanel
            professional={professional}
            updateProfessionalAction={submitUpdateProfessionalAction}
          />

          <ProfessionalAssignmentsManager
            professional={professional}
            services={services}
            assignments={assignments}
            createAssignmentAction={submitCreateProfessionalAssignmentAction}
            deleteAssignmentAction={submitDeleteProfessionalAssignmentAction}
          />

          <ProfessionalAvailabilityManager
            professional={professional}
            availability={availability}
            createAvailabilityAction={submitCreateAvailabilityAction}
            updateAvailabilityAction={submitUpdateAvailabilityAction}
            deleteAvailabilityAction={submitDeleteAvailabilityAction}
          />
        </div>
      </PageWrapper>
    );
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 401) {
      redirect(getAdminLoginPath("session"));
    }

    if (error instanceof ApiRequestError && error.status === 404) {
      notFound();
    }

    return (
      <PageWrapper
        title="Setup do profissional"
        description="Centralize o perfil, os serviços atribuídos e a disponibilidade semanal recorrente deste profissional no mesmo fluxo operacional."
        actions={
          <Button href="/admin/professionals" variant="secondary">
            Voltar para profissionais
          </Button>
        }
      >
        <DashboardErrorState
          title="Não foi possível carregar o setup do profissional"
          description={
            error instanceof Error
              ? error.message
              : "Ocorreu um erro inesperado ao abrir a configuração do profissional."
          }
          actionHref="/admin/professionals"
          actionLabel="Voltar para profissionais"
        />
      </PageWrapper>
    );
  }
}
