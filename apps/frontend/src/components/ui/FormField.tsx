import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  error,
  hint,
  children,
  className,
}: FormFieldProps) {
  return (
    <label className={cn("flex flex-col gap-2", className)}>
      <span className="text-sm font-medium text-content-secondary">{label}</span>
      {children}
      {hint ? <span className="text-xs text-content-muted">{hint}</span> : null}
      {error ? <span className="text-xs text-content-danger">{error}</span> : null}
    </label>
  );
}
