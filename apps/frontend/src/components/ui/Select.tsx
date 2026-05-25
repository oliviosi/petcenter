import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          "block w-full appearance-none rounded-xl border border-stroke-soft bg-surface-card px-4 py-3 pr-10 text-sm text-content-primary transition focus:border-stroke-brand focus:outline-none focus:ring-2 focus:ring-focus-ring/30 disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-content-muted",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-content-subtle" />
    </div>
  ),
);

Select.displayName = "Select";
