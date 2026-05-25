import { CatalogListSkeleton } from "@/components/PublicCatalog/CatalogListSkeleton";
import { PageWrapper } from "@/components/layout/PageWrapper";

export default function PetshopsLoading() {
  return (
    <PageWrapper
      title="Carregando petshops"
      description="Estamos consultando as opções públicas disponíveis para o seu pet."
    >
      <CatalogListSkeleton />
    </PageWrapper>
  );
}
