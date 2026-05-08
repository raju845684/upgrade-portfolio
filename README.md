# Rajendra Kumar Mohanty — Portfolio

A modern, premium and fully responsive personal portfolio for **Rajendra Kumar Mohanty**, Senior React.js Frontend Engineer (8+ years total IT, 6+ years React.js, based in Pune, India).

Built with a focus on clean architecture, motion design, accessibility and Core Web Vitals.

## Tech stack

- **Framework**: [Next.js 15](https://nextjs.org) (App Router) + React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS + custom design tokens (HSL CSS variables)
- **Animations**: Framer Motion
- **Icons**: Lucide React + React Icons
- **Forms**: React Hook Form + Zod validation
- **Toasts**: Sonner
- **Themes**: next-themes (dark / light / system)

## Features

- Modern dark/light theme with CSS variables (light mode included)
- Glassmorphism + gradient effects, ambient grid + glow background
- Smooth Framer Motion animations on every section
- Hero section with animated typing effect, CTAs and social links
- About, Skills (8 categories with progress bars), Experience timeline, Projects, Services, Stats, Contact
- Animated counters, scroll progress bar, scroll spy & smooth scrolling
- Mobile-first responsive design with accessible mobile nav
- Reusable UI primitives (`Button`, `Card`, `Badge`, `Section`, `SectionHeading`, `ProgressBar`, `Skeleton`, `ThemeToggle`, `TypingText`, `AnimatedCounter`)
- SEO metadata, OpenGraph + Twitter cards, sitemap, robots.txt
- Page transitions, loading state and 404 page
- Accessibility: skip link, focus rings, semantic HTML, ARIA roles, reduced layout shift

## Folder structure

```
.
├── app/                      # Next.js App Router
│   ├── globals.css           # Tailwind base + design tokens
│   ├── layout.tsx            # Root layout, providers, navbar/footer
│   ├── page.tsx              # Home page (assembles all sections)
│   ├── loading.tsx           # Suspense / loading state
│   ├── not-found.tsx         # 404 page
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── layout/               # Navbar, Footer, BackToTop, ScrollProgress, etc.
│   ├── providers/            # ThemeProvider
│   ├── sections/             # Hero, About, Skills, Experience, Projects, Services, Stats, Contact
│   └── ui/                   # Reusable primitives
├── constants/                # Personal info, skills, experience, projects, services, stats
├── hooks/                    # useTypingEffect, useScrollSpy, useScrollPosition, useMediaQuery
├── lib/                      # utils, motion variants
├── public/                   # Static assets, project banners, favicon, og image
├── types/                    # Shared TypeScript types
├── tailwind.config.ts
├── postcss.config.mjs
├── next.config.ts
└── tsconfig.json
```

## Getting started

```bash
# install deps
npm install

# run dev server (http://localhost:3000)
npm run dev

# type check
npm run type-check

# lint
npm run lint

# production build
npm run build
npm start
```

> **Note on React 19**: This project pins `react@19` and `react-dom@19` to match Next.js 15. If your environment requires a stable `react@18`, downgrade both packages and rerun `npm install`.

## Customization

All personal data lives in [`constants/`](./constants):

- `personal.ts` — name, role, tagline, location, email, social URLs, navigation, typing phrases, contact details
- `skills.ts` — 8 skill categories with progress levels and per-skill icons
- `experience.ts` — Knorex, V2STech, SpryOX, Kush Infosystems with achievements
- `projects.ts` — Pathlock, CantabNYC, Task Manager (replace banners in `public/projects/`)
- `services.ts` — six frontend services
- `stats.ts` — animated counters

Theme tokens (light + dark) live in [`app/globals.css`](./app/globals.css) and can be tuned via the HSL variables under `:root` and `.dark`.

To swap the resume, drop your `resume.pdf` inside `public/`. The Hero CTA links to `/resume.pdf`.

To swap the OpenGraph image, replace `public/og.svg` (or update `SITE.ogImage` in `constants/personal.ts`).

## Deployment

The project is ready for [Vercel](https://vercel.com):

```bash
npx vercel
# or push to GitHub and import the repo on Vercel
```

It also deploys cleanly to Netlify, Cloudflare Pages, or any Node-compatible host. Set `SITE.url` in `constants/personal.ts` to your production URL so SEO metadata, sitemap and `robots.txt` resolve correctly.

## Accessibility & Performance

- Semantic HTML, landmark roles and ARIA labels
- Skip-to-content link, visible focus states
- Reduced motion respected for non-essential animations (Framer Motion `useReducedMotion` ready)
- `next/image` for optimized banners with explicit aspect ratios (no CLS)
- `next/font` self-hosting for Inter + JetBrains Mono
- Optimized package imports configured in `next.config.ts`

## License

Personal portfolio © Rajendra Kumar Mohanty. Use as inspiration; please remove personal data before redeploying as your own.
# upgrade-portfolio
