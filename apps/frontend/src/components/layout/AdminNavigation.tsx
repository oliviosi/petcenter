"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarRange, MessageSquare, Scissors, Store, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    href: "/admin/bookings",
    label: "Reservas",
    icon: CalendarRange,
  },
  {
    href: "/admin/feedback",
    label: "Feedback",
    icon: MessageSquare,
  },
  {
    href: "/admin/profile",
    label: "Perfil público",
    icon: Store,
  },
  {
    href: "/admin/professionals",
    label: "Profissionais",
    icon: Users,
  },
  {
    href: "/admin/services",
    label: "Serviços",
    icon: Scissors,
  },
] as const;

interface AdminNavigationProps {
  mobile?: boolean;
}

export function AdminNavigation({ mobile = false }: AdminNavigationProps) {
  const pathname = usePathname();

  return (
    <nav className={cn("space-y-2", mobile && "flex gap-2 overflow-x-auto pb-1")}>
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition duration-200",
              mobile && "min-w-max",
              isActive
                ? "border border-stroke-brand bg-surface-brand-soft text-content-primary shadow-soft"
                : "border border-transparent text-content-secondary hover:bg-surface-muted hover:text-content-primary",
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
