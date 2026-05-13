import {
  ALL_SKILL_NAMES,
  CURRENT_ROLE,
  KB,
  formatExperienceLine,
  getYearsOfExperience,
} from "./knowledge";

export interface BotLink {
  label: string;
  href: string;
  external?: boolean;
}

export type QuickActionIcon =
  | "user"
  | "code"
  | "briefcase"
  | "folder"
  | "rocket"
  | "mail"
  | "file"
  | "sparkles"
  | "calendar"
  | "globe";

export interface BotQuickAction {
  label: string;
  query: string;
  icon: QuickActionIcon;
  accent?: string;
}

export interface BotReply {
  intro?: string;
  bullets?: string[];
  outro?: string;
  links?: BotLink[];
  followups?: string[];
  quickActions?: BotQuickAction[];
}

/* -------------------------------------------------------------------------- */
/* Normalisation + scoring                                                    */
/* -------------------------------------------------------------------------- */

function normalize(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9+#./\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(s: string): string[] {
  return normalize(s)
    .split(/[\s-]+/)
    .filter((t) => t.length > 1);
}

const STOPWORDS = new Set([
  "the","a","an","and","or","of","to","is","it","you","your","my","me","i","do","does","did","can","could","would","should","please","tell","show","give","know","about","with","for","on","in","at","by","from","what","which","who","whom","whose","how","why","when","there","this","that","these","those","be","are","were","was","have","has","had",
]);

function meaningfulTokens(s: string): string[] {
  return tokenize(s).filter((t) => !STOPWORDS.has(t));
}

function score(query: string, keywords: string[]): number {
  const qt = new Set(meaningfulTokens(query));
  if (qt.size === 0) return 0;
  let total = 0;
  for (const kw of keywords) {
    const parts = tokenize(kw);
    const matches = parts.filter((p) => qt.has(p)).length;
    if (matches === parts.length) total += parts.length * 2;
    else if (matches > 0) total += matches;
  }
  return total;
}

/* -------------------------------------------------------------------------- */
/* Reply factories                                                            */
/* -------------------------------------------------------------------------- */

function defaultFollowups(): string[] {
  return [
    "Top skills",
    "Show me your projects",
    "How can I contact you?",
    "Are you available for hire?",
  ];
}

function welcomeReply(): BotReply {
  return {
    intro:
      `Hi! I'm **${KB.site.shortName} Bot** — Rajendra's portfolio assistant. ` +
      `Pick a topic below or just ask me anything.`,
    quickActions: [
      { label: "About me", query: "Tell me about yourself", icon: "user", accent: "from-violet-500 to-fuchsia-500" },
      { label: "Skills", query: "What's your tech stack?", icon: "code", accent: "from-sky-500 to-cyan-400" },
      { label: "Experience", query: "Tell me about your experience", icon: "briefcase", accent: "from-emerald-500 to-teal-400" },
      { label: "Projects", query: "Show me your projects", icon: "folder", accent: "from-amber-500 to-orange-500" },
      { label: "Hire me", query: "Are you available for hire?", icon: "sparkles", accent: "from-pink-500 to-rose-500" },
      { label: "Contact", query: "How can I contact you?", icon: "mail", accent: "from-indigo-500 to-violet-500" },
    ],
    followups: ["Send me your resume", "Where are you based?", "Tell me a fun fact"],
  };
}

function aboutReply(): BotReply {
  const years = getYearsOfExperience();
  return {
    intro: `I'm **${KB.site.name}** — ${KB.site.role}, based in **${KB.site.location}**.`,
    bullets: [
      `${years}+ years in IT, **6+ years specialising in React.js & Next.js**.`,
      `Currently **${CURRENT_ROLE.role}** at **${CURRENT_ROLE.company}**.`,
      "Focus: enterprise SaaS, micro frontends, RBAC, performance & DX.",
    ],
    outro: KB.site.tagline,
    followups: ["Tell me about your experience", "What's your tech stack?", "Show me your projects"],
  };
}

