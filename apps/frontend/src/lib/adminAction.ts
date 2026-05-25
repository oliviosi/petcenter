import { clearAdminSession } from "@/lib/adminSession";
import { ApiRequestError } from "@/lib/api";
import type { AdminMutationResult } from "@/types";

export function normalizeFieldName(field: string) {
  return `${field.charAt(0).toLowerCase()}${field.slice(1)}`;
}

export function buildValidationErrorResult<FieldName extends string>(
  fieldErrors: Partial<Record<FieldName, string | undefined>>,
  message: string,
): AdminMutationResult<FieldName> {
  return {
    success: false,
    message,
    fieldErrors: Object.fromEntries(
      Object.entries(fieldErrors).map(([field, value]) => [field, value ?? undefined]),
    ) as Partial<Record<FieldName, string>>,
  };
}

export async function mapAdminApiError<FieldName extends string>(
  error: ApiRequestError,
  fieldMap?: Record<string, FieldName>,
): Promise<AdminMutationResult<FieldName>> {
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
        fieldMap?.[normalizeFieldName(field)] ?? normalizeFieldName(field),
        messages[0],
      ]),
    ) as Partial<Record<FieldName, string>>,
  };
}
