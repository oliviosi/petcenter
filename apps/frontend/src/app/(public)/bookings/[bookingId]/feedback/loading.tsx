import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card } from "@/components/ui/Card";

export default function BookingFeedbackLoading() {
  return (
    <PageWrapper
      title="Carregando feedback"
      description="Estamos validando se esta reserva pode receber uma avaliação."
    >
      <Card className="space-y-5 p-8">
        <div className="h-7 w-44 animate-pulse rounded-full bg-surface-muted" />
        <div className="h-10 w-2/3 animate-pulse rounded-full bg-surface-muted" />
        <div className="space-y-3">
          <div className="h-4 w-full animate-pulse rounded-full bg-surface-muted" />
          <div className="h-4 w-5/6 animate-pulse rounded-full bg-surface-muted" />
        </div>
        <div className="grid gap-3 sm:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-24 animate-pulse rounded-2xl bg-surface-muted"
            />
          ))}
        </div>
        <div className="h-32 animate-pulse rounded-2xl bg-surface-muted" />
      </Card>
    </PageWrapper>
  );
}
