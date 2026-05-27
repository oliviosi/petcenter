import { z } from "zod";

const publicationRequiredFields = [
  {
    field: "slug",
    label: "Slug",
    requiredMessage: "Slug é obrigatório quando a vitrine estiver pública.",
  },
  {
    field: "description",
    label: "Descrição",
    requiredMessage: "Descrição é obrigatória quando a vitrine estiver pública.",
  },
  {
    field: "city",
    label: "Cidade",
    requiredMessage: "Cidade é obrigatória quando a vitrine estiver pública.",
  },
  {
    field: "neighborhood",
    label: "Bairro",
    requiredMessage: "Bairro é obrigatório quando a vitrine estiver pública.",
  },
  {
    field: "contactSummary",
    label: "Resumo de contato",
    requiredMessage: "Resumo de contato é obrigatório quando a vitrine estiver pública.",
  },
  {
    field: "addressSummary",
    label: "Resumo de endereço",
    requiredMessage: "Resumo de endereço é obrigatório quando a vitrine estiver pública.",
  },
] as const;

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const customDomainRegex = /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/;

export const adminPublicProfileSchema = z
  .object({
    slug: z
      .string()
      .trim()
      .max(120, "Slug deve ter no máximo 120 caracteres.")
      .refine((value) => value.length === 0 || slugRegex.test(value), {
        message: "Slug deve conter apenas letras minúsculas, números e hífens.",
      }),
    description: z
      .string()
      .trim()
      .max(1000, "Descrição deve ter no máximo 1000 caracteres."),
    city: z.string().trim().max(120, "Cidade deve ter no máximo 120 caracteres."),
    neighborhood: z.string().trim().max(120, "Bairro deve ter no máximo 120 caracteres."),
    contactSummary: z
      .string()
      .trim()
      .max(300, "Resumo de contato deve ter no máximo 300 caracteres."),
    addressSummary: z
      .string()
      .trim()
      .max(300, "Resumo de endereço deve ter no máximo 300 caracteres."),
    desiredCustomDomain: z
      .string()
      .trim()
      .max(253, "Domínio personalizado deve ter no máximo 253 caracteres.")
      .refine((value) => value.length === 0 || customDomainRegex.test(value), {
        message:
          "Domínio personalizado deve conter um host válido, como agenda.petshop.com.br ou petshop.com.br.",
      }),
    isPublished: z.boolean(),
  })
  .superRefine((values, context) => {
    if (!values.isPublished) {
      return;
    }

    for (const field of publicationRequiredFields) {
      if (!values[field.field].trim()) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: [field.field],
          message: field.requiredMessage,
        });
      }
    }
  });

export type AdminPublicProfileValues = z.infer<typeof adminPublicProfileSchema>;
