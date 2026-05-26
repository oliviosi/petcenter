"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CalendarRange, RotateCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { AdminFeedbackFilters, AdminFeedbackProfessionalSummary } from "@/types";

interface FeedbackFiltersProps {
  filters: AdminFeedbackFilters;
  professionals: AdminFeedbackProfessionalSummary[];
}

export function FeedbackFilters({ filters, professionals }: FeedbackFiltersProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formValues, setFormValues] = useState(filters);
  const sortedProfessionals = useMemo(
    () => [...professionals].sort((left, right) => left.name.localeCompare(right.name, "pt-BR")),
    [professionals],
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = new URLSearchParams();

    if (formValues.startDate) {
      params.set("startDate", formValues.startDate);
    }

    if (formValues.endDate) {
      params.set("endDate", formValues.endDate);
    }

    if (formValues.professionalId) {
      params.set("professionalId", formValues.professionalId);
    }

    startTransition(() => {
      router.replace(
        params.size > 0 ? `/admin/feedback?${params.toString()}` : "/admin/feedback",
      );
    });
  }

  function handleReset() {
    setFormValues({
      startDate: "",
      endDate: "",
      professionalId: "",
    });
  }

  return (
    <Card className="p-6">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-content-primary">
              <CalendarRange className="h-4 w-4 text-content-brand" />
              Filtros de leitura
            </div>
            <p className="max-w-3xl text-sm text-content-secondary">
              Refine por período e profissional para revisar comentários e notas dentro da
              empresa autenticada.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="ghost" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
              Limpar filtros
            </Button>
            <Button type="submit" loading={isPending}>
              <Search className="h-4 w-4" />
              Aplicar filtros
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <FormField label="De" hint="Opcional para focar em um recorte recente.">
            <Input
              type="date"
              value={formValues.startDate}
              onChange={(event) =>
                setFormValues((current) => ({
                  ...current,
                  startDate: event.target.value,
                }))
              }
            />
          </FormField>

          <FormField label="Até" hint="Use junto com a data inicial para fechar um intervalo.">
            <Input
              type="date"
              value={formValues.endDate}
              onChange={(event) =>
                setFormValues((current) => ({
                  ...current,
                  endDate: event.target.value,
                }))
              }
            />
          </FormField>

          <FormField label="Profissional">
            <Select
              value={formValues.professionalId}
              onChange={(event) =>
                setFormValues((current) => ({
                  ...current,
                  professionalId: event.target.value,
                }))
              }
            >
              <option value="">Todos os profissionais</option>
              {sortedProfessionals.map((professional) => (
                <option key={professional.professionalId} value={professional.professionalId}>
                  {professional.name}
                </option>
              ))}
            </Select>
          </FormField>
        </div>
      </form>
    </Card>
  );
}
