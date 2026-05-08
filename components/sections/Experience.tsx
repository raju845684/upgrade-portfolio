"use client";

import { motion } from "framer-motion";
import { Briefcase, MapPin, Sparkles } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { EXPERIENCES } from "@/constants/experience";
import { fadeInUp, staggerContainer, viewportConfig } from "@/lib/motion";
import { formatMonthYear } from "@/lib/utils";

export function Experience() {
  return (
    <Section id="experience">
      <SectionHeading
        eyebrow="Experience"
        title="A timeline of building & scaling products."
        description="Roles, achievements and the stack I shipped with at each stage of my career."
      />

      <motion.ol
        variants={staggerContainer(0.12)}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        className="relative mx-auto max-w-4xl"
      >
        <div
          aria-hidden
          className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-primary/30 via-border to-transparent md:left-1/2 md:-translate-x-1/2"
        />

        {EXPERIENCES.map((exp, index) => {
          const isLeft = index % 2 === 0;
          return (
            <motion.li
              key={`${exp.company}-${exp.role}`}
              variants={fadeInUp}
              className="relative mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-12"
            >
              <span
                aria-hidden
                className="absolute left-4 top-5 z-10 -translate-x-1/2 md:left-1/2"
              >
                <span className="relative flex h-3.5 w-3.5 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/40" />
                  <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-background bg-gradient-to-br from-primary to-accent shadow-[0_0_12px_hsl(var(--primary)/0.7)]" />
                </span>
              </span>

              <div
                className={`pl-12 md:pl-0 ${isLeft ? "md:pr-12 md:text-right" : "md:order-2 md:pl-12"}`}
              >
                <ExperienceCard exp={exp} alignRight={isLeft} />
              </div>
              <div className={isLeft ? "hidden md:block" : "hidden md:block md:order-1"} />
            </motion.li>
          );
        })}
      </motion.ol>
    </Section>
  );
}

function ExperienceCard({
  exp,
  alignRight,
}: {
  exp: (typeof EXPERIENCES)[number];
  alignRight: boolean;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-glow ${
        alignRight ? "md:text-right" : ""
      }`}
    >
      <div
        className={`flex flex-wrap items-center gap-2 text-xs text-muted-foreground ${
          alignRight ? "md:justify-end" : ""
        }`}
      >
        <span className="inline-flex items-center gap-1.5 font-mono">
          <Briefcase className="h-3.5 w-3.5" />
          {formatMonthYear(exp.startDate)} —{" "}
          {exp.endDate ? formatMonthYear(exp.endDate) : "Present"}
        </span>
        <span className="text-border">•</span>
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5" />
          {exp.location}
        </span>
      </div>
      <h3 className="mt-3 text-lg font-semibold tracking-tight">{exp.role}</h3>
      <p className="text-sm text-primary">{exp.company}</p>

      <ul
        className={`mt-4 space-y-2 text-sm text-muted-foreground ${
          alignRight ? "md:text-right" : ""
        }`}
      >
        {exp.achievements.map((item) => (
          <li
            key={item}
            className={`flex items-start gap-2 ${
              alignRight ? "md:flex-row-reverse md:text-right" : ""
            }`}
          >
            <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <div
        className={`mt-5 flex flex-wrap gap-1.5 ${alignRight ? "md:justify-end" : ""}`}
      >
        {exp.stack.map((tech) => (
          <Badge key={tech} variant="outline">
            {tech}
          </Badge>
        ))}
      </div>
    </div>
  );
}
