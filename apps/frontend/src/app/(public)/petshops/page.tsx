import { CatalogEmptyState } from "@/components/PublicCatalog/CatalogEmptyState";
import { CatalogFilters } from "@/components/PublicCatalog/CatalogFilters";
import { PetshopCard } from "@/components/PublicCatalog/PetshopCard";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { api } from "@/lib/api";
import type { PublicPetshopFilters } from "@/types";

interface CatalogPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function toSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const resolvedSearchParams = await searchParams;

  const filters: PublicPetshopFilters = {
    query: toSingleValue(resolvedSearchParams.query),
    city: toSingleValue(resolvedSearchParams.city),
    service: toSingleValue(resolvedSearchParams.service),
    rating: toSingleValue(resolvedSearchParams.rating),
    orderBy: toSingleValue(resolvedSearchParams.orderBy) || "rating",
    orderDirection:
      toSingleValue(resolvedSearchParams.orderDirection) || "desc",
  };

  const petshops = await api.listPublicPetshops(filters);

  return (
    <PageWrapper
      title="Catálogo público de petshops"
      description="Descubra opções, compare contexto de atendimento e avance para a solicitação de reserva."
    >
      <CatalogFilters filters={filters} />

      {petshops.length === 0 ? (
        <CatalogEmptyState />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {petshops.map((petshop) => (
            <PetshopCard key={petshop.id} petshop={petshop} />
          ))}
        </div>
      )}
    </PageWrapper>
  );
}
