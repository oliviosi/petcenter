import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-stroke-soft bg-surface-card shadow-soft",
        className,
      )}
    >
      {children}
    </div>
  );
}
