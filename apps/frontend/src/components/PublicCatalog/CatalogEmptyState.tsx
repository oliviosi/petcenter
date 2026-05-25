import { Store } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

export function CatalogEmptyState() {
  return (
    <EmptyState
      icon={Store}
      title="Nenhum petshop encontrado"
      description="Tente ajustar os filtros para buscar em outra cidade, serviço ou faixa de avaliação."
      action={<Button href="/petshops" variant="secondary">Limpar filtros</Button>}
    />
  );
}
