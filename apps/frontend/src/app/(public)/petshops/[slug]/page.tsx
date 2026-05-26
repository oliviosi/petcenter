import { notFound } from "next/navigation";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { PetshopDetailHero } from "@/components/Petshops/PetshopDetailHero";
import { PetshopProfessionalsSection } from "@/components/Petshops/PetshopProfessionalsSection";
import { PetshopServicesSection } from "@/components/Petshops/PetshopServicesSection";
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

    return (
      <PageWrapper
        title="Vitrine publica do petshop"
        description="Este e o ponto principal da jornada publica da loja: conheca os servicos, veja quem atende e siga para a solicitacao de reserva."
      >
        <PetshopDetailHero petshop={petshop} />

        <section className="space-y-4">
          <div className="space-y-2">
            <h2 className="font-heading text-2xl font-semibold text-content-primary">
              Profissionais ativos
            </h2>
            <p className="text-sm text-content-secondary">
              Conheça quem pode atender o seu pet nesta unidade.
            </p>
          </div>
          <PetshopProfessionalsSection professionals={petshop.professionals} />
        </section>

        <section className="space-y-4">
          <div className="space-y-2">
            <h2 className="font-heading text-2xl font-semibold text-content-primary">
              Serviços disponíveis
            </h2>
            <p className="text-sm text-content-secondary">
              Escolha um serviço para seguir para a consulta de horários.
            </p>
          </div>
          <PetshopServicesSection services={petshop.services} />
        </section>
      </PageWrapper>
    );
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) {
      notFound();
    }

    throw error;
  }
}
