"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarRange, Clock3 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { SlotList } from "@/components/Booking/SlotList";
import { PublicRequestErrorState } from "@/components/PublicRequestErrorState";
import { bookingSubmissionSchema } from "@/lib/validations/booking";
import type {
  BookingSearchFilters,
  PublicBookingSlot,
  PublicPetshopDetail,
  SubmitBookingAction,
} from "@/types";

interface BookingPageClientProps {
  petshop: PublicPetshopDetail;
  filters: BookingSearchFilters;
  slots: PublicBookingSlot[];
  slotsError?: string | null;
  submitBookingAction: SubmitBookingAction;
}

export function BookingPageClient({
  petshop,
  filters,
  slots,
  slotsError,
  submitBookingAction,
}: BookingPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isSearching, startTransition] = useTransition();

  const professionalLookup = useMemo(
    () =>
      Object.fromEntries(
        petshop.professionals.map((professional) => [
          professional.id,
          professional.name,
        ]),
      ),
    [petshop.professionals],
  );

  const serviceLookup = useMemo(
    () =>
      Object.fromEntries(
        petshop.services.map((service) => [service.id, service.name]),
      ),
    [petshop.services],
  );

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(bookingSubmissionSchema),
    defaultValues: {
      petshopId: petshop.id,
      petshopSlug: petshop.slug,
      petshopName: petshop.name,
      serviceId: filters.serviceId,
      serviceName: serviceLookup[filters.serviceId] ?? "",
      professionalId: "",
      professionalName: "",
      slotStart: "",
      slotEnd: "",
      ownerContact: "",
      petName: "",
      petSpecies: "",
    },
  });

  useEffect(() => {
    setSelectedSlotId(null);
    setValue("serviceId", filters.serviceId, { shouldValidate: true });
    setValue("serviceName", serviceLookup[filters.serviceId] ?? "", {
      shouldValidate: true,
    });
    setValue("professionalId", "", { shouldValidate: false });
    setValue("professionalName", "", { shouldValidate: false });
    setValue("slotStart", "", { shouldValidate: false });
    setValue("slotEnd", "", { shouldValidate: false });
  }, [filters.serviceId, serviceLookup, setValue, slots]);

  const filterDefaults = useMemo(
    () => ({
      serviceId: filters.serviceId,
      professionalId: filters.professionalId,
      startDate: filters.startDate,
      endDate: filters.endDate,
    }),
    [filters],
  );

  function handleSlotSelect(slot: PublicBookingSlot) {
    const slotId = `${slot.professionalId}-${slot.slotStart}`;
    setSelectedSlotId(slotId);
    setSubmissionError(null);
    setValue("professionalId", slot.professionalId, { shouldValidate: true });
    setValue(
      "professionalName",
      professionalLookup[slot.professionalId] ?? "Profissional disponível",
      { shouldValidate: false },
    );
    setValue("slotStart", slot.slotStart, { shouldValidate: true });
    setValue("slotEnd", slot.slotEnd, { shouldValidate: true });
  }

  async function onSubmit(values: Parameters<SubmitBookingAction>[0]) {
    setSubmissionError(null);

    const result = await submitBookingAction(values);

    if (!result.success) {
      if (result.fieldErrors) {
        for (const [field, message] of Object.entries(result.fieldErrors)) {
          if (message) {
            setError(field as keyof typeof values, {
              type: "server",
              message,
            });
          }
        }
      }

      if (result.message) {
        setSubmissionError(result.message);
      }

      return;
    }

    router.push(`/bookings/${result.bookingId}`);
  }

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const nextParams = new URLSearchParams(searchParams.toString());
    const nextValues = {
      serviceId: String(formData.get("serviceId") ?? ""),
      professionalId: String(formData.get("professionalId") ?? ""),
      startDate: String(formData.get("startDate") ?? ""),
      endDate: String(formData.get("endDate") ?? ""),
    };

    Object.entries(nextValues).forEach(([key, value]) => {
      if (value) {
        nextParams.set(key, value);
      } else {
        nextParams.delete(key);
      }
    });

    startTransition(() =>
      router.replace(`/petshops/${petshop.slug}/book?${nextParams.toString()}`),
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-6">
        <Card className="p-6">
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSearch}>
            <FormField label="Serviço">
              <Select name="serviceId" defaultValue={filterDefaults.serviceId}>
                {petshop.services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField
              label="Profissional"
              hint="Opcional. Use quando quiser restringir a busca."
            >
              <Select
                name="professionalId"
                defaultValue={filterDefaults.professionalId}
              >
                <option value="">Qualquer profissional</option>
                {petshop.professionals.map((professional) => (
                  <option key={professional.id} value={professional.id}>
                    {professional.name}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Data inicial">
              <Input
                name="startDate"
                type="date"
                defaultValue={filterDefaults.startDate}
              />
            </FormField>

            <FormField label="Data final">
              <Input
                name="endDate"
                type="date"
                defaultValue={filterDefaults.endDate}
              />
            </FormField>

            <div className="md:col-span-2 flex flex-wrap items-center gap-3">
              <Button type="submit" loading={isSearching}>
                <CalendarRange className="h-4 w-4" />
                Buscar horários
              </Button>
              <p className="text-sm text-content-secondary">
                Consulte um intervalo curto para encontrar horários livres com
                mais rapidez.
              </p>
            </div>
          </form>
        </Card>

        {slotsError ? (
          <PublicRequestErrorState
            title="Não foi possível consultar os horários"
            description={slotsError}
            actionLabel="Consultar novamente"
            onRetry={() => router.refresh()}
          />
        ) : (
          <SlotList
            slots={slots}
            selectedSlotId={selectedSlotId}
            professionalLookup={professionalLookup}
            onSelect={handleSlotSelect}
          />
        )}
      </div>

      <Card className="p-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-content-secondary">
            Dados para a solicitação
          </p>
          <h2 className="text-2xl font-semibold text-content-primary">
            Finalizar pedido de reserva
          </h2>
          <p className="text-sm text-content-secondary">
            Informe os dados do responsável e do pet. O horário só será enviado
            depois que você selecionar uma opção disponível.
          </p>
        </div>

        <div className="mt-6 rounded-2xl bg-surface-muted p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-content-primary">
            <Clock3 className="h-4 w-4 text-content-brand" />
            Horário selecionado
          </div>
          <p className="mt-2 text-sm text-content-secondary">
            {selectedSlotId
              ? "Pronto para enviar a solicitação."
              : "Escolha um horário disponível para continuar."}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <input type="hidden" {...register("petshopId")} />
          <input type="hidden" {...register("petshopSlug")} />
          <input type="hidden" {...register("petshopName")} />
          <input type="hidden" {...register("serviceId")} />
          <input type="hidden" {...register("serviceName")} />
          <input type="hidden" {...register("professionalId")} />
          <input type="hidden" {...register("professionalName")} />
          <input type="hidden" {...register("slotStart")} />
          <input type="hidden" {...register("slotEnd")} />

          <FormField
            label="Contato do responsável"
            hint="Pode ser telefone ou e-mail para retorno."
            error={errors.ownerContact?.message}
          >
            <Input
              {...register("ownerContact")}
              placeholder="(11) 99999-9999 ou voce@email.com"
            />
          </FormField>

          <FormField label="Nome do pet" error={errors.petName?.message}>
            <Input {...register("petName")} placeholder="Ex.: Amora" />
          </FormField>

          <FormField label="Espécie do pet" error={errors.petSpecies?.message}>
            <Input {...register("petSpecies")} placeholder="Ex.: Cachorro" />
          </FormField>

          {errors.serviceId?.message ? (
            <p className="text-xs text-content-danger">{errors.serviceId.message}</p>
          ) : null}
          {errors.professionalId?.message ? (
            <p className="text-xs text-content-danger">
              {errors.professionalId.message}
            </p>
          ) : null}
          {errors.slotStart?.message ? (
            <p className="text-xs text-content-danger">{errors.slotStart.message}</p>
          ) : null}
          {submissionError ? (
            <p className="text-sm text-content-danger">{submissionError}</p>
          ) : null}

          <Button type="submit" className="w-full" loading={isSubmitting}>
            Enviar solicitação de reserva
          </Button>
        </form>
      </Card>
    </div>
  );
}
