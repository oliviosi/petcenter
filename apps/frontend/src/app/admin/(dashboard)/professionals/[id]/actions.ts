"use server";

import {
  buildValidationErrorResult,
  mapAdminApiError,
} from "@/lib/adminAction";
import { ApiRequestError, api } from "@/lib/api";
import { requireAdminSession } from "@/lib/adminSession";
import {
  createAdminProfessionalAssignmentSchema,
  deleteAdminProfessionalAssignmentSchema,
  type CreateAdminProfessionalAssignmentValues,
} from "@/lib/validations/adminAssignment";
import {
  createAdminAvailabilitySchema,
  deleteAdminAvailabilitySchema,
  updateAdminAvailabilitySchema,
  type AdminAvailabilityFieldsValues,
} from "@/lib/validations/adminAvailability";
import type { AdminMutationResult } from "@/types";

const availabilityFieldMap = {
  diaSemana: "weekday",
  horaInicio: "startTime",
  horaFim: "endTime",
  profissionalId: "professionalId",
} as const;

const assignmentFieldMap = {
  professionalId: "professionalId",
  serviceId: "serviceId",
} as const;

export async function submitCreateProfessionalAssignmentAction(
  values: CreateAdminProfessionalAssignmentValues,
): Promise<AdminMutationResult<Extract<keyof CreateAdminProfessionalAssignmentValues, string>>> {
  const parsedValues = createAdminProfessionalAssignmentSchema.safeParse(values);

  if (!parsedValues.success) {
    const flattened = parsedValues.error.flatten().fieldErrors;

    return buildValidationErrorResult(
      Object.fromEntries(
        Object.entries(flattened).map(([field, messages]) => [field, messages?.[0] ?? undefined]),
      ) as Partial<Record<keyof CreateAdminProfessionalAssignmentValues, string | undefined>>,
      "Revise a atribuição antes de salvar.",
    );
  }

  try {
    const session = await requireAdminSession();
    await api.createAdminProfessionalServiceAssignment(
      parsedValues.data.professionalId,
      {
        serviceId: parsedValues.data.serviceId,
      },
      session.token,
    );

    return {
      success: true,
      message: "Serviço atribuído com sucesso.",
    };
  } catch (error) {
    if (error instanceof ApiRequestError) {
      return mapAdminApiError(error, assignmentFieldMap);
    }

    return {
      success: false,
      message: "Não foi possível atribuir o serviço agora. Tente novamente.",
    };
  }
}

export async function submitDeleteProfessionalAssignmentAction(
  professionalId: string,
  serviceId: string,
): Promise<AdminMutationResult> {
  const parsedValues = deleteAdminProfessionalAssignmentSchema.safeParse({
    professionalId,
    serviceId,
  });

  if (!parsedValues.success) {
    return {
      success: false,
      message: parsedValues.error.issues[0]?.message ?? "Atribuição inválida.",
    };
  }

  try {
    const session = await requireAdminSession();
    await api.deleteAdminProfessionalServiceAssignment(
      parsedValues.data.professionalId,
      parsedValues.data.serviceId,
      session.token,
    );

    return {
      success: true,
      message: "Vínculo removido com sucesso.",
    };
  } catch (error) {
    if (error instanceof ApiRequestError) {
      return mapAdminApiError(error, assignmentFieldMap);
    }

    return {
      success: false,
      message: "Não foi possível remover o vínculo agora. Tente novamente.",
    };
  }
}

export async function submitCreateAvailabilityAction(
  professionalId: string,
  values: AdminAvailabilityFieldsValues,
): Promise<AdminMutationResult<Extract<keyof AdminAvailabilityFieldsValues, string>>> {
  const parsedValues = createAdminAvailabilitySchema.safeParse({
    professionalId,
    ...values,
  });

  if (!parsedValues.success) {
    const flattened = parsedValues.error.flatten().fieldErrors;

    return buildValidationErrorResult(
      Object.fromEntries(
        Object.entries(flattened).map(([field, messages]) => [field, messages?.[0] ?? undefined]),
      ) as Partial<Record<string, string | undefined>>,
      "Revise a disponibilidade antes de salvar.",
    );
  }

  try {
    const session = await requireAdminSession();
    await api.createAdminProfessionalAvailability(
      parsedValues.data.professionalId,
      {
        weekday: Number(parsedValues.data.weekday),
        startTime: parsedValues.data.startTime,
        endTime: parsedValues.data.endTime,
      },
      session.token,
    );

    return {
      success: true,
      message: "Disponibilidade cadastrada com sucesso.",
    };
  } catch (error) {
    if (error instanceof ApiRequestError) {
      return mapAdminApiError(error, availabilityFieldMap);
    }

    return {
      success: false,
      message: "Não foi possível cadastrar a disponibilidade agora. Tente novamente.",
    };
  }
}

export async function submitUpdateAvailabilityAction(
  professionalId: string,
  availabilityId: string,
  values: AdminAvailabilityFieldsValues,
): Promise<AdminMutationResult<Extract<keyof AdminAvailabilityFieldsValues, string>>> {
  const parsedValues = updateAdminAvailabilitySchema.safeParse({
    professionalId,
    availabilityId,
    ...values,
  });

  if (!parsedValues.success) {
    const flattened = parsedValues.error.flatten().fieldErrors;

    return buildValidationErrorResult(
      Object.fromEntries(
        Object.entries(flattened).map(([field, messages]) => [field, messages?.[0] ?? undefined]),
      ) as Partial<Record<string, string | undefined>>,
      "Revise a disponibilidade antes de salvar as alterações.",
    );
  }

  try {
    const session = await requireAdminSession();
    await api.updateAdminProfessionalAvailability(
      parsedValues.data.professionalId,
      parsedValues.data.availabilityId,
      {
        weekday: Number(parsedValues.data.weekday),
        startTime: parsedValues.data.startTime,
        endTime: parsedValues.data.endTime,
      },
      session.token,
    );

    return {
      success: true,
      message: "Disponibilidade atualizada com sucesso.",
    };
  } catch (error) {
    if (error instanceof ApiRequestError) {
      return mapAdminApiError(error, availabilityFieldMap);
    }

    return {
      success: false,
      message: "Não foi possível atualizar a disponibilidade agora. Tente novamente.",
    };
  }
}

export async function submitDeleteAvailabilityAction(
  professionalId: string,
  availabilityId: string,
): Promise<AdminMutationResult> {
  const parsedValues = deleteAdminAvailabilitySchema.safeParse({
    professionalId,
    availabilityId,
  });

  if (!parsedValues.success) {
    return {
      success: false,
      message: parsedValues.error.issues[0]?.message ?? "Disponibilidade inválida.",
    };
  }

  try {
    const session = await requireAdminSession();
    await api.deleteAdminProfessionalAvailability(
      parsedValues.data.professionalId,
      parsedValues.data.availabilityId,
      session.token,
    );

    return {
      success: true,
      message: "Disponibilidade removida com sucesso.",
    };
  } catch (error) {
    if (error instanceof ApiRequestError) {
      return mapAdminApiError(error, availabilityFieldMap);
    }

    return {
      success: false,
      message: "Não foi possível remover a disponibilidade agora. Tente novamente.",
    };
  }
}
