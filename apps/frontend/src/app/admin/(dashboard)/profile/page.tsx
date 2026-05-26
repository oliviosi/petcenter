import { redirect } from "next/navigation";
import { PublicProfilePageClient } from "@/components/AdminProfile/PublicProfilePageClient";
import { DashboardErrorState } from "@/components/AdminBookings/DashboardErrorState";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { ApiRequestError, api } from "@/lib/api";
import { getAdminLoginPath, requireAdminSession } from "@/lib/adminSession";
import { submitUpdatePublicProfileAction } from "./actions";

export default async function AdminProfilePage() {
  const session = await requireAdminSession();

  try {
    const profile = await api.getAdminPublicProfile(session.token);

    return (
      <PageWrapper
        title="Perfil público"
        description="Controle como o petshop aparece no catálogo público, organize o slug da loja e ajuste os resumos que orientam a descoberta."
      >
        <PublicProfilePageClient
          profile={profile}
          updatePublicProfileAction={submitUpdatePublicProfileAction}
        />
      </PageWrapper>
    );
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 401) {
      redirect(getAdminLoginPath("session"));
    }

    return (
      <PageWrapper
        title="Perfil público"
        description="Controle como o petshop aparece no catálogo público, organize o slug da loja e ajuste os resumos que orientam a descoberta."
      >
        <DashboardErrorState
          title="Não foi possível carregar o perfil público"
          description={
            error instanceof Error
              ? error.message
              : "Ocorreu um erro inesperado ao abrir a vitrine pública do petshop."
          }
          actionHref="/admin/profile"
          actionLabel="Tentar novamente"
        />
      </PageWrapper>
    );
  }
}
