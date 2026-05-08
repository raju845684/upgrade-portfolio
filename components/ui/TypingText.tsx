"use client";

import { useTypingEffect } from "@/hooks/useTypingEffect";
import { cn } from "@/lib/utils";

interface TypingTextProps {
  phrases: string[];
  className?: string;
}

export function TypingText({ phrases, className }: TypingTextProps) {
  const text = useTypingEffect({ phrases });

  return (
    <span
      className={cn("inline-flex items-center gap-1 align-baseline", className)}
      aria-live="polite"
    >
      <span>{text || "\u00A0"}</span>
      <span
        aria-hidden
        className="ml-0.5 inline-block h-[0.9em] w-[2px] -translate-y-[2px] rounded-sm bg-current animate-blink"
      />
    </span>
  );
}
