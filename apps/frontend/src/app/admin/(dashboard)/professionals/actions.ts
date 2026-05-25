"use server";

import { z } from "zod";
import {
  buildValidationErrorResult,
  mapAdminApiError,
} from "@/lib/adminAction";
import { ApiRequestError, api } from "@/lib/api";
import { requireAdminSession } from "@/lib/adminSession";
import {
  createAdminProfessionalSchema,
  updateAdminProfessionalSchema,
  type CreateAdminProfessionalValues,
  type UpdateAdminProfessionalValues,
} from "@/lib/validations/adminProfessional";
import type { AdminMutationResult } from "@/types";

const professionalIdSchema = z.string().uuid("Profissional inválido.");
const professionalFieldMap = {
  nome: "name",
  especialidade: "specialty",
} as const;

function normalizeSpecialty(value: string) {
  const trimmedValue = value.trim();
  return trimmedValue ? trimmedValue : undefined;
}

export async function submitCreateProfessionalAction(
  values: CreateAdminProfessionalValues,
): Promise<AdminMutationResult<Extract<keyof CreateAdminProfessionalValues, string>>> {
  const parsedValues = createAdminProfessionalSchema.safeParse(values);

  if (!parsedValues.success) {
    const flattened = parsedValues.error.flatten().fieldErrors;

    return buildValidationErrorResult(
      Object.fromEntries(
        Object.entries(flattened).map(([field, messages]) => [field, messages?.[0] ?? undefined]),
      ) as Partial<Record<keyof CreateAdminProfessionalValues, string | undefined>>,
      "Revise os dados do profissional antes de salvar.",
    );
  }

  try {
    const session = await requireAdminSession();

    await api.createAdminProfessional(
      {
        name: parsedValues.data.name,
        specialty: normalizeSpecialty(parsedValues.data.specialty),
      },
      session.token,
    );

    return {
      success: true,
      message: "Profissional cadastrado com sucesso.",
    };
  } catch (error) {
    if (error instanceof ApiRequestError) {
      return mapAdminApiError(error, professionalFieldMap);
    }

    return {
      success: false,
      message: "Não foi possível cadastrar o profissional agora. Tente novamente.",
    };
  }
}

export async function submitUpdateProfessionalAction(
  professionalId: string,
  values: CreateAdminProfessionalValues,
): Promise<AdminMutationResult<Extract<keyof CreateAdminProfessionalValues, string>>> {
  const parsedValues = updateAdminProfessionalSchema.safeParse({
    professionalId,
    ...values,
  } satisfies UpdateAdminProfessionalValues);

  if (!parsedValues.success) {
    const flattened = parsedValues.error.flatten().fieldErrors;

    return buildValidationErrorResult(
      Object.fromEntries(
        Object.entries(flattened).map(([field, messages]) => [field, messages?.[0] ?? undefined]),
      ) as Partial<Record<keyof UpdateAdminProfessionalValues, string | undefined>>,
      "Revise os dados do profissional antes de salvar as alterações.",
    );
  }

  try {
    const session = await requireAdminSession();

    await api.updateAdminProfessional(
      parsedValues.data.professionalId,
      {
        name: parsedValues.data.name,
        specialty: normalizeSpecialty(parsedValues.data.specialty),
      },
      session.token,
    );

    return {
      success: true,
      message: "Perfil do profissional atualizado com sucesso.",
    };
  } catch (error) {
    if (error instanceof ApiRequestError) {
      return mapAdminApiError(error, professionalFieldMap);
    }

    return {
      success: false,
      message: "Não foi possível atualizar o profissional agora. Tente novamente.",
    };
  }
}

export async function submitActivateProfessionalAction(
  professionalId: string,
): Promise<AdminMutationResult> {
  const parsedProfessionalId = professionalIdSchema.safeParse(professionalId);

  if (!parsedProfessionalId.success) {
    return {
      success: false,
      message: parsedProfessionalId.error.issues[0]?.message ?? "Profissional inválido.",
    };
  }

  try {
    const session = await requireAdminSession();
    await api.activateAdminProfessional(parsedProfessionalId.data, session.token);

    return {
      success: true,
      message: "Profissional reativado com sucesso.",
    };
  } catch (error) {
    if (error instanceof ApiRequestError) {
      return mapAdminApiError(error);
    }

    return {
      success: false,
      message: "Não foi possível reativar o profissional agora. Tente novamente.",
    };
  }
}

export async function submitDeactivateProfessionalAction(
  professionalId: string,
): Promise<AdminMutationResult> {
  const parsedProfessionalId = professionalIdSchema.safeParse(professionalId);

  if (!parsedProfessionalId.success) {
    return {
      success: false,
      message: parsedProfessionalId.error.issues[0]?.message ?? "Profissional inválido.",
    };
  }

  try {
    const session = await requireAdminSession();
    await api.deactivateAdminProfessional(parsedProfessionalId.data, session.token);

    return {
      success: true,
      message: "Profissional desativado com sucesso.",
    };
  } catch (error) {
    if (error instanceof ApiRequestError) {
      return mapAdminApiError(error);
    }

    return {
      success: false,
      message: "Não foi possível desativar o profissional agora. Tente novamente.",
    };
  }
}
