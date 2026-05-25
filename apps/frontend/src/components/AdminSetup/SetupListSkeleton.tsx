import { Card } from "@/components/ui/Card";

interface SetupListSkeletonProps {
  ariaLabel: string;
  cards?: number;
}

export function SetupListSkeleton({
  ariaLabel,
  cards = 3,
}: SetupListSkeletonProps) {
  return (
    <div role="status" aria-label={ariaLabel} className="grid gap-4">
      {Array.from({ length: cards }).map((_, index) => (
        <Card key={index} className="p-6">
          <div className="animate-pulse space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div className="h-6 w-40 rounded-full bg-surface-muted" />
              <div className="h-6 w-24 rounded-full bg-surface-muted" />
            </div>
            <div className="space-y-3">
              <div className="h-4 w-52 rounded-full bg-surface-muted" />
              <div className="h-4 w-64 rounded-full bg-surface-muted" />
            </div>
            <div className="flex flex-wrap gap-3 border-t border-stroke-soft pt-5">
              <div className="h-10 w-32 rounded-2xl bg-surface-muted" />
              <div className="h-10 w-28 rounded-2xl bg-surface-muted" />
              <div className="h-10 w-36 rounded-2xl bg-surface-muted" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
