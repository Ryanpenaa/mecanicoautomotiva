import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Section({
  id,
  children,
  className,
  eyebrow,
  title,
  subtitle,
}: {
  id?: string;
  children?: ReactNode;
  className?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
}) {
  return (
    <section id={id} className={cn("px-4 py-8 sm:py-12", className)}>
      <div className="mx-auto w-full max-w-6xl">
        {(eyebrow || title || subtitle) && (
          <header className="mx-auto mb-6 max-w-3xl text-center sm:mb-8">
            {eyebrow && (
              <span className="inline-block rounded-full border border-border bg-surface-2 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
                {eyebrow}
              </span>
            )}
            {title && (
              <h2 className="mt-4 text-3xl font-bold text-balance uppercase sm:text-4xl">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-3 text-base text-muted-foreground">{subtitle}</p>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}

export function CtaButton({
  href,
  children,
  variant = "primary",
  className,
  onClick,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "accent" | "outline";
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={cn(
        "inline-flex w-full items-center justify-center rounded-xl px-6 py-4 text-center text-base font-bold tracking-wide uppercase transition-transform duration-200 active:scale-[0.98] sm:w-auto sm:text-lg",
        variant === "primary" &&
          "gradient-primary glow-primary text-primary-foreground hover:brightness-110",
        variant === "accent" &&
          "gradient-accent text-accent-foreground hover:brightness-105",
        variant === "outline" &&
          "border border-border bg-surface-2 text-foreground hover:bg-secondary",
        className,
      )}
    >
      {children}
    </a>
  );
}
