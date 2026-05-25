import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

type BookingFeedbackStateTone =
  | "brand"
  | "success"
  | "warning"
  | "danger"
  | "neutral";

const toneClasses: Record<BookingFeedbackStateTone, string> = {
  brand: "bg-surface-brand-soft text-content-brand",
  success: "bg-surface-success-soft text-content-success",
  warning: "bg-surface-warning-soft text-content-warning",
  danger: "bg-surface-danger-soft text-content-danger",
  neutral: "bg-surface-muted text-content-secondary",
};

interface BookingFeedbackStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  detail?: string;
  tone?: BookingFeedbackStateTone;
  actions?: React.ReactNode;
}

export function BookingFeedbackState({
  icon: Icon,
  title,
  description,
  detail,
  tone = "neutral",
  actions,
}: BookingFeedbackStateProps) {
  return (
    <Card className="p-8">
      <div className="flex flex-col items-start gap-5">
        <div
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-full",
            toneClasses[tone],
          )}
        >
          <Icon className="h-7 w-7" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-content-primary">{title}</h2>
          <p className="max-w-2xl text-sm text-content-secondary">
            {description}
          </p>
          {detail ? (
            <p className="text-sm text-content-muted">{detail}</p>
          ) : null}
        </div>

        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    </Card>
  );
}
