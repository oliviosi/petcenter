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

  let petshops = [] as ReturnType<typeof api.listPublicPetshops> extends Promise<infer U> ? U : unknown[];

  try {
    petshops = await api.listPublicPetshops(filters);
  } catch (err) {
    // If backend is down or request fails, render empty state instead of throwing
    console.error('Failed to load public petshops:', err);
    petshops = [] as any;
  }

  return (
    <PageWrapper
      title="Catalogo publico secundario"
      description="Use esta area apenas quando precisar localizar uma loja manualmente. A jornada principal continua sendo abrir a vitrine publica do petshop pelo link compartilhado."
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
