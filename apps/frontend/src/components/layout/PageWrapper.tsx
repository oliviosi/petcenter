import { cn } from "@/lib/utils";

interface PageWrapperProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  centerContent?: boolean;
  className?: string;
}

export function PageWrapper({
  title,
  description,
  actions,
  children,
  centerContent = false,
  className,
}: PageWrapperProps) {
  return (
    <section className={cn("px-6 py-8 sm:py-10", className)}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div
          className={cn(
            "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
            centerContent && "items-center text-center sm:flex-col sm:justify-center",
          )}
        >
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-content-primary">{title}</h1>
            {description ? (
              <p className="max-w-3xl text-sm text-content-secondary">
                {description}
              </p>
            ) : null}
          </div>
          {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
        </div>

        {children}
      </div>
    </section>
  );
}
