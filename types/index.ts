import type { ComponentType, SVGProps } from "react";
import type { IconType } from "react-icons";

export type IconComponent =
  | ComponentType<SVGProps<SVGSVGElement>>
  | IconType;

export interface NavLink {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: IconComponent;
}

export type SkillCategoryId =
  | "frontend"
  | "state"
  | "ui"
  | "backend"
  | "performance"
  | "testing"
  | "devops"
  | "architecture";

export interface Skill {
  name: string;
  level: number;
  icon?: IconComponent;
}

export interface SkillCategory {
  id: SkillCategoryId;
  title: string;
  description: string;
  icon: IconComponent;
  skills: Skill[];
}

export interface ExperienceItem {
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string | null;
  achievements: string[];
  stack: string[];
}

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  features: string[];
  stack: string[];
  image: string;
  liveUrl?: string;
  githubUrl?: string;
  accent: string;
}

export interface ServiceItem {
  title: string;
  description: string;
  icon: IconComponent;
  highlights: string[];
}

export interface StatItem {
  value: number;
  suffix?: string;
  label: string;
  icon: IconComponent;
}
