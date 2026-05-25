"use client";

import { PublicRequestErrorState } from "@/components/PublicRequestErrorState";
import { PageWrapper } from "@/components/layout/PageWrapper";

interface PetshopsErrorPageProps {
  error: Error;
  reset: () => void;
}

export default function PetshopsErrorPage({
  error,
  reset,
}: PetshopsErrorPageProps) {
  return (
    <PageWrapper
      title="Não foi possível carregar o catálogo"
      description="Você ainda pode tentar novamente sem perder o contexto da jornada pública."
    >
      <PublicRequestErrorState
        title="Erro ao consultar petshops"
        description={error.message}
        onRetry={reset}
      />
    </PageWrapper>
  );
}
