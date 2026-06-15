import { Clock3, Scissors } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
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
    <div className="grid gap-6 lg:grid-cols-3">
      {services.map((service) => (
        <Card key={service.id} className="flex h-full flex-col gap-4 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-content-primary">{service.name}</h2>
            <div className="text-right text-sm font-medium text-content-primary">{formatCurrency(service.basePrice)}</div>
          </div>

          <p className="text-xs text-content-secondary mt-2">Corte completo e higienização.</p>

          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-content-secondary">
              <Clock3 className="h-4 w-4 text-content-subtle" />
              <span>{service.durationMinutes} min</span>
            </div>
            <Button href="#" variant="ghost" size="sm">Selecionar</Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
