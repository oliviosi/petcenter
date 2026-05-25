"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import {
  adminProfessionalFieldsSchema,
  type AdminProfessionalFieldsValues,
} from "@/lib/validations/adminProfessional";
import type { AdminMutationResult } from "@/types";

interface ProfessionalFormProps {
  title: string;
  description: string;
  submitLabel: string;
  defaultValues?: AdminProfessionalFieldsValues;
  onSubmit: (
    values: AdminProfessionalFieldsValues,
  ) => Promise<AdminMutationResult<Extract<keyof AdminProfessionalFieldsValues, string>>>;
  onCancel?: () => void;
}

export function ProfessionalForm({
  title,
  description,
  submitLabel,
  defaultValues,
  onSubmit,
  onCancel,
}: ProfessionalFormProps) {
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AdminProfessionalFieldsValues>({
    resolver: zodResolver(adminProfessionalFieldsSchema),
    defaultValues: defaultValues ?? {
      name: "",
      specialty: "",
    },
  });

  useEffect(() => {
    reset(
      defaultValues ?? {
        name: "",
        specialty: "",
      },
    );
  }, [defaultValues, reset]);

  async function handleFormSubmit(values: AdminProfessionalFieldsValues) {
    setFormError(null);
    const result = await onSubmit(values);

    if (!result.success) {
      setFormError(result.message);

      for (const [field, message] of Object.entries(result.fieldErrors ?? {})) {
        if (message) {
          setError(field as keyof AdminProfessionalFieldsValues, { message });
        }
      }

      return;
    }

    reset(defaultValues ?? { name: "", specialty: "" });
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-content-primary">{title}</h2>
        <p className="text-sm text-content-secondary">{description}</p>
      </div>

      {formError ? (
        <div className="rounded-2xl border border-content-danger/20 bg-surface-danger-soft px-4 py-3 text-sm text-content-danger">
          {formError}
        </div>
      ) : null}

      <FormField label="Nome" error={errors.name?.message}>
        <Input placeholder="Ex.: Ana Paula" {...register("name")} />
      </FormField>

      <FormField
        label="Especialidade"
        error={errors.specialty?.message}
        hint="Opcional. Use para indicar a frente principal de atendimento."
      >
        <Input placeholder="Ex.: Banho e tosa" {...register("specialty")} />
      </FormField>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" loading={isSubmitting}>
          {submitLabel}
        </Button>
        {onCancel ? (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        ) : null}
      </div>
    </form>
  );
}
