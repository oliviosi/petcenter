import { Clock3, Scissors } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrency } from "@/lib/format";
import type { PublicPetshopService } from "@/types";

interface PetshopServicesSectionProps {
  services: PublicPetshopService[];
}

export function PetshopServicesSection({
  services,
}: PetshopServicesSectionProps) {
  if (services.length === 0) {
    return (
      <EmptyState
        icon={Scissors}
        title="Sem serviços disponíveis"
        description="Este petshop ainda não publicou serviços reserváveis para o fluxo público."
      />
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {services.map((service) => (
        <Card key={service.id} className="flex h-full flex-col gap-4 p-6">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-content-primary">
              {service.name}
            </h2>
            <p className="text-sm text-content-secondary">
              A partir de {formatCurrency(service.basePrice)}
            </p>
          </div>

          <div className="mt-auto flex items-center gap-3 text-sm text-content-secondary">
            <Clock3 className="h-4 w-4 text-content-subtle" />
            <span>{service.durationMinutes} minutos</span>
          </div>
        </Card>
      ))}
    </div>
  );
}
