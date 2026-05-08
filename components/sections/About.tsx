"use client";

import { motion } from "framer-motion";
import { Code2, Layers, Rocket, Sparkles } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { ABOUT_HIGHLIGHTS, SITE } from "@/constants/personal";
import {
  fadeInUp,
  slideInLeft,
  slideInRight,
  staggerContainer,
  viewportConfig,
} from "@/lib/motion";

const PILLARS = [
  {
    icon: Code2,
    title: "Frontend Craft",
    description:
      "React, Next.js and TypeScript with a deep focus on architecture and developer experience.",
  },
  {
    icon: Layers,
    title: "Scalable Systems",
    description:
      "Micro Frontends, design systems and RBAC patterns built for enterprise teams.",
  },
  {
    icon: Rocket,
    title: "Performance First",
    description:
      "Core Web Vitals, smarter data layers and bundle hygiene for fast, snappy products.",
  },
  {
    icon: Sparkles,
    title: "Polished UX",
    description:
      "Accessible, motion-rich interfaces with thoughtful interaction design.",
  },
];

export function About() {
  return (
    <Section id="about">
      <SectionHeading
        eyebrow="About Me"
        title="Senior frontend engineer building enterprise SaaS at scale."
        description="I help product teams turn complex requirements into fast, accessible and beautifully crafted React experiences."
      />

      <div className="grid items-start gap-10 lg:grid-cols-12">
        <motion.div
          variants={slideInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="space-y-5 text-base leading-relaxed text-muted-foreground lg:col-span-7"
        >
          <p>
            I&apos;m{" "}
            <span className="text-foreground">{SITE.name}</span>, a Senior
            React.js Frontend Engineer based in{" "}
            <span className="text-foreground">{SITE.location}</span> with{" "}
            <span className="text-foreground">8+ years</span> of total IT
            experience and{" "}
            <span className="text-foreground">6+ years</span> specialized in
            React.js and the modern frontend ecosystem.
          </p>
          <p>
            At{" "}
            <span className="text-foreground">Knorex</span>, I architect
            enterprise SaaS modules used by{" "}
            <span className="text-foreground">1000+ accounts</span> — building
            Micro Frontend boundaries, granular RBAC primitives and a design
            system that keeps cross-team velocity high. I focus on performance,
            DX and predictable state, recently reducing API overhead by{" "}
            <span className="text-foreground">~60%</span> and cutting code
            duplication by <span className="text-foreground">~50%</span>.
          </p>
          <p>
            Outside of shipping product, I enjoy mentoring engineers, refining
            component APIs, and exploring the boundary between motion design
            and interaction patterns — the small details that turn a good
            product into a great one.
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {ABOUT_HIGHLIGHTS.map((label) => (
              <Badge key={label} variant="soft">
                {label}
              </Badge>
            ))}
          </div>
        </motion.div>

        <motion.ul
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="grid gap-4 sm:grid-cols-2 lg:col-span-5"
        >
          {PILLARS.map(({ icon: Icon, title, description }) => (
            <motion.li
              key={title}
              variants={fadeInUp}
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-glow"
            >
              <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="text-base font-semibold tracking-tight">
                {title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {description}
              </p>
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
              />
            </motion.li>
          ))}
        </motion.ul>

        <motion.div
          variants={slideInRight}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="hidden"
        />
      </div>
    </Section>
  );
}
