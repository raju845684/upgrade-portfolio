"use client";

import { ArrowUpRight } from "lucide-react";
import { NAV_LINKS, SITE, SOCIAL_LINKS } from "@/constants/personal";
import { scrollToSection } from "@/lib/utils";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border/60 bg-background/60 py-14 backdrop-blur-xl">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-px max-w-3xl bg-gradient-to-r from-transparent via-primary/60 to-transparent"
        aria-hidden
      />
      <div className="container grid gap-10 md:grid-cols-3">
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => scrollToSection("home")}
            className="group inline-flex items-center gap-2 text-lg font-semibold tracking-tight"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary/30 bg-gradient-to-br from-primary/20 to-accent/20 text-sm font-bold">
              {SITE.shortName}
            </span>
            <span>
              {SITE.name.split(" ")[0]}
              <span className="text-primary">.</span>
            </span>
          </button>
          <p className="max-w-sm text-sm text-muted-foreground">
            {SITE.tagline}
          </p>
          <p className="text-xs text-muted-foreground/80">
            Based in {SITE.location}.
          </p>
        </div>

        <nav aria-label="Footer" className="md:justify-self-center">
          <h4 className="mb-4 text-sm font-semibold tracking-wide">
            Quick Navigation
          </h4>
          <ul className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <button
                  type="button"
                  onClick={() => scrollToSection(link.href.replace("#", ""))}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:justify-self-end">
          <h4 className="mb-4 text-sm font-semibold tracking-wide">
            Let&apos;s Connect
          </h4>
          <div className="flex flex-wrap gap-2">
            {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="group inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-secondary/40 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
          <a
            href={`mailto:${SITE.email}`}
            className="mt-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            {SITE.email}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      <div className="container mt-12 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
        <p>
          © {year} {SITE.name}. All rights reserved.
        </p>
        <p>
          Designed &amp; built with{" "}
          <span className="text-foreground">Next.js</span>,{" "}
          <span className="text-foreground">Tailwind CSS</span> &amp;{" "}
          <span className="text-foreground">Framer Motion</span>.
        </p>
      </div>
    </footer>
  );
}
