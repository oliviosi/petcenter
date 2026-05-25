import { Card } from "@/components/ui/Card";

export function BookingDetailSkeleton() {
  return (
    <div
      role="status"
      aria-label="Carregando detalhes da reserva"
      className="grid gap-6"
    >
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-28 rounded-full bg-surface-muted" />
          <div className="h-8 w-72 rounded-full bg-surface-muted" />
          <div className="h-4 w-80 rounded-full bg-surface-muted" />
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-5 w-40 rounded-full bg-surface-muted" />
              {Array.from({ length: 4 }).map((__, lineIndex) => (
                <div
                  key={lineIndex}
                  className="h-4 w-full rounded-full bg-surface-muted"
                />
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
