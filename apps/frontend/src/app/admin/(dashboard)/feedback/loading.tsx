import { FeedbackPageSkeleton } from "@/components/AdminFeedback/FeedbackPageSkeleton";
import { PageWrapper } from "@/components/layout/PageWrapper";

export default function AdminFeedbackLoading() {
  return (
    <PageWrapper
      title="Feedback dos clientes"
      description="Carregando a leitura operacional das avaliações do petshop."
    >
      <FeedbackPageSkeleton />
    </PageWrapper>
  );
}
