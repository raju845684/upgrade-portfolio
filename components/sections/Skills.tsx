"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SKILL_CATEGORIES } from "@/constants/skills";
import { fadeInUp, staggerContainer, viewportConfig } from "@/lib/motion";

export function Skills() {
  return (
    <Section id="skills" className="bg-secondary/30">
      <SectionHeading
        eyebrow="Technical Skills"
        title="A modern toolkit, mastered through real product work."
        description="From product architecture to pixel polish — here is the stack I reach for to ship reliable enterprise software."
      />

      <motion.div
        variants={staggerContainer(0.08)}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {SKILL_CATEGORIES.map((category) => {
          const Icon = category.icon;
          return (
            <motion.article
              key={category.id}
              variants={fadeInUp}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-glow"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
              />
              <div className="mb-5 flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-base font-semibold tracking-tight">
                    {category.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {category.description}
                  </p>
                </div>
              </div>

              <ul className="flex-1 space-y-3.5">
                {category.skills.map((skill) => {
                  const SkillIcon = skill.icon;
                  return (
                    <li key={skill.name} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="inline-flex items-center gap-2 text-foreground/90">
                          {SkillIcon && (
                            <SkillIcon className="h-3.5 w-3.5 opacity-80" />
                          )}
                          {skill.name}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground">
                          {skill.level}%
                        </span>
                      </div>
                      <ProgressBar value={skill.level} />
                    </li>
                  );
                })}
              </ul>
            </motion.article>
          );
        })}
      </motion.div>
    </Section>
  );
}
