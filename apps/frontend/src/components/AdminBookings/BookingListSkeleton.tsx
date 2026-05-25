import { Card } from "@/components/ui/Card";

export function BookingListSkeleton() {
  return (
    <div
      role="status"
      aria-label="Carregando reservas"
      className="grid gap-4"
    >
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index} className="p-6">
          <div className="animate-pulse space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div className="h-6 w-28 rounded-full bg-surface-muted" />
              <div className="h-4 w-24 rounded-full bg-surface-muted" />
            </div>
            <div className="space-y-3">
              <div className="h-6 w-56 rounded-full bg-surface-muted" />
              <div className="h-4 w-72 rounded-full bg-surface-muted" />
            </div>
            <div className="grid gap-4 border-t border-stroke-soft pt-5 md:grid-cols-3">
              {Array.from({ length: 3 }).map((__, itemIndex) => (
                <div key={itemIndex} className="space-y-3">
                  <div className="h-4 w-24 rounded-full bg-surface-muted" />
                  <div className="h-4 w-full rounded-full bg-surface-muted" />
                  <div className="h-4 w-3/4 rounded-full bg-surface-muted" />
                </div>
              ))}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
