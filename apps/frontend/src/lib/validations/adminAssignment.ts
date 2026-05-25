import { z } from "zod";

export const createAdminProfessionalAssignmentSchema = z.object({
  professionalId: z.string().uuid("Profissional inválido."),
  serviceId: z.string().uuid("Selecione um serviço válido."),
});

export const deleteAdminProfessionalAssignmentSchema = z.object({
  professionalId: z.string().uuid("Profissional inválido."),
  serviceId: z.string().uuid("Serviço inválido."),
});

export type CreateAdminProfessionalAssignmentValues = z.infer<
  typeof createAdminProfessionalAssignmentSchema
>;

export type DeleteAdminProfessionalAssignmentValues = z.infer<
  typeof deleteAdminProfessionalAssignmentSchema
>;
