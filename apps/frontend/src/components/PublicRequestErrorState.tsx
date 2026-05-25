"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

interface PublicRequestErrorStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onRetry?: () => void;
}

export function PublicRequestErrorState({
  title,
  description,
  actionLabel = "Tentar novamente",
  onRetry,
}: PublicRequestErrorStateProps) {
  return (
    <EmptyState
      icon={AlertTriangle}
      title={title}
      description={description}
      action={
        onRetry ? (
          <Button type="button" onClick={onRetry}>
            {actionLabel}
          </Button>
        ) : null
      }
    />
  );
}
