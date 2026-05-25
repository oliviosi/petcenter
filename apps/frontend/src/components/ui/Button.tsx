import Link from "next/link";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface BaseButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  className?: string;
  children: React.ReactNode;
  href?: string;
}

type ButtonProps = BaseButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-solid text-content-inverse hover:bg-brand-strong focus-visible:ring-focus-ring",
  secondary:
    "border border-stroke-soft bg-surface-card text-content-secondary hover:border-stroke-strong hover:text-content-primary focus-visible:ring-focus-ring",
  ghost:
    "bg-transparent text-content-secondary hover:bg-surface-muted hover:text-content-primary focus-visible:ring-focus-ring",
  danger:
    "bg-content-danger text-content-inverse hover:opacity-90 focus-visible:ring-focus-ring",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-page disabled:cursor-not-allowed disabled:opacity-60";

export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    loading = false,
    className,
    children,
  } = props;

  const classes = cn(baseClasses, variantClasses[variant], sizeClasses[size], className);

  if (props.href) {
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  const {
    disabled,
    href: _href,
    variant: _variant,
    size: _size,
    loading: _loading,
    className: _className,
    children: _children,
    ...buttonProps
  } = props;

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...buttonProps}
    >
      {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
      {children}
    </button>
  );
}
