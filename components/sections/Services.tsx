"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SERVICES } from "@/constants/services";
import { fadeInUp, staggerContainer, viewportConfig } from "@/lib/motion";

export function Services() {
  return (
    <Section id="services">
      <SectionHeading
        eyebrow="Services"
        title="What I can help your team build."
        description="From individual feature work to end-to-end frontend leadership across enterprise products."
      />

      <motion.div
        variants={staggerContainer(0.08)}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {SERVICES.map((service) => {
          const Icon = service.icon;
          return (
            <motion.article
              key={service.title}
              variants={fadeInUp}
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-glow"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-12 -right-12 h-40 w-40 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
              />
              <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-xl bg-primary/10 blur-lg transition-opacity duration-500 group-hover:opacity-100"
                />
              </span>
              <h3 className="mt-5 text-lg font-semibold tracking-tight">
                {service.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {service.description}
              </p>

              <ul className="mt-5 space-y-2 text-sm text-foreground/80">
                {service.highlights.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-primary">
                      <Check className="h-3 w-3" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.article>
          );
        })}
      </motion.div>
    </Section>
  );
}
