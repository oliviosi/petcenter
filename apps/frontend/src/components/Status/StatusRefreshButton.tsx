"use client";

import { useTransition } from "react";
import { RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function StatusRefreshButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="secondary"
      loading={isPending}
      onClick={() => startTransition(() => router.refresh())}
    >
      <RefreshCcw className="h-4 w-4" />
      Atualizar status
    </Button>
  );
}
