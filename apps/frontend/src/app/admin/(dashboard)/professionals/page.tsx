import { redirect } from "next/navigation";
import { ProfessionalsPageClient } from "@/components/AdminProfessionals/ProfessionalsPageClient";
import { DashboardErrorState } from "@/components/AdminBookings/DashboardErrorState";
import { Button } from "@/components/ui/Button";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { ApiRequestError, api } from "@/lib/api";
import { getAdminLoginPath, requireAdminSession } from "@/lib/adminSession";
import {
  submitActivateProfessionalAction,
  submitCreateProfessionalAction,
  submitDeactivateProfessionalAction,
  submitUpdateProfessionalAction,
} from "./actions";

export default async function AdminProfessionalsPage() {
  const session = await requireAdminSession();

  try {
    const professionals = await api.listAdminProfessionals(session.token);

    return (
      <PageWrapper
        title="Profissionais"
        description="Cadastre a equipe do petshop, mantenha perfis atualizados e siga para o setup individual de serviços e disponibilidade."
        actions={
          <Button href="#new-professional" variant="secondary">
            Novo profissional
          </Button>
        }
      >
        <ProfessionalsPageClient
          professionals={professionals}
          createProfessionalAction={submitCreateProfessionalAction}
          updateProfessionalAction={submitUpdateProfessionalAction}
          activateProfessionalAction={submitActivateProfessionalAction}
          deactivateProfessionalAction={submitDeactivateProfessionalAction}
        />
      </PageWrapper>
    );
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 401) {
      redirect(getAdminLoginPath("session"));
    }

    return (
      <PageWrapper
        title="Profissionais"
        description="Cadastre a equipe do petshop, mantenha perfis atualizados e siga para o setup individual de serviços e disponibilidade."
      >
        <DashboardErrorState
          title="Não foi possível carregar os profissionais"
          description={
            error instanceof Error
              ? error.message
              : "Ocorreu um erro inesperado ao abrir a operação dos profissionais."
          }
          actionHref="/admin/professionals"
          actionLabel="Tentar novamente"
        />
      </PageWrapper>
    );
  }
}
