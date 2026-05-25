import { z } from "zod";

export const bookingSubmissionSchema = z.object({
  petshopId: z.string().uuid("Petshop inválido."),
  petshopSlug: z.string().min(1),
  petshopName: z.string().min(1),
  serviceId: z.string().uuid("Selecione um serviço."),
  serviceName: z.string().min(1),
  professionalId: z.string().uuid("Selecione um horário disponível."),
  professionalName: z.string().min(1, "Selecione um horário disponível."),
  slotStart: z.string().datetime("Selecione um horário disponível."),
  slotEnd: z.string().datetime("Selecione um horário disponível."),
  ownerContact: z
    .string()
    .min(1, "Contato do responsável é obrigatório.")
    .max(200, "Contato do responsável deve ter no máximo 200 caracteres."),
  petName: z
    .string()
    .min(1, "Nome do pet é obrigatório.")
    .max(120, "Nome do pet deve ter no máximo 120 caracteres."),
  petSpecies: z
    .string()
    .min(1, "Espécie do pet é obrigatória.")
    .max(120, "Espécie do pet deve ter no máximo 120 caracteres."),
});

export type BookingSubmissionValues = z.infer<typeof bookingSubmissionSchema>;
