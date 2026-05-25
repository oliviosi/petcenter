"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CalendarRange, RotateCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { bookingStateOptions } from "@/lib/adminBooking";
import type { AdminBookingFilters, AdminBookingProfessional } from "@/types";

interface BookingFiltersProps {
  filters: AdminBookingFilters;
  professionals: AdminBookingProfessional[];
  isDefaultWindow: boolean;
}

export function BookingFilters({
  filters,
  professionals,
  isDefaultWindow,
}: BookingFiltersProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formValues, setFormValues] = useState(filters);
  const sortedProfessionals = useMemo(
    () =>
      [...professionals].sort((left, right) => left.name.localeCompare(right.name, "pt-BR")),
    [professionals],
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = new URLSearchParams();

    if (formValues.state) {
      params.set("state", formValues.state);
    }

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
        params.size > 0 ? `/admin/bookings?${params.toString()}` : "/admin/bookings",
      );
    });
  }

  function handleReset() {
    setFormValues({
      state: "",
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
              Filtros operacionais
            </div>
            <p className="max-w-3xl text-sm text-content-secondary">
              {isDefaultWindow
                ? "A fila abre com reservas de hoje em diante. Limpe a data inicial para consultar histórico e rejeições antigas."
                : "Ajuste período, estado ou profissional para revisar a operação dentro da empresa autenticada."}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="ghost" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
              Limpar período
            </Button>
            <Button type="submit" loading={isPending}>
              <Search className="h-4 w-4" />
              Aplicar filtros
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <FormField label="Estado">
            <Select
              value={formValues.state}
              onChange={(event) =>
                setFormValues((current) => ({
                  ...current,
                  state: event.target.value as AdminBookingFilters["state"],
                }))
              }
            >
              {bookingStateOptions.map((option) => (
                <option key={option.value || "all"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField
            label="De"
            hint="Deixe em branco para incluir histórico anterior à data atual."
          >
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

          <FormField label="Até" hint="Opcional para limitar um intervalo específico.">
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
                <option key={professional.id} value={professional.id}>
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
