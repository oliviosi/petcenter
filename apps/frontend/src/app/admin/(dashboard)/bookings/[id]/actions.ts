"use server";

import { ApiRequestError, api } from "@/lib/api";
import { clearAdminSession, requireAdminSession } from "@/lib/adminSession";
import {
  cancelAdminBookingSchema,
  completeAdminBookingSchema,
  noShowAdminBookingSchema,
  type CancelAdminBookingValues,
  type CompleteAdminBookingValues,
  type NoShowAdminBookingValues,
} from "@/lib/validations/adminBookingAction";
import type {
  AdminBookingMutationResult,
  SubmitAdminCancelBookingAction,
  SubmitAdminCompleteBookingAction,
  SubmitAdminNoShowBookingAction,
} from "@/types";

function normalizeFieldName(field: string) {
  return `${field.charAt(0).toLowerCase()}${field.slice(1)}`;
}

function buildValidationErrorResult<FieldName extends string>(
  fieldErrors: Partial<Record<FieldName, string | undefined>>,
  message: string,
): AdminBookingMutationResult<FieldName> {
  return {
    success: false,
    message,
    fieldErrors: Object.fromEntries(
      Object.entries(fieldErrors).map(([field, value]) => [field, value ?? undefined]),
    ) as Partial<Record<FieldName, string>>,
  };
}

async function mapApiError<FieldName extends string>(
  error: ApiRequestError,
): Promise<AdminBookingMutationResult<FieldName>> {
  if (error.status === 401) {
    await clearAdminSession();
    return {
      success: false,
      message: "Sua sessão expirou. Entre novamente para continuar.",
    };
  }

  return {
    success: false,
    message: error.message,
    fieldErrors: Object.fromEntries(
      Object.entries(error.fieldErrors ?? {}).map(([field, messages]) => [
        normalizeFieldName(field),
        messages[0],
      ]),
    ) as Partial<Record<FieldName, string>>,
  };
}

export const submitCompleteBookingAction: SubmitAdminCompleteBookingAction = async (
  values,
) => {
  const parsedValues = completeAdminBookingSchema.safeParse(values);

  if (!parsedValues.success) {
    const flattened = parsedValues.error.flatten().fieldErrors;

    return buildValidationErrorResult(
      Object.fromEntries(
        Object.entries(flattened).map(([field, messages]) => [
          field,
          messages?.[0] ?? undefined,
        ]),
      ) as Partial<Record<keyof CompleteAdminBookingValues, string | undefined>>,
      "Revise os dados da conclusão antes de confirmar.",
    );
  }

  try {
    const session = await requireAdminSession();

    await api.completeAdminBooking(
      parsedValues.data.bookingId,
      {
        finalChargedPrice: Number(
          parsedValues.data.finalChargedPrice.replace(",", "."),
        ),
      },
      session.token,
    );

    return {
      success: true,
      redirectTo: `/admin/bookings/${parsedValues.data.bookingId}?updated=complete`,
    };
  } catch (error) {
    if (error instanceof ApiRequestError) {
      return mapApiError(error);
    }

    return {
      success: false,
      message: "Não foi possível concluir a reserva agora. Tente novamente.",
    };
  }
};

export const submitCancelBookingAction: SubmitAdminCancelBookingAction = async (
  values,
) => {
  const parsedValues = cancelAdminBookingSchema.safeParse(values);

  if (!parsedValues.success) {
    const flattened = parsedValues.error.flatten().fieldErrors;

    return buildValidationErrorResult(
      Object.fromEntries(
        Object.entries(flattened).map(([field, messages]) => [
          field,
          messages?.[0] ?? undefined,
        ]),
      ) as Partial<Record<keyof CancelAdminBookingValues, string | undefined>>,
      "Revise os dados do cancelamento antes de confirmar.",
    );
  }

  try {
    const session = await requireAdminSession();

    await api.cancelAdminBooking(
      parsedValues.data.bookingId,
      {
        reason: parsedValues.data.reason,
      },
      session.token,
    );

    return {
      success: true,
      redirectTo: `/admin/bookings/${parsedValues.data.bookingId}?updated=cancel`,
    };
  } catch (error) {
    if (error instanceof ApiRequestError) {
      return mapApiError(error);
    }

    return {
      success: false,
      message: "Não foi possível cancelar a reserva agora. Tente novamente.",
    };
  }
};

export const submitNoShowBookingAction: SubmitAdminNoShowBookingAction = async (
  values,
) => {
  const parsedValues = noShowAdminBookingSchema.safeParse(values);

  if (!parsedValues.success) {
    const flattened = parsedValues.error.flatten().fieldErrors;

    return buildValidationErrorResult(
      Object.fromEntries(
        Object.entries(flattened).map(([field, messages]) => [
          field,
          messages?.[0] ?? undefined,
        ]),
      ) as Partial<Record<keyof NoShowAdminBookingValues, string | undefined>>,
      "Revise os dados do não comparecimento antes de confirmar.",
    );
  }

  try {
    const session = await requireAdminSession();

    await api.noShowAdminBooking(
      parsedValues.data.bookingId,
      {
        reason: parsedValues.data.reason,
      },
      session.token,
    );

    return {
      success: true,
      redirectTo: `/admin/bookings/${parsedValues.data.bookingId}?updated=no-show`,
    };
  } catch (error) {
    if (error instanceof ApiRequestError) {
      return mapApiError(error);
    }

    return {
      success: false,
      message:
        "Não foi possível registrar o não comparecimento agora. Tente novamente.",
    };
  }
};
