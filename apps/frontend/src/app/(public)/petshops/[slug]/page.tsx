import { notFound } from "next/navigation";
import { PublicStorefrontPage } from "@/components/Petshops/PublicStorefrontPage";
import { ApiRequestError, api } from "@/lib/api";

interface PetshopDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PetshopDetailPage({
  params,
}: PetshopDetailPageProps) {
  const { slug } = await params;

  try {
    const petshop = await api.getPublicPetshopBySlug(slug);

    return <PublicStorefrontPage petshop={petshop} entryMode="shared-host" />;
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) {
      notFound();
    }

    throw error;
  }
}
