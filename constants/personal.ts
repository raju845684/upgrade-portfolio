import { Github, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import type { NavLink, SocialLink } from "@/types";

export const SITE = {
  name: "Rajendra Kumar Mohanty",
  shortName: "RKM",
  role: "Senior React.js Frontend Engineer",
  tagline: "Building enterprise-grade SaaS experiences with React and Next.js.",
  location: "Pune, India",
  email: "rajendrakumohanty96@gmail.com",
  phone: "+91-8114714428",
  resumeUrl:
    "https://docs.google.com/document/d/1ncemAPQrHkXovAOEjHxkHzJLPw-XiXyy/edit?usp=sharing&ouid=107532390210623324668&rtpof=true&sd=true",
  githubUrl: "https://github.com/raju845684",
  linkedinUrl: "https://www.linkedin.com/in/raju845684",
  url: "https://rajendra-mohanty.dev",
  description:
    "Personal portfolio of Rajendra Kumar Mohanty — Senior React.js Frontend Engineer with 8+ years of IT experience and 6+ years specializing in React.js, Next.js, and enterprise SaaS applications.",
  ogImage: "/og.svg",
} as const;

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: "GitHub",
    href: SITE.githubUrl,
    icon: Github,
  },
  {
    label: "LinkedIn",
    href: SITE.linkedinUrl,
    icon: Linkedin,
  },
  {
    label: "Email",
    href: `mailto:${SITE.email}`,
    icon: Mail,
  },
];

export const CONTACT_DETAILS = [
  {
    label: "Email",
    value: SITE.email,
    href: `mailto:${SITE.email}`,
    icon: Mail,
  },
  {
    label: "Phone",
    value: SITE.phone,
    href: `tel:${SITE.phone.replace(/[^+\d]/g, "")}`,
    icon: Phone,
  },
  {
    label: "Location",
    value: SITE.location,
    href: "https://maps.google.com/?q=Pune,India",
    icon: MapPin,
  },
] as const;

export const TYPING_PHRASES = [
  "Senior React.js Frontend Engineer",
  "Next.js & TypeScript Specialist",
  "Micro Frontend Architect",
  "Enterprise SaaS Developer",
  "Performance & DX Advocate",
];

export const ABOUT_HIGHLIGHTS = [
  "React.js",
  "TypeScript",
  "Next.js",
  "Micro Frontend",
  "RBAC",
  "Performance Optimization",
  "Enterprise SaaS Applications",
];
