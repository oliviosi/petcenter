import { z } from "zod";

export const adminProfessionalFieldsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nome é obrigatório.")
    .max(200, "Nome deve ter no máximo 200 caracteres."),
  specialty: z
    .string()
    .trim()
    .max(200, "Especialidade deve ter no máximo 200 caracteres."),
});

export const createAdminProfessionalSchema = adminProfessionalFieldsSchema;

export const updateAdminProfessionalSchema = adminProfessionalFieldsSchema.extend({
  professionalId: z.string().uuid("Profissional inválido."),
});

export type AdminProfessionalFieldsValues = z.infer<typeof adminProfessionalFieldsSchema>;
export type CreateAdminProfessionalValues = z.infer<typeof createAdminProfessionalSchema>;
export type UpdateAdminProfessionalValues = z.infer<typeof updateAdminProfessionalSchema>;
