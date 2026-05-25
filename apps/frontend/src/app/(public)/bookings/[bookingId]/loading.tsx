import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card } from "@/components/ui/Card";

export default function BookingStatusLoading() {
  return (
    <PageWrapper
      title="Consultando reserva"
      description="Estamos verificando o status mais recente da solicitação."
    >
      <Card className="space-y-5 p-8">
        <div className="h-7 w-40 animate-pulse rounded-full bg-surface-muted" />
        <div className="h-10 w-2/3 animate-pulse rounded-full bg-surface-muted" />
        <div className="space-y-3">
          <div className="h-4 w-full animate-pulse rounded-full bg-surface-muted" />
          <div className="h-4 w-5/6 animate-pulse rounded-full bg-surface-muted" />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="h-28 animate-pulse rounded-2xl bg-surface-muted" />
          <div className="h-28 animate-pulse rounded-2xl bg-surface-muted" />
        </div>
      </Card>
    </PageWrapper>
  );
}
