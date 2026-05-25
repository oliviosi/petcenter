import { cn } from "@/lib/utils";

type BadgeTone = "brand" | "success" | "warning" | "danger" | "neutral";

interface BadgeProps {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
}

const toneClasses: Record<BadgeTone, string> = {
  brand: "bg-surface-brand-soft text-content-brand",
  success: "bg-surface-success-soft text-content-success",
  warning: "bg-surface-warning-soft text-content-warning",
  danger: "bg-surface-danger-soft text-content-danger",
  neutral: "bg-surface-muted text-content-secondary",
};

export function Badge({ children, tone = "neutral", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-medium",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
