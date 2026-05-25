"use server";

import { z } from "zod";
import {
  buildValidationErrorResult,
  mapAdminApiError,
} from "@/lib/adminAction";
import { ApiRequestError, api } from "@/lib/api";
import { requireAdminSession } from "@/lib/adminSession";
import {
  createAdminServiceSchema,
  updateAdminServiceSchema,
  type CreateAdminServiceValues,
  type UpdateAdminServiceValues,
} from "@/lib/validations/adminService";
import type { AdminMutationResult } from "@/types";

const serviceIdSchema = z.string().uuid("Serviço inválido.");
const serviceFieldMap = {
  nome: "name",
  duracaoMinutos: "durationMinutes",
  precoBase: "basePrice",
} as const;

function toNumber(value: string) {
  return Number(value.replace(",", "."));
}

export async function submitCreateServiceAction(
  values: CreateAdminServiceValues,
): Promise<AdminMutationResult<Extract<keyof CreateAdminServiceValues, string>>> {
  const parsedValues = createAdminServiceSchema.safeParse(values);

  if (!parsedValues.success) {
    const flattened = parsedValues.error.flatten().fieldErrors;

    return buildValidationErrorResult(
      Object.fromEntries(
        Object.entries(flattened).map(([field, messages]) => [field, messages?.[0] ?? undefined]),
      ) as Partial<Record<keyof CreateAdminServiceValues, string | undefined>>,
      "Revise os dados do serviço antes de salvar.",
    );
  }

  try {
    const session = await requireAdminSession();

    await api.createAdminService(
      {
        name: parsedValues.data.name,
        durationMinutes: Number(parsedValues.data.durationMinutes),
        basePrice: toNumber(parsedValues.data.basePrice),
      },
      session.token,
    );

    return {
      success: true,
      message: "Serviço cadastrado com sucesso.",
    };
  } catch (error) {
    if (error instanceof ApiRequestError) {
      return mapAdminApiError(error, serviceFieldMap);
    }

    return {
      success: false,
      message: "Não foi possível cadastrar o serviço agora. Tente novamente.",
    };
  }
}

export async function submitUpdateServiceAction(
  serviceId: string,
  values: CreateAdminServiceValues,
): Promise<AdminMutationResult<Extract<keyof CreateAdminServiceValues, string>>> {
  const parsedValues = updateAdminServiceSchema.safeParse({
    serviceId,
    ...values,
  } satisfies UpdateAdminServiceValues);

  if (!parsedValues.success) {
    const flattened = parsedValues.error.flatten().fieldErrors;

    return buildValidationErrorResult(
      Object.fromEntries(
        Object.entries(flattened).map(([field, messages]) => [field, messages?.[0] ?? undefined]),
      ) as Partial<Record<keyof UpdateAdminServiceValues, string | undefined>>,
      "Revise os dados do serviço antes de salvar as alterações.",
    );
  }

  try {
    const session = await requireAdminSession();

    await api.updateAdminService(
      parsedValues.data.serviceId,
      {
        name: parsedValues.data.name,
        durationMinutes: Number(parsedValues.data.durationMinutes),
        basePrice: toNumber(parsedValues.data.basePrice),
      },
      session.token,
    );

    return {
      success: true,
      message: "Serviço atualizado com sucesso.",
    };
  } catch (error) {
    if (error instanceof ApiRequestError) {
      return mapAdminApiError(error, serviceFieldMap);
    }

    return {
      success: false,
      message: "Não foi possível atualizar o serviço agora. Tente novamente.",
    };
  }
}

export async function submitActivateServiceAction(
  serviceId: string,
): Promise<AdminMutationResult> {
  const parsedServiceId = serviceIdSchema.safeParse(serviceId);

  if (!parsedServiceId.success) {
    return {
      success: false,
      message: parsedServiceId.error.issues[0]?.message ?? "Serviço inválido.",
    };
  }

  try {
    const session = await requireAdminSession();
    await api.activateAdminService(parsedServiceId.data, session.token);

    return {
      success: true,
      message: "Serviço reativado com sucesso.",
    };
  } catch (error) {
    if (error instanceof ApiRequestError) {
      return mapAdminApiError(error);
    }

    return {
      success: false,
      message: "Não foi possível reativar o serviço agora. Tente novamente.",
    };
  }
}

export async function submitDeactivateServiceAction(
  serviceId: string,
): Promise<AdminMutationResult> {
  const parsedServiceId = serviceIdSchema.safeParse(serviceId);

  if (!parsedServiceId.success) {
    return {
      success: false,
      message: parsedServiceId.error.issues[0]?.message ?? "Serviço inválido.",
    };
  }

  try {
    const session = await requireAdminSession();
    await api.deactivateAdminService(parsedServiceId.data, session.token);

    return {
      success: true,
      message: "Serviço desativado com sucesso.",
    };
  } catch (error) {
    if (error instanceof ApiRequestError) {
      return mapAdminApiError(error);
    }

    return {
      success: false,
      message: "Não foi possível desativar o serviço agora. Tente novamente.",
    };
  }
}
