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
    <section className={cn("px-6 py-10 sm:py-12", className)}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <div
          className={cn(
            "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
            centerContent && "items-center text-center sm:flex-col sm:justify-center",
          )}
        >
          <div className="space-y-3">
            <h1 className="font-heading text-4xl font-semibold tracking-tight text-content-primary sm:text-5xl">
              {title}
            </h1>
            {description ? (
              <p className="max-w-3xl text-base leading-7 text-content-secondary">
                {description}
              </p>
            ) : null}
          </div>
          {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
        </div>

        {children}
      </div>
    </section>
  );
}
