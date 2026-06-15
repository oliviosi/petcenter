"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { buildBookingPath } from "@/lib/storefront";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";

interface Values {
  email: string;
  password: string;
}

export function ClientLoginForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Values>({
    defaultValues: { email: '', password: '' }
  });

  async function onSubmit(values: Values) {
    setFormError(null);
    try {
      const res = await fetch('/clients/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setFormError(data?.message ?? 'Erro ao autenticar.');
        return;
      }

      const data = await res.json();
      // persist token
      localStorage.setItem('client_token', data.token);

      // try to redirect directly to first available petshop booking shell
      try {
        const petshops = await api.listPublicPetshops({
          query: "",
          city: "",
          service: "",
          rating: "",
          orderBy: "rating",
          orderDirection: "desc",
        });

        if (petshops.length > 0) {
          const slug = petshops[0].slug;
          const path = buildBookingPath(slug, "shared-host") ?? 
            `/petshops/${slug}/book`;
          router.replace(path);
          return;
        }
      } catch (err) {
        // ignore and fallback to catalog
      }

      router.replace('/petshops');
    } catch (err) {
      setFormError('Erro de rede.');
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {formError ? (
        <div className="rounded-2xl border border-content-danger/20 bg-surface-danger-soft px-4 py-3 text-sm text-content-danger">
          {formError}
        </div>
      ) : null}

      <FormField label="E-mail" error={errors.email?.message as string | undefined}>
        <Input type="email" autoComplete="email" placeholder="name@example.com" {...register('email', { required: true })} />
      </FormField>

      <FormField label="Senha" error={errors.password?.message as string | undefined}>
        <Input type="password" autoComplete="current-password" placeholder="Senha" {...register('password', { required: true })} />
      </FormField>

      <Button type="submit" className="w-full justify-center bg-yellow-400 text-black" loading={isSubmitting}>
        Entrar
      </Button>

      <div className="mt-4 text-center">
        <div className="my-3 flex items-center gap-3 text-sm text-content-secondary">
          <span className="flex-1 h-px bg-stroke-soft"></span>
          <span>OU</span>
          <span className="flex-1 h-px bg-stroke-soft"></span>
        </div>

        <Button type="button" variant="secondary" className="w-full justify-center mb-3">
          Continuar com Google
        </Button>

        <p className="text-sm text-content-secondary">
          Não tem conta? <a href="/register" className="text-content-brand font-medium">Cadastre-se grátis</a>
        </p>
      </div>
    </form>
  );
}
