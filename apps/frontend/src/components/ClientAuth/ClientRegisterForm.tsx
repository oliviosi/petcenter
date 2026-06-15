"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { api } from "@/lib/api";
import { buildBookingPath } from "@/lib/storefront";

interface Values {
  email: string;
  password: string;
  nome: string;
}

export function ClientRegisterForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Values>({ defaultValues: { email: '', password: '', nome: '' } });

  async function onSubmit(values: Values) {
    setFormError(null);
    try {
      const res = await fetch('/clients/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: values.email, password: values.password, nome: values.nome }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setFormError(data?.message ?? 'Erro ao registrar.');
        return;
      }

      // on success, auto-login
      const loginRes = await fetch('/clients/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: values.email, password: values.password }),
      });

      if (!loginRes.ok) {
        setFormError('Registro realizado, mas falha ao autenticar. Faça login manualmente.');
        router.replace('/login');
        return;
      }

      const data = await loginRes.json();
      localStorage.setItem('client_token', data.token);

      // redirect to first petshop booking if available
      try {
        const petshops = await api.listPublicPetshops({ query: '', city: '', service: '', rating: '', orderBy: 'rating', orderDirection: 'desc' });
        if (petshops.length > 0) {
          const slug = petshops[0].slug;
          const path = buildBookingPath(slug, 'shared-host') ?? `/petshops/${slug}/book`;
          router.replace(path);
          return;
        }
      } catch (e) {
        // fallback
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

      <FormField label="Nome" error={errors.nome?.message as string | undefined}>
        <Input {...register('nome', { required: true })} placeholder="Seu nome" />
      </FormField>

      <FormField label="E-mail" error={errors.email?.message as string | undefined}>
        <Input type="email" autoComplete="email" placeholder="name@example.com" {...register('email', { required: true })} />
      </FormField>

      <FormField label="Senha" error={errors.password?.message as string | undefined}>
        <Input type="password" autoComplete="new-password" placeholder="Escolha uma senha" {...register('password', { required: true })} />
      </FormField>

      <Button type="submit" className="w-full justify-center bg-yellow-400 text-black" loading={isSubmitting}>
        Criar conta
      </Button>

      <p className="text-sm text-content-secondary">Ao se cadastrar, você aceita os termos.</p>
    </form>
  );
}
