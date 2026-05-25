import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card } from "@/components/ui/Card";

export default function BookingLoading() {
  return (
    <PageWrapper
      title="Preparando horários"
      description="Estamos carregando os dados necessários para a sua solicitação."
    >
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="space-y-4 p-6">
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-14 animate-pulse rounded-xl bg-surface-muted"
              />
            ))}
          </div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-28 animate-pulse rounded-2xl bg-surface-muted"
              />
            ))}
          </div>
        </Card>
        <Card className="space-y-4 p-6">
          <div className="h-8 w-2/3 animate-pulse rounded-full bg-surface-muted" />
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-14 animate-pulse rounded-xl bg-surface-muted"
            />
          ))}
        </Card>
      </div>
    </PageWrapper>
  );
}
