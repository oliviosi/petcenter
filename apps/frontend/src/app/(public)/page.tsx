import { ArrowRight, CalendarClock, HeartHandshake, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageWrapper } from "@/components/layout/PageWrapper";

const highlights = [
  {
    title: "Encontre o petshop ideal",
    description:
      "Veja as opções disponíveis, compare localização, serviços e reputação sem precisar criar conta.",
    icon: Search,
  },
  {
    title: "Solicite o melhor horário",
    description:
      "Escolha serviço, profissional e horário disponível para enviar a solicitação da reserva do seu pet.",
    icon: CalendarClock,
  },
  {
    title: "Acompanhe o andamento",
    description:
      "A confirmação é assíncrona. Acompanhe o status da reserva com mensagens claras em cada etapa.",
    icon: HeartHandshake,
  },
];

export default function HomePage() {
  return (
    <PageWrapper
      title="Reserve com clareza para o seu pet"
      description="Descubra petshops, confira disponibilidade e acompanhe a solicitação sem depender de login."
      centerContent
    >
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="flex flex-col gap-6 bg-surface-card p-8">
          <div className="space-y-3">
            <span className="inline-flex w-fit rounded-full bg-surface-brand-soft px-3 py-1 text-sm font-medium text-content-brand">
              Jornada pública de reservas
            </span>
            <h2 className="max-w-2xl text-4xl font-semibold tracking-tight text-content-primary">
              Descubra serviços e solicite atendimento com transparência.
            </h2>
            <p className="max-w-2xl text-base text-content-secondary">
              O petcenter ajuda você a encontrar o petshop certo e enviar uma
              solicitação de reserva com dados essenciais do responsável e do
              pet.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href="/petshops">
              Ver petshops
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              href="/petshops?orderBy=rating&orderDirection=desc"
              variant="secondary"
            >
              Explorar mais bem avaliados
            </Button>
          </div>
        </Card>

        <Card className="grid gap-4 bg-surface-emphasis p-8 text-content-inverse">
          <div className="space-y-2">
            <p className="text-sm font-medium text-content-inverse/80">
              Como funciona
            </p>
            <h2 className="text-2xl font-semibold">Solicitação assíncrona</h2>
          </div>
          <ol className="space-y-4 text-sm text-content-inverse/80">
            <li>1. Escolha um petshop e confira os serviços disponíveis.</li>
            <li>2. Selecione um horário livre e envie os dados do seu pet.</li>
            <li>
              3. Acompanhe o andamento depois do envio sem assumir confirmação
              imediata.
            </li>
          </ol>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {highlights.map(({ title, description, icon: Icon }) => (
          <Card key={title} className="flex h-full flex-col gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-brand-soft text-content-brand">
              <Icon className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-content-primary">
                {title}
              </h3>
              <p className="text-sm text-content-secondary">{description}</p>
            </div>
          </Card>
        ))}
      </div>
    </PageWrapper>
  );
}