function skillsReply(query: string): BotReply {
  const catMatch = KB.skillCategories.find(
    (c) => query.includes(c.title.toLowerCase()) || query.includes(c.id),
  );
  if (catMatch) {
    return {
      intro: `Here's my **${catMatch.title}** stack — ${catMatch.description}`,
      bullets: catMatch.skills.map((s) => `\`${s.name}\` · ${s.level}%`),
      followups: ["Show me all categories", "What projects use this stack?", "How can I contact you?"],
    };
  }
  return {
    intro: "Here's a snapshot of my skill categories:",
    bullets: KB.skillCategories.map((c) => {
      const top = c.skills.slice(0, 3).map((s) => s.name).join(", ");
      return `**${c.title}** — ${top}${c.skills.length > 3 ? "…" : ""}`;
    }),
    outro: "Ask about any category (e.g. *frontend*, *state*, *performance*) for details.",
    followups: ["Frontend skills", "State management", "Performance", "Architecture"],
  };
}

function experienceReply(): BotReply {
  const years = getYearsOfExperience();
  return {
    intro: `**${years}+ years** across 4 companies. Here's the journey:`,
    bullets: KB.experiences.map((_, i) => formatExperienceLine(i)),
    outro: "Want highlights from a specific role? Just ask by company name.",
    followups: ["Tell me about Knorex", "What's your current role?", "Show me achievements"],
  };
}

function experienceForCompany(query: string): BotReply | null {
  const exp = KB.experiences.find((e) =>
    query.includes(e.company.toLowerCase().split(" ")[0]),
  );
  if (!exp) return null;
  const idx = KB.experiences.indexOf(exp);
  return {
    intro: `**${formatExperienceLine(idx)}**`,
    bullets: exp.achievements,
    outro: `Stack: ${exp.stack.map((s) => `\`${s}\``).join(", ")}.`,
    followups: ["Show all experience", "Show me projects", "How can I contact you?"],
  };
}

function projectsReply(): BotReply {
  return {
    intro: "Here are a few projects I'm proud of:",
    bullets: KB.projects.map((p) => `**${p.title}** — ${p.tagline}`),
    outro: "Ask about any project by name for features, stack and links.",
    links: [{ label: "Open Projects section", href: "#projects" }],
    followups: KB.projects.map((p) => `Tell me about ${p.title}`),
  };
}

function projectByName(query: string): BotReply | null {
  const project = KB.projects.find(
    (p) => query.includes(p.title.toLowerCase()) || query.includes(p.slug),
  );
  if (!project) return null;
  const links: BotLink[] = [];
  if (project.liveUrl) links.push({ label: "Live site", href: project.liveUrl, external: true });
  if (project.githubUrl) links.push({ label: "GitHub", href: project.githubUrl, external: true });
  return {
    intro: `**${project.title}** — ${project.tagline}`,
    bullets: project.features,
    outro: `Stack: ${project.stack.map((s) => `\`${s}\``).join(", ")}.`,
    links,
    followups: ["Show me other projects", "What services do you offer?", "Contact you"],
  };
}

function servicesReply(): BotReply {
  return {
    intro: "Services I offer:",
    bullets: KB.services.map((s) => `**${s.title}** — ${s.description}`),
    links: [{ label: "Open Services section", href: "#services" }],
    followups: ["Are you available for hire?", "Show me your projects", "What's your stack?"],
  };
}

function contactReply(): BotReply {
  return {
    intro: "Let's connect — here's how to reach me:",
    bullets: [
      `Email: \`${KB.site.email}\``,
      `Phone: \`${KB.site.phone}\``,
      `Location: ${KB.site.location}`,
    ],
    links: [
      { label: "Email me", href: `mailto:${KB.site.email}`, external: true },
      { label: "LinkedIn", href: KB.site.linkedinUrl, external: true },
      { label: "GitHub", href: KB.site.githubUrl, external: true },
      { label: "Contact form", href: "#contact" },
    ],
    followups: ["Send me your resume", "Are you available for hire?", "Where are you based?"],
  };
}

