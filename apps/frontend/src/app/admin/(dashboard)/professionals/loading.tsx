import { SetupListSkeleton } from "@/components/AdminSetup/SetupListSkeleton";
import { PageWrapper } from "@/components/layout/PageWrapper";

export default function AdminProfessionalsLoading() {
  return (
    <PageWrapper
      title="Profissionais"
      description="Carregando os dados operacionais da equipe."
    >
      <SetupListSkeleton ariaLabel="Carregando profissionais" />
    </PageWrapper>
  );
}
