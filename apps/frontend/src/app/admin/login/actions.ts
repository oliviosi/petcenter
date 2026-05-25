"use server";

import { redirect } from "next/navigation";
import { ApiRequestError, api } from "@/lib/api";
import { clearAdminSession, setAdminSession } from "@/lib/adminSession";
import { adminLoginSchema, type AdminLoginValues } from "@/lib/validations/adminLogin";
import type { SubmitAdminLoginActionResult } from "@/types";

function normalizeFieldName(field: string) {
  return `${field.charAt(0).toLowerCase()}${field.slice(1)}`;
}

export async function submitAdminLoginAction(
  values: AdminLoginValues,
): Promise<SubmitAdminLoginActionResult> {
  const parsedValues = adminLoginSchema.safeParse(values);

  if (!parsedValues.success) {
    const flattened = parsedValues.error.flatten().fieldErrors;

    return {
      success: false,
      message: "Revise os dados informados antes de entrar.",
      fieldErrors: Object.fromEntries(
        Object.entries(flattened).map(([field, messages]) => [
          field,
          messages?.[0] ?? undefined,
        ]),
      ),
    };
  }

  try {
    const session = await api.login(parsedValues.data);
    await setAdminSession(session);

    return {
      success: true,
      redirectTo: "/admin/bookings",
    };
  } catch (error) {
    if (error instanceof ApiRequestError) {
      return {
        success: false,
        message: error.message,
        fieldErrors: Object.fromEntries(
          Object.entries(error.fieldErrors ?? {}).map(([field, messages]) => [
            normalizeFieldName(field),
            messages[0],
          ]),
        ),
      };
    }

    return {
      success: false,
      message: "Não foi possível entrar agora. Tente novamente em instantes.",
    };
  }
}

export async function logoutAdminAction() {
  await clearAdminSession();
  redirect("/admin/login");
}
