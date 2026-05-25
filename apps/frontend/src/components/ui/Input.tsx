import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "block w-full rounded-xl border border-stroke-soft bg-surface-card px-4 py-3 text-sm text-content-primary placeholder:text-content-subtle transition focus:border-stroke-brand focus:outline-none focus:ring-2 focus:ring-focus-ring/30 disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-content-muted",
        className,
      )}
      {...props}
    />
  ),
);

Input.displayName = "Input";
