import { type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  id: string;
  children: ReactNode;
  containerClassName?: string;
}

export function Section({
  id,
  children,
  className,
  containerClassName,
  ...props
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative scroll-mt-24 py-20 sm:py-24 md:py-28",
        className,
      )}
      {...props}
    >
      <div className={cn("container relative z-[1]", containerClassName)}>
        {children}
      </div>
    </section>
  );
}
