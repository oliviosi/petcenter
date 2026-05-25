import { redirect } from "next/navigation";
import { DashboardErrorState } from "@/components/AdminBookings/DashboardErrorState";
import { ServicesPageClient } from "@/components/AdminServices/ServicesPageClient";
import { Button } from "@/components/ui/Button";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { ApiRequestError, api } from "@/lib/api";
import { getAdminLoginPath, requireAdminSession } from "@/lib/adminSession";
import {
  submitActivateServiceAction,
  submitCreateServiceAction,
  submitDeactivateServiceAction,
  submitUpdateServiceAction,
} from "./actions";

export default async function AdminServicesPage() {
  const session = await requireAdminSession();

  try {
    const services = await api.listAdminServices(session.token);

    return (
      <PageWrapper
        title="Serviços"
        description="Mantenha o catálogo operacional ativo, com duração e preço base prontos para descoberta pública e atribuições."
        actions={
          <Button href="#new-service" variant="secondary">
            Novo serviço
          </Button>
        }
      >
        <ServicesPageClient
          services={services}
          createServiceAction={submitCreateServiceAction}
          updateServiceAction={submitUpdateServiceAction}
          activateServiceAction={submitActivateServiceAction}
          deactivateServiceAction={submitDeactivateServiceAction}
        />
      </PageWrapper>
    );
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 401) {
      redirect(getAdminLoginPath("session"));
    }

    return (
      <PageWrapper
        title="Serviços"
        description="Mantenha o catálogo operacional ativo, com duração e preço base prontos para descoberta pública e atribuições."
      >
        <DashboardErrorState
          title="Não foi possível carregar os serviços"
          description={
            error instanceof Error
              ? error.message
              : "Ocorreu um erro inesperado ao abrir o catálogo operacional."
          }
          actionHref="/admin/services"
          actionLabel="Tentar novamente"
        />
      </PageWrapper>
    );
  }
}
