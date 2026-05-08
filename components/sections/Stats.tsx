"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { STATS } from "@/constants/stats";
import { fadeInUp, staggerContainer, viewportConfig } from "@/lib/motion";

export function Stats() {
  return (
    <Section id="stats" className="py-12 sm:py-16 md:py-20">
      <motion.div
        variants={staggerContainer(0.08)}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/40 p-8 backdrop-blur-xl sm:p-10"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.08] via-transparent to-accent/[0.08]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary/15 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-accent/15 blur-3xl"
        />

        <div className="relative z-[1] grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                variants={fadeInUp}
                className="flex flex-col items-start gap-3"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="text-4xl font-semibold tracking-tight sm:text-5xl">
                  <span className="gradient-text">
                    <AnimatedCounter to={stat.value} suffix={stat.suffix} />
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </Section>
  );
}
