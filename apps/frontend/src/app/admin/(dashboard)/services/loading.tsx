import { SetupListSkeleton } from "@/components/AdminSetup/SetupListSkeleton";
import { PageWrapper } from "@/components/layout/PageWrapper";

export default function AdminServicesLoading() {
  return (
    <PageWrapper
      title="Serviços"
      description="Carregando o catálogo operacional."
    >
      <SetupListSkeleton ariaLabel="Carregando serviços" />
    </PageWrapper>
  );
}
