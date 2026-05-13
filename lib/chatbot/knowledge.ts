import { SITE } from "@/constants/personal";
import { EXPERIENCES } from "@/constants/experience";
import { PROJECTS } from "@/constants/projects";
import { SERVICES } from "@/constants/services";
import { SKILL_CATEGORIES } from "@/constants/skills";
import { STATS } from "@/constants/stats";
import { formatMonthYear } from "@/lib/utils";

/**
 * Years of professional experience, derived from the earliest experience start date.
 */
export function getYearsOfExperience(): number {
  const earliest = [...EXPERIENCES]
    .map((e) => e.startDate)
    .sort()[0];
  if (!earliest) return 8;
  const [yearStr, monthStr] = earliest.split("-");
  const start = new Date(Number(yearStr), Number(monthStr ?? 1) - 1, 1);
  const now = new Date();
  const diffMs = now.getTime() - start.getTime();
  const years = diffMs / (1000 * 60 * 60 * 24 * 365.25);
  return Math.max(1, Math.floor(years));
}

export const CURRENT_ROLE = EXPERIENCES[0];

export function formatExperienceLine(idx: number): string {
  const exp = EXPERIENCES[idx];
  if (!exp) return "";
  const start = formatMonthYear(exp.startDate);
  const end = formatMonthYear(exp.endDate);
  return `${exp.role} @ ${exp.company} · ${start} – ${end}`;
}

export const ALL_SKILL_NAMES = SKILL_CATEGORIES.flatMap((c) =>
  c.skills.map((s) => s.name),
);

/**
 * Knowledge bundle re-exported so the matcher/UI never re-imports constants directly.
 */
export const KB = {
  site: SITE,
  experiences: EXPERIENCES,
  projects: PROJECTS,
  services: SERVICES,
  skillCategories: SKILL_CATEGORIES,
  stats: STATS,
} as const;
