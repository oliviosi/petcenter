"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { adminLoginSchema, type AdminLoginValues } from "@/lib/validations/adminLogin";
import type { SubmitAdminLoginAction } from "@/types";

interface AdminLoginFormProps {
  submitAction: SubmitAdminLoginAction;
}

export function AdminLoginForm({ submitAction }: AdminLoginFormProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: AdminLoginValues) {
    setFormError(null);
    const result = await submitAction(values);

    if (!result.success) {
      setFormError(result.message);

      for (const [field, message] of Object.entries(result.fieldErrors ?? {})) {
        if (message) {
          setError(field as keyof AdminLoginValues, { message });
        }
      }

      return;
    }

    router.replace(result.redirectTo);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {formError ? (
        <div className="rounded-2xl border border-content-danger/20 bg-surface-danger-soft px-4 py-3 text-sm text-content-danger">
          {formError}
        </div>
      ) : null}

      <FormField label="E-mail" error={errors.email?.message}>
        <Input
          type="email"
          autoComplete="email"
          placeholder="voce@petshop.com.br"
          {...register("email")}
        />
      </FormField>

      <FormField label="Senha" error={errors.password?.message}>
        <Input
          type="password"
          autoComplete="current-password"
          placeholder="Digite a senha da operação"
          {...register("password")}
        />
      </FormField>

      <Button type="submit" className="w-full justify-center" loading={isSubmitting}>
        Entrar no dashboard
      </Button>
    </form>
  );
}
