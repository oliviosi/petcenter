import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

interface DashboardErrorStateProps {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}

export function DashboardErrorState({
  title,
  description,
  actionHref,
  actionLabel = "Voltar para a fila",
}: DashboardErrorStateProps) {
  return (
    <EmptyState
      icon={AlertTriangle}
      title={title}
      description={description}
      action={
        actionHref ? (
          <Button href={actionHref} variant="secondary">
            {actionLabel}
          </Button>
        ) : null
      }
    />
  );
}
