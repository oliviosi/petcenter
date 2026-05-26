import { ArrowRight, CalendarClock, HeartHandshake, Link2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageWrapper } from "@/components/layout/PageWrapper";

const highlights = [
  {
    title: "Entre pela vitrine certa",
    description:
      "Quando o petshop compartilhar o link oficial, o cliente já entra direto na loja certa sem precisar navegar por várias opções.",
    icon: Link2,
  },
  {
    title: "Avance para o agendamento",
    description:
      "A vitrine pública já leva para serviços, profissionais e horários da unidade escolhida.",
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
      title="Cada petshop com sua propria entrada publica"
      description="Use o link compartilhado pela loja para abrir a vitrine certa, consultar servicos e seguir para o agendamento sem depender de uma jornada de descoberta."
      centerContent
    >
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="flex flex-col gap-8 p-8 sm:p-10">
          <div className="space-y-3">
            <span className="inline-flex w-fit rounded-full bg-accent-soft px-3 py-1 text-sm font-medium text-content-accent">
              Entrada publica por petshop
            </span>
            <h2 className="font-heading max-w-2xl text-4xl font-semibold tracking-tight text-content-primary sm:text-5xl">
              A experiencia principal comeca na vitrine do petshop, nao no catalogo.
            </h2>
            <p className="max-w-2xl text-base leading-7 text-content-secondary">
              Quando o cliente recebe o link da loja, ele ja entra no contexto certo para ver
              apresentacao, servicos, profissionais e dar continuidade a reserva do pet.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href="/petshops" variant="secondary">
              Abrir catalogo secundario
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        <Card className="grid gap-5 bg-surface-emphasis p-8 text-content-inverse">
          <div className="space-y-2">
            <p className="text-sm font-medium text-content-inverse/80">Como funciona</p>
            <h2 className="font-heading text-3xl font-semibold">
              Shell neutra para orientar a entrada correta
            </h2>
          </div>
          <ol className="space-y-4 text-sm text-content-inverse/80">
            <li>1. O cliente abre o link recebido do petshop ou confirma a loja certa.</li>
            <li>2. A vitrine publica apresenta servicos, profissionais e contexto da unidade.</li>
            <li>
              3. O andamento da reserva continua assicrono, com status e feedback vinculados ao mesmo fluxo.
            </li>
          </ol>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {highlights.map(({ title, description, icon: Icon }) => (
          <Card key={title} className="flex h-full flex-col gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-content-accent">
              <Icon className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-heading text-xl font-semibold text-content-primary">{title}</h3>
              <p className="text-sm text-content-secondary">{description}</p>
            </div>
          </Card>
        ))}
      </div>
    </PageWrapper>
  );
}
