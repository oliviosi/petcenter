import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { UserRound } from "lucide-react";
import type { PublicPetshopProfessional } from "@/types";

interface PetshopProfessionalsSectionProps {
  professionals: PublicPetshopProfessional[];
}

export function PetshopProfessionalsSection({
  professionals,
}: PetshopProfessionalsSectionProps) {
  if (professionals.length === 0) {
    return (
      <EmptyState
        icon={UserRound}
        title="Sem profissionais ativos"
        description="Este petshop ainda não publicou profissionais disponíveis para atendimento público."
      />
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {professionals.map((professional) => (
        <Card key={professional.id} className="flex flex-col gap-4 p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-brand-soft text-content-brand">
            <UserRound className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-content-primary">
              {professional.name}
            </h2>
            <Badge tone="neutral">
              {professional.specialty || "Especialidade não informada"}
            </Badge>
          </div>
        </Card>
      ))}
    </div>
  );
}
