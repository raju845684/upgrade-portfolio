import { Briefcase, Building2, Gauge, Layers } from "lucide-react";
import type { StatItem } from "@/types";

export const STATS: StatItem[] = [
  {
    value: 8,
    suffix: "+",
    label: "Years Experience",
    icon: Briefcase,
  },
  {
    value: 1000,
    suffix: "+",
    label: "Enterprise Accounts",
    icon: Building2,
  },
  {
    value: 60,
    suffix: "%",
    label: "API Optimization",
    icon: Gauge,
  },
  {
    value: 50,
    suffix: "%",
    label: "Less Code Duplication",
    icon: Layers,
  },
];
