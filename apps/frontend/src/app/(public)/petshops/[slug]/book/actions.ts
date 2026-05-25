"use server";

import { ApiRequestError, api } from "@/lib/api";
import { setBookingSession } from "@/lib/bookingSession";
import { bookingSubmissionSchema, type BookingSubmissionValues } from "@/lib/validations/booking";
import type { SubmitBookingActionResult } from "@/types";

function normalizeFieldName(field: string) {
  return `${field.charAt(0).toLowerCase()}${field.slice(1)}`;
}

export async function submitBookingAction(
  values: BookingSubmissionValues,
): Promise<SubmitBookingActionResult> {
  const parsedValues = bookingSubmissionSchema.safeParse(values);

  if (!parsedValues.success) {
    const flattened = parsedValues.error.flatten().fieldErrors;

    return {
      success: false,
      fieldErrors: Object.fromEntries(
        Object.entries(flattened).map(([field, messages]) => [
          field,
          messages?.[0] ?? undefined,
        ]),
      ),
      message: "Revise os dados informados antes de enviar a solicitação.",
    };
  }

  try {
    const response = await api.createBooking({
      petshopId: parsedValues.data.petshopId,
      professionalId: parsedValues.data.professionalId,
      serviceId: parsedValues.data.serviceId,
      slotStart: parsedValues.data.slotStart,
      slotEnd: parsedValues.data.slotEnd,
      ownerContact: parsedValues.data.ownerContact,
      petName: parsedValues.data.petName,
      petSpecies: parsedValues.data.petSpecies,
    });

    await setBookingSession(response.id, {
      statusToken: response.bookingStatusAccessToken,
      petshopSlug: parsedValues.data.petshopSlug,
      petshopName: parsedValues.data.petshopName,
      serviceName: parsedValues.data.serviceName,
      professionalName: parsedValues.data.professionalName,
      ownerContact: parsedValues.data.ownerContact,
      petName: parsedValues.data.petName,
      petSpecies: parsedValues.data.petSpecies,
    });

    return {
      success: true,
      bookingId: response.id,
    };
  } catch (error) {
    if (error instanceof ApiRequestError) {
      const fieldErrors = Object.fromEntries(
        Object.entries(error.fieldErrors ?? {}).map(([field, messages]) => [
          normalizeFieldName(field),
          messages[0],
        ]),
      );

      return {
        success: false,
        fieldErrors,
        message: error.message,
      };
    }

    return {
      success: false,
      message: "Não foi possível enviar a solicitação agora. Tente novamente.",
    };
  }
}
