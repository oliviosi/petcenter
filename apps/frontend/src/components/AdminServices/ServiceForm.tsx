"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import {
  adminServiceFieldsSchema,
  type AdminServiceFieldsValues,
} from "@/lib/validations/adminService";
import type { AdminMutationResult } from "@/types";

interface ServiceFormProps {
  title: string;
  description: string;
  submitLabel: string;
  defaultValues?: AdminServiceFieldsValues;
  onSubmit: (
    values: AdminServiceFieldsValues,
  ) => Promise<AdminMutationResult<Extract<keyof AdminServiceFieldsValues, string>>>;
  onCancel?: () => void;
}

export function ServiceForm({
  title,
  description,
  submitLabel,
  defaultValues,
  onSubmit,
  onCancel,
}: ServiceFormProps) {
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AdminServiceFieldsValues>({
    resolver: zodResolver(adminServiceFieldsSchema),
    defaultValues: defaultValues ?? {
      name: "",
      durationMinutes: "",
      basePrice: "",
    },
  });

  useEffect(() => {
    reset(
      defaultValues ?? {
        name: "",
        durationMinutes: "",
        basePrice: "",
      },
    );
  }, [defaultValues, reset]);

  async function handleFormSubmit(values: AdminServiceFieldsValues) {
    setFormError(null);
    const result = await onSubmit(values);

    if (!result.success) {
      setFormError(result.message);

      for (const [field, message] of Object.entries(result.fieldErrors ?? {})) {
        if (message) {
          setError(field as keyof AdminServiceFieldsValues, { message });
        }
      }

      return;
    }

    reset(defaultValues ?? { name: "", durationMinutes: "", basePrice: "" });
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
        <Input placeholder="Ex.: Banho premium" {...register("name")} />
      </FormField>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          label="Duração (minutos)"
          error={errors.durationMinutes?.message}
          hint="Informe somente minutos inteiros."
        >
          <Input
            inputMode="numeric"
            placeholder="60"
            {...register("durationMinutes")}
          />
        </FormField>

        <FormField
          label="Preço base"
          error={errors.basePrice?.message}
          hint="Use ponto ou vírgula para centavos."
        >
          <Input inputMode="decimal" placeholder="90,00" {...register("basePrice")} />
        </FormField>
      </div>

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
