import { Card } from "@/components/ui/Card";

export function PublicProfileSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-3" aria-label="Carregando perfil público" role="status">
      <div className="space-y-6 lg:col-span-2">
        <Card className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 w-56 rounded-full bg-surface-muted" />
            <div className="space-y-3">
              <div className="h-4 w-full rounded-full bg-surface-muted" />
              <div className="h-4 w-5/6 rounded-full bg-surface-muted" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="animate-pulse space-y-5">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="h-28 rounded-2xl bg-surface-muted" />
              <div className="h-28 rounded-2xl bg-surface-muted" />
            </div>
            <div className="space-y-4">
              <div className="h-11 rounded-xl bg-surface-muted" />
              <div className="h-32 rounded-2xl bg-surface-muted" />
              <div className="grid gap-4 md:grid-cols-2">
                <div className="h-11 rounded-xl bg-surface-muted" />
                <div className="h-11 rounded-xl bg-surface-muted" />
              </div>
              <div className="h-24 rounded-2xl bg-surface-muted" />
              <div className="h-24 rounded-2xl bg-surface-muted" />
              <div className="h-11 w-44 rounded-xl bg-surface-muted" />
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-5 w-28 rounded-full bg-surface-muted" />
            <div className="h-10 w-32 rounded-full bg-surface-muted" />
            <div className="space-y-3">
              <div className="h-4 w-full rounded-full bg-surface-muted" />
              <div className="h-4 w-2/3 rounded-full bg-surface-muted" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="animate-pulse space-y-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-12 rounded-2xl bg-surface-muted" />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
