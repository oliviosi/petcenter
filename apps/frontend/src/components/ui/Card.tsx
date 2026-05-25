import { cn } from "@/lib/utils";

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      {...props}
      className={cn(
        "rounded-2xl border border-stroke-soft bg-surface-card shadow-soft",
        className,
      )}
    >
      {children}
    </div>
  );
}
