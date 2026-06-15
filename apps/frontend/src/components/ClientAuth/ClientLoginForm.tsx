"use client";

import { useState, useEffect } from "react";
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
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? '';
  const [formError, setFormError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Values>({
    defaultValues: { email: '', password: '' }
  });

  // handle OAuth return token (server redirects to /login?client_token=...)
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      const params = new URLSearchParams(window.location.search);
      const token = params.get('client_token');
      if (token) {
        localStorage.setItem('client_token', token);
        params.delete('client_token');
        const url = new URL(window.location.href);
        url.search = params.toString();
        window.history.replaceState({}, document.title, url.toString());
        router.replace('/petshops');
      }
    } catch (e) {
      // ignore
    }
  }, [router]);

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

        <a href={`${apiBase}/auth/external/google`} className="block w-full">
          <Button type="button" variant="secondary" className="w-full justify-center mb-3 flex items-center gap-3">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M17.64 9.2045c0-.638-.0573-1.2518-.1645-1.8409H9v3.486h4.844c-.2093 1.128-0.84 2.0874-1.7965 2.732v2.273h2.904c1.699-1.565 2.6945-3.873 2.6945-6.6501z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.4723-.804 5.9638-2.1791l-2.904-2.273c-.8073.5423-1.84.8653-3.0598.8653-2.3496 0-4.3395-1.587-5.0498-3.723H0.9844v2.3356C2.4773 15.83 5.54 18 9 18z" fill="#34A853"/>
              <path d="M3.9502 10.69A5.398 5.398 0 0 1 3.6 9c0-.626.112-1.23.316-1.79V4.875H0.9844A9.005 9.005 0 0 0 0 9c0 1.456.35 2.832.9844 4.125l2.9658-2.435z" fill="#FBBC05"/>
              <path d="M9 3.579c1.323 0 2.512.455 3.447 1.346l2.583-2.583C13.468.753 11.428 0 9 0 5.54 0 2.4773 2.17 0.9844 4.875l2.9156 2.335C4.661 5.166 6.651 3.579 9 3.579z" fill="#EA4335"/>
            </svg>
            Continuar com Google
          </Button>
        </a>

        <p className="text-sm text-content-secondary">
          Não tem conta? <a href="/register" className="text-content-brand font-medium">Cadastre-se grátis</a>
        </p>
      </div>
    </form>
  );
}
