"use client";

import { cn } from "@/lib/utils";

const ratingLabels = [
  { value: 1, label: "Péssimo" },
  { value: 2, label: "Ruim" },
  { value: 3, label: "Bom" },
  { value: 4, label: "Muito bom" },
  { value: 5, label: "Excelente" },
] as const;

interface FeedbackRatingFieldProps {
  name: string;
  label: string;
  hint: string;
  value?: number;
  error?: string;
  onChange: (value: number) => void;
}

export function FeedbackRatingField({
  name,
  label,
  hint,
  value,
  error,
  onChange,
}: FeedbackRatingFieldProps) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-medium text-content-secondary">
        {label}
      </legend>
      <p className="text-xs text-content-muted">{hint}</p>

      <div className="grid gap-3 sm:grid-cols-5">
        {ratingLabels.map((option) => {
          const optionId = `${name}-${option.value}`;
          const isSelected = value === option.value;

          return (
            <label
              key={option.value}
              htmlFor={optionId}
              className={cn(
                "flex cursor-pointer flex-col items-center gap-1 rounded-2xl border px-4 py-4 text-center transition",
                isSelected
                  ? "border-stroke-brand bg-surface-brand-soft text-content-brand"
                  : "border-stroke-soft bg-surface-card text-content-secondary hover:border-stroke-strong hover:text-content-primary",
              )}
            >
              <input
                id={optionId}
                type="radio"
                name={name}
                value={option.value}
                checked={isSelected}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              <span className="text-2xl font-semibold">{option.value}</span>
              <span className="text-xs font-medium">{option.label}</span>
            </label>
          );
        })}
      </div>

      {error ? <p className="text-xs text-content-danger">{error}</p> : null}
    </fieldset>
  );
}