function resumeReply(): BotReply {
  return {
    intro: "Here's my latest resume:",
    links: [
      { label: "Open resume", href: KB.site.resumeUrl, external: true },
      { label: "Email me", href: `mailto:${KB.site.email}`, external: true },
    ],
    followups: ["Tell me about your experience", "Show me your projects"],
  };
}

function locationReply(): BotReply {
  return {
    intro: `I'm based in **${KB.site.location}** and open to remote-friendly roles globally.`,
    followups: ["How can I contact you?", "Are you available for hire?"],
  };
}

function remoteReply(): BotReply {
  return {
    intro:
      "I'm **remote-friendly** and happy to work across time zones. I currently work hybrid in Pune and have collaborated with US/EU teams for years.",
    followups: ["What's your timezone?", "Are you available for hire?", "How can I contact you?"],
  };
}

function socialReply(query: string): BotReply {
  const links: BotLink[] = [];
  if (query.includes("github")) links.push({ label: "GitHub", href: KB.site.githubUrl, external: true });
  if (query.includes("linkedin")) links.push({ label: "LinkedIn", href: KB.site.linkedinUrl, external: true });
  if (links.length === 0) {
    links.push(
      { label: "GitHub", href: KB.site.githubUrl, external: true },
      { label: "LinkedIn", href: KB.site.linkedinUrl, external: true },
      { label: "Email", href: `mailto:${KB.site.email}`, external: true },
    );
  }
  return {
    intro: "Find me here:",
    links,
    followups: ["How can I contact you?", "Show me your projects"],
  };
}

function specificSkillReply(query: string): BotReply | null {
  const skillName = ALL_SKILL_NAMES.find((s) => query.includes(s.toLowerCase()));
  if (!skillName) return null;
  const category = KB.skillCategories.find((c) =>
    c.skills.some((s) => s.name === skillName),
  );
  const skill = category?.skills.find((s) => s.name === skillName);
  if (!category || !skill) return null;

  const projectsUsing = KB.projects.filter((p) =>
    p.stack.some((s) => s.toLowerCase() === skillName.toLowerCase()),
  );

  const bullets: string[] = [
    `Proficiency: **${skill.level}%**`,
    `Category: ${category.title}`,
  ];
  if (projectsUsing.length > 0) {
    bullets.push(`Used in: ${projectsUsing.map((p) => `**${p.title}**`).join(", ")}`);
  }

  return {
    intro: `Yes — I work with \`${skill.name}\` regularly.`,
    bullets,
    followups: [
      `Show me ${category.title} skills`,
      "Show me your projects",
      "How can I contact you?",
    ],
  };
}

function statsReply(): BotReply {
  return {
    intro: "A few numbers that summarise my work:",
    bullets: KB.stats.map((s) => `**${s.value}${s.suffix ?? ""}** — ${s.label}`),
    followups: ["Tell me about your experience", "Show me your projects"],
  };
}

function availabilityReply(): BotReply {
  return {
    intro: "**I'm open to new opportunities** — full-time or contract.",
    bullets: [
      "Currently employed; can start after a standard 30–60 day notice.",
      "Preference: senior/lead React or frontend platform roles.",
      "Open to remote, hybrid (Pune) or relocation for the right team.",
    ],
    links: [
      { label: "Email me", href: `mailto:${KB.site.email}`, external: true },
      { label: "LinkedIn", href: KB.site.linkedinUrl, external: true },
    ],
    followups: ["What's your notice period?", "Are you open to remote?", "How can I contact you?"],
  };
}

function hireReply(): BotReply {
  return {
    intro: "Yes — **I'm available for hire**. Quick options:",
    bullets: [
      "**Full-time** — senior / lead React or frontend platform roles.",
      "**Contract / freelance** — short or long engagements, remote-friendly.",
      "**Advisory** — architecture reviews, design-system audits, performance.",
    ],
    links: [
      { label: "Email me", href: `mailto:${KB.site.email}`, external: true },
      { label: "Contact form", href: "#contact" },
      { label: "Resume", href: KB.site.resumeUrl, external: true },
    ],
    followups: ["What's your notice period?", "Are you open to remote?", "Show me your projects"],
  };
}

