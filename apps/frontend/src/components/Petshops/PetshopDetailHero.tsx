import { ArrowRight, MapPin, Phone, Star } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatCurrency, formatRating } from "@/lib/format";
import type { PublicPetshopDetail } from "@/types";

interface PetshopDetailHeroProps {
  petshop: PublicPetshopDetail;
}

export function PetshopDetailHero({ petshop }: PetshopDetailHeroProps) {
  const featuredService = petshop.services[0];

  return (
    <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      <Card className="flex flex-col gap-5 p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <Badge tone="brand">Vitrine publica principal</Badge>
            <h1 className="font-heading text-4xl font-semibold tracking-tight text-content-primary">
              {petshop.name}
            </h1>
            <p className="max-w-3xl text-base leading-7 text-content-secondary">
              {petshop.description}
            </p>
          </div>
          <Badge tone={petshop.averageRating ? "success" : "neutral"}>
            {petshop.averageRating ? formatRating(petshop.averageRating) : "Sem avaliações"}
          </Badge>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex items-start gap-3 rounded-2xl bg-surface-muted p-4">
            <MapPin className="mt-0.5 h-5 w-5 text-content-brand" />
            <div>
              <p className="text-sm font-medium text-content-primary">Localização</p>
              <p className="text-sm text-content-secondary">{petshop.addressSummary}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-2xl bg-surface-muted p-4">
            <Phone className="mt-0.5 h-5 w-5 text-content-brand" />
            <div>
              <p className="text-sm font-medium text-content-primary">Contato</p>
              <p className="text-sm text-content-secondary">{petshop.contactSummary}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-2xl bg-surface-muted p-4">
            <Star className="mt-0.5 h-5 w-5 text-content-brand" />
            <div>
              <p className="text-sm font-medium text-content-primary">Avaliações</p>
              <p className="text-sm text-content-secondary">
                {petshop.feedbackCount
                  ? `${petshop.feedbackCount} avaliações públicas`
                  : "Ainda sem avaliações"}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="flex flex-col gap-5 p-8">
        <div className="space-y-2">
          <p className="text-sm font-medium text-content-secondary">
            Proximo passo
          </p>
          <h2 className="font-heading text-3xl font-semibold text-content-primary">
            Avancar para o agendamento
          </h2>
          <p className="text-sm text-content-secondary">
            A partir desta vitrine, o cliente segue para servicos, horarios e envio da solicitacao sem sair do contexto da loja.
          </p>
        </div>

        {featuredService ? (
          <div className="rounded-2xl bg-accent-soft p-4">
            <p className="text-sm font-medium text-content-accent">
              Servico em destaque
            </p>
            <p className="mt-2 text-base font-semibold text-content-primary">
              {featuredService.name}
            </p>
            <p className="mt-1 text-sm text-content-secondary">
              {featuredService.durationMinutes} minutos •{" "}
              {formatCurrency(featuredService.basePrice)}
            </p>
          </div>
        ) : null}

        <Button
          href={
            featuredService
              ? `/petshops/${petshop.slug}/book?serviceId=${featuredService.id}`
              : `/petshops/${petshop.slug}/book`
          }
          className="w-full"
        >
          Ver horarios disponiveis
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Card>
    </div>
  );
}
