"use server";

import {
  buildValidationErrorResult,
  mapAdminApiError,
} from "@/lib/adminAction";
import { ApiRequestError, api } from "@/lib/api";
import { requireAdminSession } from "@/lib/adminSession";
import {
  adminPublicProfileSchema,
  type AdminPublicProfileValues,
} from "@/lib/validations/adminPublicProfile";
import type { AdminMutationResult } from "@/types";

const publicProfileFieldMap = {
  slug: "slug",
  descricao: "description",
  cidade: "city",
  bairro: "neighborhood",
  resumoContato: "contactSummary",
  resumoEndereco: "addressSummary",
  publica: "isPublished",
} as const;

export async function submitUpdatePublicProfileAction(
  values: AdminPublicProfileValues,
): Promise<AdminMutationResult<Extract<keyof AdminPublicProfileValues, string>>> {
  const parsedValues = adminPublicProfileSchema.safeParse(values);

  if (!parsedValues.success) {
    const flattened = parsedValues.error.flatten().fieldErrors;

    return buildValidationErrorResult(
      Object.fromEntries(
        Object.entries(flattened).map(([field, messages]) => [field, messages?.[0] ?? undefined]),
      ) as Partial<Record<keyof AdminPublicProfileValues, string | undefined>>,
      values.isPublished
        ? "Preencha os campos obrigatórios para publicar a vitrine."
        : "Revise os dados da vitrine antes de salvar.",
    );
  }

  try {
    const session = await requireAdminSession();

    await api.updateAdminPublicProfile(parsedValues.data, session.token);

    return {
      success: true,
      message: parsedValues.data.isPublished
        ? "Perfil público salvo com sucesso. A vitrine já pode aparecer no catálogo."
        : "Perfil salvo com sucesso. O petshop segue oculto do catálogo público.",
    };
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 409) {
      return {
        success: false,
        message: error.message,
        fieldErrors: {
          slug: error.message,
        },
      };
    }

    if (error instanceof ApiRequestError) {
      return mapAdminApiError(error, publicProfileFieldMap);
    }

    return {
      success: false,
      message: "Não foi possível salvar o perfil público agora. Tente novamente.",
    };
  }
}
