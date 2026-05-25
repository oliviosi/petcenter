import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "petcenter",
    template: "%s | petcenter",
  },
  description: "Fluxo público de descoberta e reserva para petshops.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={inter.className}>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
