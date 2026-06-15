"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function ClientRedirect() {
  const router = useRouter();

  useEffect(() => {
    try {
      const token = localStorage.getItem("client_token");
      if (token) {
        // Redirect to catalog / petshops; if more context is available later
        // we can redirect to a specific petshop booking page
        router.replace("/petshops");
      }
    } catch (e) {
      // ignore (e.g., SSR or blocked storage)
    }
  }, [router]);

  return null;
}