function salaryReply(): BotReply {
  return {
    intro:
      "Compensation is best discussed once we've aligned on the role and scope.",
    bullets: [
      "Open to competitive packages benchmarked to the local market and seniority.",
      "Flexible across full-time and contract, with rate adjusted accordingly.",
    ],
    outro: "Reach out and we'll talk specifics.",
    links: [
      { label: "Email me", href: `mailto:${KB.site.email}`, external: true },
      { label: "Contact form", href: "#contact" },
    ],
    followups: ["Are you available for hire?", "What's your notice period?"],
  };
}

function timezoneReply(): BotReply {
  return {
    intro: "I'm based in **Pune, India** — **IST (UTC+5:30)**.",
    bullets: [
      "Comfortable overlapping mornings with US ET and full days with EU CET.",
      "Async-friendly: clear written updates, predictable response windows.",
    ],
    followups: ["Are you open to remote?", "Are you available for hire?"],
  };
}

function educationReply(): BotReply {
  return {
    intro: "I'm a self-driven engineer with formal training in computer science and 8+ years of professional practice.",
    outro: "If you'd like specifics, my resume has the full picture.",
    links: [{ label: "Open resume", href: KB.site.resumeUrl, external: true }],
    followups: ["Tell me about your experience", "What's your tech stack?"],
  };
}

function languagesReply(): BotReply {
  return {
    intro: "Languages I speak:",
    bullets: [
      "**English** — professional working proficiency.",
      "**Hindi** — fluent.",
      "**Odia** — native.",
    ],
    followups: ["Where are you based?", "Are you open to remote?"],
  };
}

function hobbiesReply(): BotReply {
  return {
    intro: "When I'm not shipping code:",
    bullets: [
      "Reading about distributed systems, design systems and dev productivity.",
      "Tinkering with side projects and exploring new React patterns.",
      "Mentoring engineers and writing the occasional technical note.",
    ],
    followups: ["Tell me about your experience", "Show me your projects"],
  };
}

function jokeReply(): BotReply {
  const jokes = [
    "Why do React devs love nature? Because of all the *components*.",
    "I told a CSS joke once. Nobody got it — they were all out of *scope*.",
    "Why did the JavaScript developer leave? Because they didn't `null` what they were doing.",
    "TypeScript walks into a bar — the bar accepts it `as any`.",
    "There are 10 kinds of devs: those who understand binary and those who `parseInt` everything.",
  ];
  const pick = jokes[Math.floor(Math.random() * jokes.length)];
  return {
    intro: pick,
    followups: ["Tell me a fun fact", "Show me your projects", "How can I contact you?"],
  };
}

function funFactReply(): BotReply {
  const facts = [
    "I once shaved **60% off API overhead** with server-side search + hybrid pagination.",
    "I architected a micro frontend system that cut cross-team **code duplication by 50%**.",
    "I've scaled a **Zustand** store to power **1,000+ concurrent enterprise sessions**.",
    "I've built an ad integration spanning **Google, Meta, LinkedIn and TikTok** APIs.",
  ];
  const pick = facts[Math.floor(Math.random() * facts.length)];
  return {
    intro: pick,
    followups: ["Tell me about Knorex", "Show me your projects", "What's your tech stack?"],
  };
}

function helpReply(): BotReply {
  return {
    intro:
      "I can answer questions about Rajendra's portfolio. Try a topic below or type a question:",
    quickActions: welcomeReply().quickActions,
    bullets: [
      "Slash commands: `/skills`, `/projects`, `/experience`, `/contact`, `/resume`, `/clear`",
    ],
    followups: defaultFollowups(),
  };
}

function helloReply(): BotReply {
  return welcomeReply();
}

