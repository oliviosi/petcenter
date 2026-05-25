import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type SetupNoticeTone = "info" | "success" | "warning" | "danger";

interface SetupNoticeProps {
  title: string;
  description: string;
  tone?: SetupNoticeTone;
  className?: string;
}

const toneClasses: Record<SetupNoticeTone, string> = {
  info: "border-stroke-brand/40 bg-surface-brand-soft text-content-brand",
  success: "border-content-success/20 bg-surface-success-soft text-content-success",
  warning: "border-content-warning/20 bg-surface-warning-soft text-content-warning",
  danger: "border-content-danger/20 bg-surface-danger-soft text-content-danger",
};

const toneIcons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: AlertTriangle,
} satisfies Record<SetupNoticeTone, React.ComponentType<{ className?: string }>>;

export function SetupNotice({
  title,
  description,
  tone = "info",
  className,
}: SetupNoticeProps) {
  const Icon = toneIcons[tone];

  return (
    <div
      className={cn(
        "flex gap-3 rounded-2xl border px-4 py-4",
        toneClasses[tone],
        className,
      )}
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" />
      <div className="space-y-1">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-sm">{description}</p>
      </div>
    </div>
  );
}
