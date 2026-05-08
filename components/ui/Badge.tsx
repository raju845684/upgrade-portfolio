import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "outline" | "soft" | "gradient";
}

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  const variantClasses = {
    default: "bg-secondary text-secondary-foreground",
    outline: "border border-border bg-transparent text-foreground/80",
    soft: "border border-primary/20 bg-primary/10 text-primary",
    gradient:
      "border border-transparent bg-gradient-to-r from-primary/15 to-accent/15 text-foreground",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium tracking-tight transition-colors",
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
