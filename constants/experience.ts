import type { ExperienceItem } from "@/types";

export const EXPERIENCES: ExperienceItem[] = [
  {
    company: "Knorex India Pvt Ltd",
    role: "Senior React.js Frontend Engineer",
    location: "Pune, India",
    startDate: "2022-04",
    endDate: null,
    achievements: [
      "Architected and shipped enterprise SaaS modules used by 1,000+ marketing accounts.",
      "Built a Micro Frontend foundation that reduced cross-team release contention.",
      "Introduced React Query data layer that reduced API overhead by ~60%.",
      "Designed RBAC primitives and policy hooks reused across 6+ product surfaces.",
      "Mentored frontend engineers on React, TypeScript and performance hygiene.",
    ],
    stack: [
      "React",
      "Next.js",
      "TypeScript",
      "React Query",
      "Redux Toolkit",
      "Tailwind CSS",
      "Storybook",
    ],
  },
  {
    company: "V2STech Solutions Pvt Ltd",
    role: "React.js Frontend Engineer",
    location: "Pune, India",
    startDate: "2020-08",
    endDate: "2022-03",
    achievements: [
      "Led the rebuild of a flagship dashboard, cutting code duplication by 50%.",
      "Owned the design-system migration to a typed component library (40+ primitives).",
      "Implemented role-based access controls for multi-tenant enterprise users.",
      "Drove Lighthouse performance from 62 → 96 on critical revenue pages.",
    ],
    stack: ["React", "TypeScript", "Redux Toolkit", "Material UI", "Jest"],
  },
  {
    company: "SpryOX Pvt Ltd",
    role: "Frontend Engineer",
    location: "Mumbai, India",
    startDate: "2018-10",
    endDate: "2020-07",
    achievements: [
      "Delivered customer-facing React features across e-commerce and fintech clients.",
      "Built reusable component patterns adopted by 4 product squads.",
      "Improved CI/CD with GitHub Actions, cutting deploy times by ~35%.",
    ],
    stack: ["React", "JavaScript", "Redux", "Ant Design", "Node.js"],
  },
  {
    company: "Kush Infosystems Pvt Ltd",
    role: "Software Engineer (Frontend)",
    location: "Bhubaneswar, India",
    startDate: "2017-06",
    endDate: "2018-09",
    achievements: [
      "Started my React.js journey building admin tools and CRM modules.",
      "Owned UI development for client portals using HTML, CSS and React.",
      "Collaborated with backend team to consume REST APIs and design schemas.",
    ],
    stack: ["React", "JavaScript", "REST APIs", "HTML", "CSS"],
  },
];
