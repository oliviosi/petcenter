import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "block min-h-32 w-full rounded-2xl border border-stroke-soft bg-surface-card px-4 py-3.5 text-sm text-content-primary placeholder:text-content-subtle transition duration-200 focus:border-brand-strong focus:outline-none focus:ring-2 focus:ring-focus-ring/30 disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-content-muted",
        className,
      )}
      {...props}
    />
  ),
);

Textarea.displayName = "Textarea";
