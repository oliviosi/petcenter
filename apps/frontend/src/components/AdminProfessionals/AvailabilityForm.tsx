"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { weekdayOptions, normalizeTimeValue } from "@/lib/adminScheduling";
import {
  adminAvailabilityFieldsSchema,
  type AdminAvailabilityFieldsValues,
} from "@/lib/validations/adminAvailability";
import type { AdminMutationResult } from "@/types";

interface AvailabilityFormProps {
  title: string;
  description: string;
  submitLabel: string;
  defaultValues?: AdminAvailabilityFieldsValues;
  onSubmit: (
    values: AdminAvailabilityFieldsValues,
  ) => Promise<AdminMutationResult<Extract<keyof AdminAvailabilityFieldsValues, string>>>;
  onCancel?: () => void;
}

export function AvailabilityForm({
  title,
  description,
  submitLabel,
  defaultValues,
  onSubmit,
  onCancel,
}: AvailabilityFormProps) {
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AdminAvailabilityFieldsValues>({
    resolver: zodResolver(adminAvailabilityFieldsSchema),
    defaultValues: defaultValues ?? {
      weekday: "1",
      startTime: "09:00",
      endTime: "18:00",
    },
  });

  useEffect(() => {
    if (!defaultValues) {
      return;
    }

    reset({
      weekday: defaultValues.weekday,
      startTime: normalizeTimeValue(defaultValues.startTime),
      endTime: normalizeTimeValue(defaultValues.endTime),
    });
  }, [defaultValues, reset]);

  async function handleFormSubmit(values: AdminAvailabilityFieldsValues) {
    setFormError(null);
    const result = await onSubmit(values);

    if (!result.success) {
      setFormError(result.message);

      for (const [field, message] of Object.entries(result.fieldErrors ?? {})) {
        if (message) {
          setError(field as keyof AdminAvailabilityFieldsValues, { message });
        }
      }

      return;
    }

    if (!defaultValues) {
      reset({
        weekday: "1",
        startTime: "09:00",
        endTime: "18:00",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-content-primary">{title}</h3>
        <p className="text-sm text-content-secondary">{description}</p>
      </div>

      {formError ? (
        <div className="rounded-2xl border border-content-danger/20 bg-surface-danger-soft px-4 py-3 text-sm text-content-danger">
          {formError}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <FormField label="Dia da semana" error={errors.weekday?.message}>
          <Select {...register("weekday")}>
            {weekdayOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="Hora de início" error={errors.startTime?.message}>
          <Input type="time" {...register("startTime")} />
        </FormField>

        <FormField label="Hora de fim" error={errors.endTime?.message}>
          <Input type="time" {...register("endTime")} />
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
