import { PawPrint } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ClientLoginForm } from "@/components/ClientAuth/ClientLoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-surface-page">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl gap-10 px-6 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <div className="relative hidden h-[560px] w-full overflow-hidden rounded-2xl bg-cover bg-center lg:block" style={{ backgroundImage: `linear-gradient(90deg, rgba(80,0,120,0.6), rgba(120,0,160,0.3)), url('https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?auto=format&fit=crop&w=1200&q=80')` }}>
            <div className="absolute bottom-6 left-6 max-w-xs text-white">
              <h3 className="text-2xl font-semibold">Your pet's happiness is our daily mission.</h3>
              <p className="mt-2 text-sm">Join thousands of happy owners who trust our professional care team for their furry best friends.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-brand-soft text-content-brand">
              <PawPrint className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-content-secondary">PetCare Pro</p>
              <h1 className="text-3xl font-semibold text-content-primary">Bem-vindo ao PetCare</h1>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="max-w-2xl text-4xl font-semibold tracking-tight text-content-primary">
              Your pet's happiness is our daily mission.
            </h2>
            <p className="max-w-2xl text-base text-content-secondary">
              Join thousands of happy owners who trust our professional care team for their furry best friends.
            </p>
          </div>
        </div>

        <Card className="p-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-content-primary">Welcome Back!</h2>
              <p className="text-sm text-content-secondary">Please enter your details to sign in.</p>
            </div>

            <ClientLoginForm />

          </div>
        </Card>
      </div>
    </main>
  );
}
