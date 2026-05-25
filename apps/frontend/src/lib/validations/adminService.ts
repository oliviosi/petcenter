import { z } from "zod";

function isValidDecimal(value: string) {
  const normalized = Number(value.replace(",", "."));
  return !Number.isNaN(normalized);
}

export const adminServiceFieldsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nome é obrigatório.")
    .max(200, "Nome deve ter no máximo 200 caracteres."),
  durationMinutes: z
    .string()
    .trim()
    .min(1, "Duração é obrigatória.")
    .refine((value) => /^\d+$/.test(value), {
      message: "Duração deve ser informada em minutos inteiros.",
    })
    .refine((value) => Number(value) > 0, {
      message: "Duração deve ser maior que zero.",
    }),
  basePrice: z
    .string()
    .trim()
    .min(1, "Preço base é obrigatório.")
    .refine(isValidDecimal, {
      message: "Informe um preço base válido.",
    })
    .refine((value) => Number(value.replace(",", ".")) >= 0, {
      message: "Preço base não pode ser negativo.",
    })
    .refine((value) => {
      const normalizedValue = Number(value.replace(",", "."));
      return Number(normalizedValue.toFixed(2)) === normalizedValue;
    }, {
      message: "Preço base deve ter no máximo 2 casas decimais.",
    }),
});

export const createAdminServiceSchema = adminServiceFieldsSchema;

export const updateAdminServiceSchema = adminServiceFieldsSchema.extend({
  serviceId: z.string().uuid("Serviço inválido."),
});

export type AdminServiceFieldsValues = z.infer<typeof adminServiceFieldsSchema>;
export type CreateAdminServiceValues = z.infer<typeof createAdminServiceSchema>;
export type UpdateAdminServiceValues = z.infer<typeof updateAdminServiceSchema>;
