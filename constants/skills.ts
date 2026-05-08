import {
  Boxes,
  Cpu,
  Database,
  GitBranch,
  Layers,
  LayoutGrid,
  Rocket,
  TestTube2,
} from "lucide-react";
import {
  SiAntdesign,
  SiExpress,
  SiGithubactions,
  SiGraphql,
  SiJavascript,
  SiJest,
  SiMui,
  SiNetlify,
  SiNextdotjs,
  SiNodedotjs,
  SiReact,
  SiReactquery,
  SiRedux,
  SiStorybook,
  SiTailwindcss,
  SiTestinglibrary,
  SiTypescript,
  SiVercel,
} from "react-icons/si";
import { TbApi } from "react-icons/tb";
import { FaShieldAlt } from "react-icons/fa";
import type { SkillCategory } from "@/types";

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: "frontend",
    title: "Frontend",
    description: "Modern, accessible UI engineering with React & Next.js.",
    icon: LayoutGrid,
    skills: [
      { name: "React.js", level: 96, icon: SiReact },
      { name: "Next.js", level: 92, icon: SiNextdotjs },
      { name: "TypeScript", level: 90, icon: SiTypescript },
      { name: "JavaScript", level: 95, icon: SiJavascript },
    ],
  },
  {
    id: "state",
    title: "State Management",
    description: "Predictable state with Redux, Zustand & React Query.",
    icon: Boxes,
    skills: [
      { name: "Redux Toolkit", level: 92, icon: SiRedux },
      { name: "Zustand", level: 88, icon: Boxes },
      { name: "React Query", level: 90, icon: SiReactquery },
    ],
  },
  {
    id: "ui",
    title: "UI Libraries",
    description: "Design systems with Tailwind, MUI, AntD & Storybook.",
    icon: Layers,
    skills: [
      { name: "Tailwind CSS", level: 94, icon: SiTailwindcss },
      { name: "Material UI", level: 88, icon: SiMui },
      { name: "Ant Design", level: 84, icon: SiAntdesign },
      { name: "Storybook", level: 86, icon: SiStorybook },
    ],
  },
  {
    id: "backend",
    title: "Backend & APIs",
    description: "Comfortable across Node, Express, REST & GraphQL.",
    icon: Database,
    skills: [
      { name: "Node.js", level: 82, icon: SiNodedotjs },
      { name: "Express.js", level: 80, icon: SiExpress },
      { name: "REST APIs", level: 92, icon: TbApi },
      { name: "GraphQL", level: 80, icon: SiGraphql },
    ],
  },
  {
    id: "performance",
    title: "Performance",
    description: "Core Web Vitals, code-splitting and bundle hygiene.",
    icon: Cpu,
    skills: [
      { name: "Core Web Vitals", level: 90 },
      { name: "Code Splitting", level: 92 },
      { name: "Lazy Loading", level: 90 },
      { name: "Caching Strategies", level: 88 },
    ],
  },
  {
    id: "testing",
    title: "Testing",
    description: "Confidence through unit & integration tests.",
    icon: TestTube2,
    skills: [
      { name: "Jest", level: 88, icon: SiJest },
      { name: "React Testing Library", level: 86, icon: SiTestinglibrary },
    ],
  },
  {
    id: "devops",
    title: "DevOps & CI/CD",
    description: "Automated delivery with GitHub Actions, Vercel & Netlify.",
    icon: GitBranch,
    skills: [
      { name: "GitHub Actions", level: 84, icon: SiGithubactions },
      { name: "Vercel", level: 90, icon: SiVercel },
      { name: "Netlify", level: 84, icon: SiNetlify },
    ],
  },
  {
    id: "architecture",
    title: "Architecture",
    description: "Scalable patterns: Micro Frontends, RBAC & module federation.",
    icon: Rocket,
    skills: [
      { name: "Micro Frontend", level: 90, icon: Boxes },
      { name: "RBAC", level: 92, icon: FaShieldAlt },
      { name: "Module Federation", level: 84 },
      { name: "Design Systems", level: 88 },
    ],
  },
];
