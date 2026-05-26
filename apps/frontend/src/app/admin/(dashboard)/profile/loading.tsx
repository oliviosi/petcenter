import { PublicProfileSkeleton } from "@/components/AdminProfile/PublicProfileSkeleton";
import { PageWrapper } from "@/components/layout/PageWrapper";

export default function AdminProfileLoading() {
  return (
    <PageWrapper
      title="Perfil público"
      description="Carregando os dados atuais da vitrine do petshop."
    >
      <PublicProfileSkeleton />
    </PageWrapper>
  );
}
