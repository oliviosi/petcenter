import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageWrapper } from "@/components/layout/PageWrapper";

export default function NotFound() {
  return (
    <PageWrapper title="Página não encontrada" description="Não encontramos o conteúdo solicitado.">
      <EmptyState
        icon={SearchX}
        title="Não foi possível localizar esta página"
        description="Verifique o endereço informado ou volte para a descoberta de petshops."
        action={<Button href="/petshops">Voltar para o catálogo</Button>}
      />
    </PageWrapper>
  );
}
