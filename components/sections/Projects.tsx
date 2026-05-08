"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink, Github, Sparkles } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { PROJECTS } from "@/constants/projects";
import {
  fadeInUp,
  staggerContainer,
  viewportConfig,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

export function Projects() {
  return (
    <Section id="projects" className="bg-secondary/30">
      <SectionHeading
        eyebrow="Featured Projects"
        title="Selected work I&apos;m proud of."
        description="A blend of enterprise platforms and product-grade applications I designed and engineered."
      />

      <motion.div
        variants={staggerContainer(0.1)}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        className="grid gap-6 lg:grid-cols-3"
      >
        {PROJECTS.map((project) => (
          <motion.article
            key={project.slug}
            variants={fadeInUp}
            className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border/60 bg-card/60 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-glow"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-90",
                  project.accent,
                )}
                aria-hidden
              />
              <Image
                src={project.image}
                alt={`${project.title} preview`}
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent"
              />
              <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/20 px-3 py-1 text-[11px] font-medium text-white backdrop-blur">
                <Sparkles className="h-3 w-3" />
                {project.tagline}
              </div>
            </div>

            <div className="flex flex-1 flex-col p-6">
              <h3 className="text-xl font-semibold tracking-tight">
                {project.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {project.description}
              </p>

              <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                {project.features.slice(0, 3).map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex flex-wrap gap-1.5">
                {project.stack.slice(0, 6).map((tech) => (
                  <Badge key={tech} variant="outline">
                    {tech}
                  </Badge>
                ))}
                {project.stack.length > 6 && (
                  <Badge variant="soft">+{project.stack.length - 6}</Badge>
                )}
              </div>

              <div className="mt-6 flex items-center gap-2 pt-2">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/btn inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-accent px-4 py-2 text-xs font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Live Demo
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/50 px-4 py-2 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    <Github className="h-3.5 w-3.5" />
                    Code
                  </a>
                )}
              </div>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </Section>
  );
}
