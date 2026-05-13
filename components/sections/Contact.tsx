"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ArrowRight, Send } from "lucide-react";
import { z } from "zod";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { CONTACT_DETAILS, SITE, SOCIAL_LINKS } from "@/constants/personal";
import {
  fadeInUp,
  slideInLeft,
  slideInRight,
  staggerContainer,
  viewportConfig,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

const contactSchema = z.object({
  name: z.string().min(2, "Please share your name."),
  email: z.string().email("Please enter a valid email."),
  subject: z.string().min(3, "A short subject helps a lot."),
  message: z.string().min(10, "Please add a bit more detail (10+ chars)."),
  _hp: z.string().optional().default(""),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function Contact() {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    mode: "onBlur",
  });

  const openMailtoFallback = (values: ContactFormValues) => {
    const subject = encodeURIComponent(`[Portfolio] ${values.subject}`);
    const body = encodeURIComponent(
      `Hi Rajendra,\n\n${values.message}\n\n—\n${values.name}\n${values.email}`,
    );
    window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`;
  };

  const onSubmit = async (values: ContactFormValues) => {
    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      toast.error(first?.message ?? "Please fix the highlighted fields.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = (await res.json().catch(() => null)) as
        | { ok: boolean; code?: string; message?: string }
        | null;

      if (res.ok && data?.ok) {
        toast.success("Message sent! I'll get back to you within 24 hours.");
        reset();
        return;
      }

      if (res.status === 422 && data?.message) {
        toast.error(data.message);
        return;
      }

      if (
        data?.code === "not_configured" ||
        data?.code === "all_providers_failed" ||
        res.status === 503
      ) {
        if (process.env.NODE_ENV !== "production") {
          console.warn(
            "[contact] server returned 503 — no email provider configured or all failed.\n" +
              "Set GMAIL_USER + GMAIL_APP_PASSWORD (or RESEND_API_KEY / WEB3FORMS_ACCESS_KEY) in .env.local and restart `npm run dev`.\n" +
              "Diagnostic: open http://localhost:3000/api/contact",
            data,
          );
        }
        toast.message("Opening your mail app", {
          description:
            "Direct delivery isn't configured yet — your default email client will open with the message pre-filled.",
        });
        openMailtoFallback(values);
        reset();
        return;
      }

      throw new Error(data?.message ?? `Request failed (${res.status})`);
    } catch (error) {
      console.error("[contact] submit failed", error);
      toast.error("Something went wrong. Opening your mail app as a backup…");
      try {
        openMailtoFallback(values);
      } catch (mailtoError) {
        console.error("[contact] mailto fallback failed", mailtoError);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Section id="contact">
      <SectionHeading
        eyebrow="Contact"
        title="Let's build something great together."
        description="Have a project in mind, a role to discuss, or just want to say hi? My inbox is always open."
      />

      <div className="grid gap-8 lg:grid-cols-12">
        <motion.aside
          variants={slideInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="lg:col-span-5"
        >
          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/60 p-8 backdrop-blur-xl">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-primary/20 blur-3xl"
            />
            <h3 className="text-xl font-semibold tracking-tight">
              Get in touch
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Best for project enquiries, full-time roles, or technical
              collaboration.
            </p>

            <ul className="mt-6 space-y-3">
              {CONTACT_DETAILS.map(({ label, value, href, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={label === "Location" ? "_blank" : undefined}
                    rel={label === "Location" ? "noopener noreferrer" : undefined}
                    className="group flex items-center gap-3 rounded-xl border border-border/60 bg-secondary/40 p-3 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-secondary"
                  >
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="flex flex-col">
                      <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        {label}
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {value}
                      </span>
                    </span>
                    <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Follow
              </p>
              <div className="mt-3 flex gap-2">
                {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-secondary/40 transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </motion.aside>

        <motion.form
          variants={slideInRight}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="lg:col-span-7"
        >
          <motion.div
            variants={staggerContainer(0.06)}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            className="relative space-y-5 rounded-3xl border border-border/60 bg-card/60 p-8 backdrop-blur-xl"
          >
            {/* Honeypot — hidden from humans, catches naive spam bots. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden opacity-0"
            >
              <label>
                Leave this field empty
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  {...register("_hp")}
                />
              </label>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                label="Your Name"
                error={errors.name?.message}
                variants={fadeInUp}
              >
                <input
                  type="text"
                  autoComplete="name"
                  placeholder="Jane Doe"
                  {...register("name", { required: true, minLength: 2 })}
                  className={inputClass(!!errors.name)}
                />
              </FormField>
              <FormField
                label="Email"
                error={errors.email?.message}
                variants={fadeInUp}
              >
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="jane@company.com"
                  {...register("email", {
                    required: true,
                    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  })}
                  className={inputClass(!!errors.email)}
                />
              </FormField>
            </div>

            <FormField
              label="Subject"
              error={errors.subject?.message}
              variants={fadeInUp}
            >
              <input
                type="text"
                placeholder="Let's talk about a project"
                {...register("subject", { required: true, minLength: 3 })}
                className={inputClass(!!errors.subject)}
              />
            </FormField>

            <FormField
              label="Message"
              error={errors.message?.message}
              variants={fadeInUp}
            >
              <textarea
                rows={5}
                placeholder="Tell me a bit about what you have in mind..."
                {...register("message", { required: true, minLength: 10 })}
                className={cn(inputClass(!!errors.message), "min-h-[140px] resize-none")}
              />
            </FormField>

            <motion.div variants={fadeInUp} className="flex items-center justify-between gap-4">
              <p className="text-xs text-muted-foreground">
                I usually reply within 24 hours.
              </p>
              <Button type="submit" loading={submitting} disabled={submitting}>
                {submitting ? (
                  "Sending"
                ) : (
                  <>
                    Send Message
                    <Send className="h-4 w-4" />
                  </>
                )}
              </Button>
            </motion.div>
          </motion.div>
        </motion.form>
      </div>
    </Section>
  );
}

function FormField({
  label,
  error,
  variants,
  children,
}: {
  label: string;
  error?: string;
  variants: typeof fadeInUp;
  children: React.ReactNode;
}) {
  return (
    <motion.label variants={variants} className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </span>
      {children}
      {error && (
        <span className="mt-1.5 block text-xs text-destructive">{error}</span>
      )}
    </motion.label>
  );
}

function inputClass(hasError: boolean) {
  return cn(
    "w-full rounded-xl border bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground transition-all",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    hasError
      ? "border-destructive/60 focus-visible:ring-destructive"
      : "border-border/70 hover:border-primary/30 focus-visible:border-primary/50",
  );
}
