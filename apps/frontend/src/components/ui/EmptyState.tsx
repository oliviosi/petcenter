import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-stroke-strong bg-surface-card px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-muted text-content-subtle">
        <Icon className="h-7 w-7" />
      </div>
      <div className="space-y-2">
        <p className="text-base font-semibold text-content-primary">{title}</p>
        <p className="max-w-xl text-sm text-content-secondary">{description}</p>
      </div>
      {action}
    </div>
  );
}