function thanksReply(): BotReply {
  return {
    intro: "You're welcome! Anything else you'd like to know?",
    followups: defaultFollowups(),
  };
}

function byeReply(): BotReply {
  return {
    intro: "Thanks for stopping by! Feel free to reach out anytime.",
    links: [
      { label: "Email Rajendra", href: `mailto:${KB.site.email}`, external: true },
      { label: "LinkedIn", href: KB.site.linkedinUrl, external: true },
    ],
  };
}

function fallbackReply(query: string): BotReply {
  // Try to recover by surfacing the closest topic by score.
  const tries: Array<{ name: string; reply: () => BotReply; keywords: string[] }> = [
    { name: "about", reply: aboutReply, keywords: ["about","yourself","bio","who","rajendra","introduce","you"] },
    { name: "skills", reply: () => skillsReply(query), keywords: ["skill","stack","tech","technology","tools","framework","expertise","languages","programming"] },
    { name: "experience", reply: experienceReply, keywords: ["experience","work","history","career","years","background"] },
    { name: "projects", reply: projectsReply, keywords: ["project","portfolio","showcase","case study","built","work"] },
    { name: "services", reply: servicesReply, keywords: ["service","offer","help"] },
    { name: "contact", reply: contactReply, keywords: ["contact","email","reach","talk","phone"] },
    { name: "hire", reply: hireReply, keywords: ["hire","hiring","opportunity","role","job","freelance","contract"] },
    { name: "availability", reply: availabilityReply, keywords: ["available","availability","notice","start","join"] },
  ];
  const ranked = tries
    .map((t) => ({ ...t, s: score(query, t.keywords) }))
    .sort((a, b) => b.s - a.s);
  if (ranked[0] && ranked[0].s >= 2) return ranked[0].reply();
  return {
    intro:
      "I'm not sure I caught that — but I know a lot about Rajendra's portfolio. Try one of these:",
    quickActions: welcomeReply().quickActions,
    followups: defaultFollowups(),
  };
}

/* -------------------------------------------------------------------------- */
/* Slash commands                                                             */
/* -------------------------------------------------------------------------- */

const SLASH_COMMANDS: Record<string, () => BotReply> = {
  "/help": helpReply,
  "/about": aboutReply,
  "/skills": () => skillsReply(""),
  "/experience": experienceReply,
  "/projects": projectsReply,
  "/services": servicesReply,
  "/contact": contactReply,
  "/resume": resumeReply,
  "/cv": resumeReply,
  "/hire": hireReply,
  "/stats": statsReply,
  "/joke": jokeReply,
  "/fun": funFactReply,
};

/**
 * Returns true if the input is a recognised slash command.
 */
export function isSlashCommand(input: string): boolean {
  const cmd = input.trim().toLowerCase().split(/\s+/)[0];
  return cmd === "/clear" || cmd in SLASH_COMMANDS;
}

/**
 * Returns true if this command should clear the conversation client-side.
 */
export function isClearCommand(input: string): boolean {
  return input.trim().toLowerCase() === "/clear";
}

/* -------------------------------------------------------------------------- */
/* Intent table                                                               */
/* -------------------------------------------------------------------------- */

interface IntentRule {
  name: string;
  keywords: string[];
  /** Higher = more specific. Ties broken by score then table order. */
  weight?: number;
  reply: (q: string) => BotReply;
}

