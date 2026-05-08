import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind class names safely while preserving conditional logic.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Smoothly scroll to an element by id with an offset for the sticky navbar.
 */
export function scrollToSection(id: string, offset = 80) {
  if (typeof window === "undefined") return;
  const target = document.getElementById(id);
  if (!target) return;
  const top = target.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: "smooth" });
}

/**
 * Format an ISO-like date string to "MMM YYYY".
 */
export function formatMonthYear(value?: string | null): string {
  if (!value) return "Present";
  const [yearStr, monthStr] = value.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr ?? 1);
  const date = new Date(year, Math.max(0, month - 1), 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}
