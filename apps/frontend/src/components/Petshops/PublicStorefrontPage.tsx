import { PageWrapper } from "@/components/layout/PageWrapper";
import { PetshopDetailHero } from "@/components/Petshops/PetshopDetailHero";
import { PetshopProfessionalsSection } from "@/components/Petshops/PetshopProfessionalsSection";
import { PetshopServicesSection } from "@/components/Petshops/PetshopServicesSection";
import { buildBookingPath, type StorefrontEntryMode } from "@/lib/storefront";
import type { PublicPetshopDetail } from "@/types";

interface PublicStorefrontPageProps {
  petshop: PublicPetshopDetail;
  entryMode: StorefrontEntryMode;
}

export function PublicStorefrontPage({ petshop, entryMode }: PublicStorefrontPageProps) {
  return (
    <PageWrapper
      title="Vitrine publica do petshop"
      description="Este e o ponto principal da jornada publica da loja: conheca os servicos, veja quem atende e siga para a solicitacao de reserva."
    >
      <PetshopDetailHero
        petshop={petshop}
        bookingPath={buildBookingPath(petshop.slug, entryMode)}
      />

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
}
