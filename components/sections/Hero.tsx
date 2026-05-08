"use client";

import { motion } from "framer-motion";
import { ArrowRight, Download, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TypingText } from "@/components/ui/TypingText";
import { SITE, SOCIAL_LINKS, TYPING_PHRASES } from "@/constants/personal";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { scrollToSection } from "@/lib/utils";

export function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-28 sm:pt-32"
    >
      <div className="container relative z-10">
        <motion.div
          variants={staggerContainer(0.12, 0.1)}
          initial="hidden"
          animate="visible"
          className="mx-auto flex max-w-4xl flex-col items-center text-center"
        >
          <motion.span
            variants={fadeInUp}
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium tracking-tight text-primary"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Available for new opportunities
          </motion.span>

          <motion.h1
            variants={fadeInUp}
            className="mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-6xl md:text-7xl"
          >
            Hi, I&apos;m{" "}
            <span className="gradient-text">{SITE.name.split(" ")[0]}</span>.
            <br className="hidden sm:block" /> I build{" "}
            <span className="gradient-text">premium</span> SaaS interfaces.
          </motion.h1>

          <motion.div
            variants={fadeInUp}
            className="mt-6 flex h-7 items-center justify-center text-base text-muted-foreground sm:text-lg"
          >
            <span className="font-mono text-primary">{">"}</span>
            <span className="ml-2 font-mono text-foreground">
              <TypingText phrases={TYPING_PHRASES} />
            </span>
          </motion.div>

          <motion.p
            variants={fadeInUp}
            className="mt-6 max-w-2xl text-balance text-base text-muted-foreground sm:text-lg"
          >
            8+ years of IT experience and 6+ years of crafting fast, scalable
            React applications. Currently shipping enterprise SaaS modules at{" "}
            <span className="text-foreground">Knorex</span>, based in{" "}
            <span className="text-foreground">{SITE.location}</span>.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:gap-3"
          >
            <Button
              size="lg"
              onClick={() => scrollToSection("contact")}
              className="group"
            >
              Contact Me
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
            <a
              href={SITE.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open resume in new tab"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-border bg-secondary/60 px-7 text-sm font-medium backdrop-blur transition-all hover:border-primary/40 hover:bg-secondary"
            >
              <Download className="h-4 w-4" />
              Download Resume
            </a>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="mt-10 flex items-center gap-3"
          >
            {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="group inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/60 bg-secondary/40 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-secondary hover:text-primary"
              >
                <Icon className="h-[18px] w-[18px] transition-transform group-hover:scale-110" />
              </a>
            ))}
          </motion.div>
        </motion.div>

        <HeroOrbit />
      </div>
    </section>
  );
}

function HeroOrbit() {
  const dots = [
    { className: "left-[8%] top-[20%] h-2 w-2 bg-primary", delay: 0 },
    { className: "right-[10%] top-[30%] h-1.5 w-1.5 bg-accent", delay: 0.4 },
    { className: "left-[16%] bottom-[18%] h-1.5 w-1.5 bg-fuchsia-500", delay: 0.8 },
    { className: "right-[18%] bottom-[24%] h-2 w-2 bg-sky-400", delay: 1.2 },
  ];

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {dots.map((dot, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: dot.delay,
          }}
          className={`absolute rounded-full shadow-[0_0_20px_currentColor] ${dot.className}`}
        />
      ))}
    </div>
  );
}
