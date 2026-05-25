import { SetupListSkeleton } from "@/components/AdminSetup/SetupListSkeleton";
import { PageWrapper } from "@/components/layout/PageWrapper";

export default function AdminProfessionalDetailLoading() {
  return (
    <PageWrapper
      title="Setup do profissional"
      description="Carregando perfil, vínculos e disponibilidade semanal."
    >
      <SetupListSkeleton ariaLabel="Carregando setup do profissional" cards={3} />
    </PageWrapper>
  );
}
