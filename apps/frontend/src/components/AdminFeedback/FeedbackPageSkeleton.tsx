import { Card } from "@/components/ui/Card";

export function FeedbackPageSkeleton() {
  return (
    <div className="grid gap-6" role="status" aria-label="Carregando feedback">
      <Card className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <div className="h-4 w-32 rounded-full bg-surface-muted" />
              <div className="h-4 w-80 rounded-full bg-surface-muted" />
            </div>
            <div className="flex gap-3">
              <div className="h-10 w-32 rounded-xl bg-surface-muted" />
              <div className="h-10 w-36 rounded-xl bg-surface-muted" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <div className="h-4 w-16 rounded-full bg-surface-muted" />
                <div className="h-12 w-full rounded-2xl bg-surface-muted" />
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 w-28 rounded-full bg-surface-muted" />
              <div className="h-10 w-32 rounded-full bg-surface-muted" />
              <div className="h-4 w-full rounded-full bg-surface-muted" />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)]">
        <Card className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 w-48 rounded-full bg-surface-muted" />
            <div className="h-4 w-full rounded-full bg-surface-muted" />
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="rounded-2xl bg-surface-muted p-4">
                <div className="space-y-3">
                  <div className="h-4 w-36 rounded-full bg-surface-card" />
                  <div className="h-4 w-48 rounded-full bg-surface-card" />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          <div className="animate-pulse space-y-2">
            <div className="h-6 w-44 rounded-full bg-surface-muted" />
            <div className="h-4 w-full rounded-full bg-surface-muted" />
          </div>
          {Array.from({ length: 2 }).map((_, index) => (
            <Card key={index} className="p-6">
              <div className="animate-pulse space-y-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-3">
                    <div className="h-6 w-28 rounded-full bg-surface-muted" />
                    <div className="h-5 w-40 rounded-full bg-surface-muted" />
                  </div>
                  <div className="h-9 w-28 rounded-xl bg-surface-muted" />
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="h-24 rounded-2xl bg-surface-muted" />
                  <div className="h-24 rounded-2xl bg-surface-muted" />
                </div>
                <div className="h-24 rounded-2xl bg-surface-muted" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
