import {
  Component,
  Gauge,
  LayoutDashboard,
  Palette,
  Rocket,
  Sparkles,
} from "lucide-react";
import type { ServiceItem } from "@/types";

export const SERVICES: ServiceItem[] = [
  {
    title: "React Development",
    description:
      "Production-grade React applications with clean architecture, typed contracts and predictable state.",
    icon: Sparkles,
    highlights: ["Hooks & patterns", "Typed components", "Scalable folders"],
  },
  {
    title: "Next.js Applications",
    description:
      "App Router, server components, edge-ready APIs, and SEO-friendly experiences out of the box.",
    icon: Rocket,
    highlights: ["App Router", "SSR / ISR", "Edge runtime"],
  },
  {
    title: "UI/UX Development",
    description:
      "Pixel-perfect interfaces with thoughtful interaction design, accessibility and dark/light theming.",
    icon: Palette,
    highlights: ["Accessibility", "Design tokens", "Motion design"],
  },
  {
    title: "Performance Optimization",
    description:
      "Core Web Vitals, smarter data fetching, code-splitting, and bundle hygiene for fast, snappy apps.",
    icon: Gauge,
    highlights: ["Core Web Vitals", "Lazy loading", "Caching"],
  },
  {
    title: "Component Library Development",
    description:
      "Reusable, themable design systems documented with Storybook for cross-team consistency.",
    icon: Component,
    highlights: ["Design system", "Storybook", "Theming API"],
  },
  {
    title: "Enterprise Dashboard Development",
    description:
      "Data-dense SaaS dashboards with RBAC, charts, and high-throughput tables that stay responsive.",
    icon: LayoutDashboard,
    highlights: ["RBAC", "Data tables", "Charts & analytics"],
  },
];
