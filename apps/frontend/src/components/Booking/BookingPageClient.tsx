"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarRange, Clock3 } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { SlotList } from "@/components/Booking/SlotList";
import { PetSelector } from "@/components/Booking/PetSelector";
import { ServiceCard } from "@/components/Booking/ServiceCard";
import { DatePickerHorizontal } from "@/components/Booking/DatePickerHorizontal";
import { BookingSummary } from "@/components/Booking/BookingSummary";
import { PublicRequestErrorState } from "@/components/PublicRequestErrorState";
import { bookingSubmissionSchema } from "@/lib/validations/booking";
import { api } from "@/lib/api";
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
  bookingPath: string;
  submitBookingAction: SubmitBookingAction;
}

export function BookingPageClient({
  petshop,
  filters,
  slots,
  slotsError,
  bookingPath,
  submitBookingAction,
}: BookingPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [selectedPet, setSelectedPet] = useState<{ id?: string; name: string; species: string; avatar?: string } | null>(null);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isSearching, startTransition] = useTransition();

  const [clientSlots, setClientSlots] = useState<PublicBookingSlot[] | null>(null);
  const [clientSlotsError, setClientSlotsError] = useState<string | null>(null);
  const searchParamsString = searchParams.toString();

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

  // Client-side fetch when search params change (DatePickerHorizontal or user form updates)
  useEffect(() => {
    // parse params from URL
    const sp = new URLSearchParams(searchParamsString);
    const serviceId = sp.get("serviceId") || filters.serviceId;
    const professionalId = sp.get("professionalId") || undefined;
    const startDate = sp.get("startDate") || filterDefaults.startDate;
    const endDate = sp.get("endDate") || filterDefaults.endDate;

    let cancelled = false;
    setClientSlotsError(null);
    (async () => {
      try {
        const result = await api.getPublicSlots(petshop.id, {
          serviceId,
          professionalId: professionalId || undefined,
          startDate,
          endDate,
        });
        if (cancelled) return;
        setClientSlots(result);
      } catch (err: any) {
        if (cancelled) return;
        setClientSlotsError(err?.message ?? "Erro ao buscar horários");
        setClientSlots([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [searchParamsString, petshop.id, filters.serviceId, filterDefaults.startDate, filterDefaults.endDate]);


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
      router.replace(`${bookingPath}?${nextParams.toString()}`),
    );
  }

  // helper: select service card and trigger search
  async function selectService(serviceId: string) {
    setValue("serviceId", serviceId, { shouldValidate: true });
    setValue("serviceName", serviceLookup[serviceId] ?? "", { shouldValidate: true });

    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set("serviceId", serviceId);
    // keep other params
    startTransition(() => router.replace(`${bookingPath}?${nextParams.toString()}`));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <Card className="p-6">
          {/* Pet selector */}
          <div className="mb-4">
            <PetSelector
              selectedId={selectedPetId}
              onSelect={(pet) => {
                setValue("petName", pet.name, { shouldValidate: true });
                setValue("petSpecies", pet.species, { shouldValidate: true });
                setSelectedPet({ id: pet.id, name: pet.name, species: pet.species, avatar: pet.avatar });
                setSelectedPetId(pet.id);
              }}
            />
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-content-primary mb-3">Serviços</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {petshop.services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service as any}
                  selected={service.id === filters.serviceId}
                  onClick={() => selectService(service.id)}
                />
              ))}
            </div>
          </div>

          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSearch}>
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
              <div className="flex items-center gap-3">
                <DatePickerHorizontal
                  days={7}
                  selected={filterDefaults.startDate}
                  onSelect={(iso) => {
                    // update search params and trigger server-side re-fetch
                    const nextParams = new URLSearchParams(searchParams.toString());
                    nextParams.set('startDate', iso);
                    // ensure endDate remains or set default window
                    if (!nextParams.get('endDate')) {
                      nextParams.set('endDate', iso);
                    }
                    startTransition(() => router.replace(`${bookingPath}?${nextParams.toString()}`));
                  }}
                />
              </div>
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
            slots={clientSlots ?? slots}
            selectedSlotId={selectedSlotId}
            professionalLookup={professionalLookup}
            onSelect={handleSlotSelect}
          />
          {clientSlotsError ? (
            <div className="text-sm text-content-danger mt-2">{clientSlotsError}</div>
          ) : null}
        )}
      </div>

      <div className="lg:col-span-4">
        <BookingSummary
          total={petshop.services.find(s => s.id === filters.serviceId)?.basePrice ?? 0}
          onConfirm={() => handleSubmit(onSubmit)()}
        >
          {selectedPet && (
            <div className="flex items-center gap-3">
              {selectedPet.avatar ? (
                <img src={selectedPet.avatar} alt={selectedPet.name} className="h-12 w-12 rounded-md object-cover" />
              ) : (
                <div className="h-12 w-12 rounded-md bg-surface-muted" />
              )}
              <div>
                <p className="text-sm font-medium text-content-primary">{selectedPet.name}</p>
                <p className="text-xs text-content-secondary">{selectedPet.species}</p>
              </div>
            </div>
          )}

          <div className="mt-2">
            <p className="text-sm font-medium text-content-primary">Horário selecionado</p>
            <p className="mt-1 text-sm text-content-secondary">{selectedSlotId ? "Pronto para confirmar." : "Escolha um horário disponível."}</p>
          </div>

          <div className="mt-4 text-right">
            <p className="text-sm text-content-secondary">Duração estimada</p>
            <p className="text-lg font-semibold text-content-primary">{petshop.services.find(s => s.id === filters.serviceId)?.durationMinutes ?? 0} min</p>
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

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-content-secondary">Total estimado</p>
                <p className="text-2xl font-bold text-content-primary">
                  {formatCurrency(petshop.services.find(s => s.id === filters.serviceId)?.basePrice ?? 0)}
                </p>
              </div>

              <Button type="submit" className="w-48 rounded-full bg-white text-purple-600" loading={isSubmitting}>
                Confirmar Agendamento
              </Button>
            </div>

            <div className="rounded-2xl border border-stroke-soft bg-surface-muted p-4 text-sm text-content-secondary">
              <strong className="text-content-primary">DICA PRO</strong>
              <p className="mt-2">Adicione hidratação de pelagem por apenas R$ 25,00 extras no checkout.</p>
            </div>
          </div>
        </form>
          </BookingSummary>
        </div>
      </div>
  );
}
