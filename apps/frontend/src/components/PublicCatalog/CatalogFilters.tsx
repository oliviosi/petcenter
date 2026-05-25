import { Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

interface CatalogFiltersProps {
  filters: {
    query: string;
    city: string;
    service: string;
    rating: string;
    orderBy: string;
    orderDirection: string;
  };
}

export function CatalogFilters({ filters }: CatalogFiltersProps) {
  return (
    <Card className="p-6">
      <form className="grid gap-4 lg:grid-cols-[2fr_1fr_1fr_1fr_auto]">
        <FormField label="Buscar petshop">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-content-subtle" />
            <Input
              name="query"
              defaultValue={filters.query}
              placeholder="Nome do petshop ou bairro"
              className="pl-11"
            />
          </div>
        </FormField>

        <FormField label="Cidade">
          <Input name="city" defaultValue={filters.city} placeholder="Cidade" />
        </FormField>

        <FormField label="Serviço">
          <Input
            name="service"
            defaultValue={filters.service}
            placeholder="Banho, tosa..."
          />
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <FormField label="Nota mínima">
            <Select name="rating" defaultValue={filters.rating}>
              <option value="">Qualquer nota</option>
              <option value="5">5 estrelas</option>
              <option value="4">4 estrelas ou mais</option>
              <option value="3">3 estrelas ou mais</option>
            </Select>
          </FormField>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <FormField label="Ordenação">
            <Select name="orderBy" defaultValue={filters.orderBy}>
              <option value="rating">Melhor avaliação</option>
              <option value="name">Nome</option>
            </Select>
          </FormField>
          <input type="hidden" name="orderDirection" value={filters.orderDirection} />
          <Button type="submit" className="self-end">
            Atualizar lista
          </Button>
        </div>
      </form>
    </Card>
  );
}
