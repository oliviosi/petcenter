import { Card } from "@/components/ui/Card";

export function CatalogListSkeleton() {
  return (
    <div
      className="grid gap-6 lg:grid-cols-2"
      aria-label="Carregando petshops"
      role="status"
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} className="space-y-5 p-6">
          <div className="h-6 w-2/3 animate-pulse rounded-full bg-surface-muted" />
          <div className="space-y-3">
            <div className="h-4 w-full animate-pulse rounded-full bg-surface-muted" />
            <div className="h-4 w-5/6 animate-pulse rounded-full bg-surface-muted" />
          </div>
          <div className="space-y-3">
            <div className="h-4 w-1/2 animate-pulse rounded-full bg-surface-muted" />
            <div className="h-4 w-2/5 animate-pulse rounded-full bg-surface-muted" />
          </div>
          <div className="h-10 w-36 animate-pulse rounded-xl bg-surface-muted" />
        </Card>
      ))}
    </div>
  );
}
