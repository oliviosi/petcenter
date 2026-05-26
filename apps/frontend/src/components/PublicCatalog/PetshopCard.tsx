import { ArrowRight, MapPin, Phone, Star } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatRating } from "@/lib/format";
import type { PublicPetshopSummary } from "@/types";

interface PetshopCardProps {
  petshop: PublicPetshopSummary;
}

export function PetshopCard({ petshop }: PetshopCardProps) {
  return (
    <Card className="flex h-full flex-col gap-5 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <h2 className="font-heading text-2xl font-semibold text-content-primary">{petshop.name}</h2>
          <p className="text-sm text-content-secondary">{petshop.description}</p>
        </div>
        <Badge tone={petshop.averageRating ? "brand" : "neutral"}>
          {petshop.averageRating ? formatRating(petshop.averageRating) : "Sem avaliações"}
        </Badge>
      </div>

      <div className="grid gap-3 text-sm text-content-secondary">
        <div className="flex items-start gap-3">
          <MapPin className="mt-0.5 h-4 w-4 text-content-subtle" />
          <span>{petshop.addressSummary}</span>
        </div>
        <div className="flex items-start gap-3">
          <Phone className="mt-0.5 h-4 w-4 text-content-subtle" />
          <span>{petshop.contactSummary}</span>
        </div>
        <div className="flex items-start gap-3">
          <Star className="mt-0.5 h-4 w-4 text-content-subtle" />
          <span>
            {petshop.feedbackCount
              ? `${petshop.feedbackCount} avaliações públicas`
              : "Ainda sem avaliações públicas"}
          </span>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3">
        <div className="text-sm text-content-muted">
          {petshop.city} • {petshop.neighborhood}
        </div>
        <Button href={`/petshops/${petshop.slug}`}>
          Ver detalhes
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
