import { addDays, formatISODate } from "@/lib/date";
import { ApiRequestError, api } from "@/lib/api";
import { BookingPageClient } from "@/components/Booking/BookingPageClient";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { submitBookingAction } from "./actions";
import type { BookingSearchFilters, PublicBookingSlot } from "@/types";
import { notFound } from "next/navigation";

interface BookingPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function toSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function isGuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

export default async function BookingPage({
  params,
  searchParams,
}: BookingPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  try {
    const petshop = await api.getPublicPetshopBySlug(slug);

    if (petshop.services.length === 0) {
      notFound();
    }

    const today = formatISODate(new Date());
    const defaultEndDate = formatISODate(addDays(new Date(), 6));
    const requestedServiceId = toSingleValue(resolvedSearchParams.serviceId);
    const selectedService =
      petshop.services.find((service) => service.id === requestedServiceId) ??
      petshop.services[0];

    const filters: BookingSearchFilters = {
      serviceId: selectedService.id,
      professionalId: isGuid(toSingleValue(resolvedSearchParams.professionalId))
        ? toSingleValue(resolvedSearchParams.professionalId)
        : "",
      startDate: toSingleValue(resolvedSearchParams.startDate) || today,
      endDate: toSingleValue(resolvedSearchParams.endDate) || defaultEndDate,
    };

    let slots: PublicBookingSlot[] = [];
    let slotsError: string | null = null;

    try {
      slots = await api.getPublicSlots(petshop.id, {
        serviceId: filters.serviceId,
        professionalId: filters.professionalId || undefined,
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
    } catch (error) {
      slotsError =
        error instanceof Error
          ? error.message
          : "Ocorreu um erro ao buscar os horários.";
    }

    return (
      <PageWrapper
        title={`Solicitar reserva em ${petshop.name}`}
        description="Escolha o serviço, consulte horários disponíveis e envie os dados do responsável e do pet."
      >
        <BookingPageClient
          petshop={petshop}
          filters={filters}
          slots={slots}
          slotsError={slotsError}
          submitBookingAction={submitBookingAction}
        />
      </PageWrapper>
    );
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) {
      notFound();
    }

    throw error;
  }
}