const INTENTS: IntentRule[] = [
  { name: "resume", keywords: ["resume","cv","curriculum","vitae","download"], reply: () => resumeReply() },
  { name: "availability", keywords: ["available","availability","notice","period","start","join","when"], reply: () => availabilityReply() },
  { name: "hire", keywords: ["hire","hiring","opportunity","opportunities","role","job","jobs","freelance","contract","consult","consulting","consultant","fulltime","full time","parttime","part time","gig","contractor"], reply: () => hireReply() },
  { name: "salary", keywords: ["salary","compensation","rate","rates","cost","pricing","package","ctc","price"], reply: () => salaryReply() },
  { name: "timezone", keywords: ["timezone","time","zone","ist","utc","clock"], reply: () => timezoneReply() },
  { name: "remote", keywords: ["remote","onsite","hybrid","relocate","relocation","wfh"], reply: () => remoteReply() },
  { name: "location", keywords: ["where","location","based","city","country","live","from"], reply: () => locationReply() },
  { name: "contact", keywords: ["contact","reach","email","phone","talk","get in touch"], reply: () => contactReply() },
  { name: "services", keywords: ["service","services","offer","offering","offerings"], reply: () => servicesReply() },
  { name: "projects", keywords: ["project","projects","portfolio","case","study","showcase","demo","demos","samples"], reply: () => projectsReply() },
  { name: "experience", keywords: ["experience","work history","career","background","years","companies","worked"], reply: () => experienceReply() },
  { name: "social", keywords: ["github","linkedin","social","twitter","x.com"], reply: (q) => socialReply(q) },
  { name: "stats", keywords: ["stats","numbers","metrics","impact","achievements"], reply: () => statsReply() },
  { name: "education", keywords: ["education","degree","college","university","qualification","graduated","study","studied","school"], reply: () => educationReply() },
  { name: "languages", keywords: ["speak","spoken","hindi","english","odia","native","fluent"], reply: () => languagesReply() },
  { name: "hobbies", keywords: ["hobby","hobbies","interest","interests","free time","spare time","outside work"], reply: () => hobbiesReply() },
  { name: "joke", keywords: ["joke","funny","laugh","humour","humor"], reply: () => jokeReply() },
  { name: "funFact", keywords: ["fun fact","fact","trivia","interesting","surprise"], reply: () => funFactReply() },
  { name: "skills", keywords: ["skill","skills","stack","tech","technology","technologies","tools","framework","frameworks","expertise","capabilities","libraries"], reply: (q) => skillsReply(q) },
  { name: "about", keywords: ["about","yourself","introduce","bio","who","rajendra","you"], reply: () => aboutReply() },
];

/* -------------------------------------------------------------------------- */
/* Entry point                                                                */
/* -------------------------------------------------------------------------- */

const HELLO_RE = /^\s*(hi|hello|hey|yo|hola|namaste|howdy|greetings|sup)\b/i;
const THANKS_RE = /\b(thanks|thank you|thx|ty|cheers|appreciate)\b/i;
const BYE_RE = /^\s*(bye|goodbye|see ya|farewell|later)\b/i;

export function getReply(rawInput: string): BotReply {
  const input = rawInput.trim();
  if (!input) return helpReply();

  // 1. Slash commands win.
  const cmdKey = input.toLowerCase().split(/\s+/)[0];
  if (cmdKey in SLASH_COMMANDS) {
    return SLASH_COMMANDS[cmdKey]();
  }

  // 2. Greetings / thanks / farewells are short and unambiguous.
  if (HELLO_RE.test(input) && input.split(/\s+/).length <= 3) return helloReply();
  if (BYE_RE.test(input) && input.split(/\s+/).length <= 3) return byeReply();
  if (THANKS_RE.test(input) && input.length < 40) return thanksReply();

  const q = normalize(input);

  // 3. Specific company / project lookups beat generic intents.
  if (/\b(knorex|v2stech|spryox|kush)\b/.test(q)) {
    const r = experienceForCompany(q);
    if (r) return r;
  }
  const projectHit = projectByName(q);
  if (projectHit) return projectHit;

  // 4. Specific skill lookup (e.g. "do you know Next.js?").
  const skillHit = specificSkillReply(q);
  if (skillHit) return skillHit;

  // 5. Score-based intent matching.
  const scored = INTENTS.map((intent) => ({
    intent,
    s: score(q, intent.keywords),
  })).sort((a, b) => b.s - a.s);

  if (scored[0] && scored[0].s >= 2) {
    return scored[0].intent.reply(q);
  }

  // 6. Last resort: nearest-topic fallback with quick actions.
  return fallbackReply(q);
}
