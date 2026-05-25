import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card } from "@/components/ui/Card";

export default function PetshopDetailLoading() {
  return (
    <PageWrapper
      title="Carregando petshop"
      description="Estamos preparando os dados públicos do petshop selecionado."
    >
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card className="space-y-5 p-8">
          <div className="h-6 w-24 animate-pulse rounded-full bg-surface-muted" />
          <div className="h-10 w-1/2 animate-pulse rounded-full bg-surface-muted" />
          <div className="space-y-3">
            <div className="h-4 w-full animate-pulse rounded-full bg-surface-muted" />
            <div className="h-4 w-5/6 animate-pulse rounded-full bg-surface-muted" />
          </div>
        </Card>
        <Card className="space-y-5 p-8">
          <div className="h-8 w-2/3 animate-pulse rounded-full bg-surface-muted" />
          <div className="h-24 w-full animate-pulse rounded-2xl bg-surface-muted" />
          <div className="h-11 w-full animate-pulse rounded-xl bg-surface-muted" />
        </Card>
      </div>
    </PageWrapper>
  );
}
