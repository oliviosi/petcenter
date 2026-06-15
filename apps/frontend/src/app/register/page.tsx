import { Card } from "@/components/ui/Card";
import { ClientRegisterForm } from "@/components/ClientAuth/ClientRegisterForm";
import { PawPrint } from "lucide-react";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-surface-page">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl gap-10 px-6 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-brand-soft text-content-brand">
              <PawPrint className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-content-secondary">PetCare Pro</p>
              <h1 className="text-3xl font-semibold text-content-primary">Crie sua conta</h1>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="max-w-2xl text-4xl font-semibold tracking-tight text-content-primary">Comece a agendar para seus pets</h2>
            <p className="max-w-2xl text-base text-content-secondary">Cadastro rápido para clientes: informe nome, e-mail e senha.</p>
          </div>
        </div>

        <Card className="p-8">
          <div className="space-y-6">
            <ClientRegisterForm />
          </div>
        </Card>
      </div>
    </main>
  );
}
