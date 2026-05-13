import { NextResponse } from "next/server";
import { z } from "zod";
import nodemailer from "nodemailer";
import { SITE } from "@/constants/personal";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(160),
  subject: z.string().trim().min(3).max(150),
  message: z.string().trim().min(10).max(4000),
  _hp: z.string().optional().default(""),
});

type Payload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type Provider = "resend" | "gmail" | "web3forms" | "none";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildHtml(data: Payload): string {
  const n = escapeHtml(data.name);
  const e = escapeHtml(data.email);
  const s = escapeHtml(data.subject);
  const m = escapeHtml(data.message).replace(/\n/g, "<br/>");
  return `<!doctype html><html><body style="font-family:Inter,system-ui,sans-serif;background:#0a0d14;color:#e6e7ee;padding:24px;">
  <div style="max-width:560px;margin:0 auto;background:#121826;border:1px solid #1f2937;border-radius:16px;overflow:hidden;">
    <div style="padding:20px 24px;background:linear-gradient(135deg,#6d28d9,#0284c7);color:#fff;">
      <h1 style="margin:0;font-size:18px;font-weight:600;">New portfolio enquiry</h1>
      <p style="margin:4px 0 0;opacity:0.85;font-size:13px;">${s}</p>
    </div>
    <div style="padding:20px 24px;font-size:14px;line-height:1.55;">
      <p style="margin:0 0 4px;color:#9ca3af;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;">From</p>
      <p style="margin:0 0 14px;"><strong>${n}</strong> &lt;<a href="mailto:${e}" style="color:#a78bfa;text-decoration:none;">${e}</a>&gt;</p>
      <p style="margin:0 0 4px;color:#9ca3af;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;">Message</p>
      <div style="margin:0;padding:14px 16px;background:#0a0d14;border:1px solid #1f2937;border-radius:10px;white-space:pre-wrap;">${m}</div>
    </div>
    <div style="padding:14px 24px;background:#0a0d14;color:#6b7280;font-size:12px;border-top:1px solid #1f2937;">
      Sent via the contact form on ${SITE.url}
    </div>
  </div>
</body></html>`;
}

function buildText(data: Payload): string {
  return `New portfolio enquiry
Subject: ${data.subject}

From: ${data.name} <${data.email}>

${data.message}

---
Sent via the contact form on ${SITE.url}`;
}

function configuredProviders(): {
  resend: boolean;
  gmail: boolean;
  web3forms: boolean;
} {
  return {
    resend: Boolean(process.env.RESEND_API_KEY),
    gmail: Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD),
    web3forms: Boolean(process.env.WEB3FORMS_ACCESS_KEY),
  };
}

/* -------------------------------------------------------------------------- */
/* Providers                                                                  */
/* -------------------------------------------------------------------------- */

async function sendViaResend(payload: Payload): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, error: "missing_key" };

  const from = process.env.RESEND_FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>";
  const to = process.env.RESEND_TO_EMAIL || SITE.email;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to,
      reply_to: payload.email,
      subject: `[Portfolio] ${payload.subject}`,
      html: buildHtml(payload),
      text: buildText(payload),
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return { ok: false, error: `resend_${res.status}: ${text.slice(0, 300)}` };
  }
  return { ok: true };
}

async function sendViaGmail(payload: Payload): Promise<{ ok: boolean; error?: string }> {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return { ok: false, error: "missing_credentials" };

  const to = process.env.GMAIL_TO_EMAIL || SITE.email;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: `"Portfolio Contact" <${user}>`,
      to,
      replyTo: `"${payload.name}" <${payload.email}>`,
      subject: `[Portfolio] ${payload.subject}`,
      text: buildText(payload),
      html: buildHtml(payload),
    });

    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, error: `gmail_smtp: ${message.slice(0, 300)}` };
  }
}

async function sendViaWeb3Forms(payload: Payload): Promise<{ ok: boolean; error?: string }> {
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (!accessKey) return { ok: false, error: "missing_key" };

  const res = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: accessKey,
      name: payload.name,
      email: payload.email,
      subject: `[Portfolio] ${payload.subject}`,
      message: payload.message,
      from_name: "Portfolio Contact",
      replyto: payload.email,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return { ok: false, error: `web3forms_${res.status}: ${text.slice(0, 200)}` };
  }
  const json = (await res.json().catch(() => null)) as
    | { success?: boolean; message?: string }
    | null;
  if (!json?.success) {
    return { ok: false, error: `web3forms_unsuccessful: ${json?.message ?? "no body"}` };
  }
  return { ok: true };
}

/* -------------------------------------------------------------------------- */
/* GET — diagnostic                                                           */
/* -------------------------------------------------------------------------- */

export async function GET() {
  const providers = configuredProviders();
  const any = providers.resend || providers.gmail || providers.web3forms;
  return NextResponse.json({
    ok: any,
    providers,
    message: any
      ? "At least one email provider is configured. POST to this endpoint to send."
      : "No email provider is configured. The contact form will fall back to opening the visitor's mail client. Set RESEND_API_KEY, GMAIL_USER + GMAIL_APP_PASSWORD, or WEB3FORMS_ACCESS_KEY in .env.local to enable automatic delivery.",
    hint: "See .env.example for setup instructions.",
  });
}

/* -------------------------------------------------------------------------- */
/* POST — send                                                                */
/* -------------------------------------------------------------------------- */

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, code: "invalid_json", message: "Invalid request body." },
      { status: 400 },
    );
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        code: "validation_error",
        message: parsed.error.issues[0]?.message ?? "Validation failed.",
      },
      { status: 422 },
    );
  }

  if (parsed.data._hp && parsed.data._hp.trim().length > 0) {
    console.warn("[contact] honeypot triggered — silently dropped");
    return NextResponse.json({ ok: true, code: "ok" });
  }

  const payload: Payload = {
    name: parsed.data.name,
    email: parsed.data.email,
    subject: parsed.data.subject,
    message: parsed.data.message,
  };
  const providers = configuredProviders();

  console.log(
    `[contact] received submission from ${payload.email} | providers: ${JSON.stringify(providers)}`,
  );

  const errors: Record<string, string> = {};
  let provider: Provider = "none";

  if (providers.resend) {
    const r = await sendViaResend(payload);
    if (r.ok) {
      provider = "resend";
      console.log("[contact] delivered via Resend");
      return NextResponse.json({ ok: true, code: "ok", provider });
    }
    errors.resend = r.error ?? "unknown";
    console.error("[contact] Resend failed:", r.error);
  }

  if (providers.gmail) {
    const r = await sendViaGmail(payload);
    if (r.ok) {
      provider = "gmail";
      console.log("[contact] delivered via Gmail SMTP");
      return NextResponse.json({ ok: true, code: "ok", provider });
    }
    errors.gmail = r.error ?? "unknown";
    console.error("[contact] Gmail SMTP failed:", r.error);
  }

  if (providers.web3forms) {
    const r = await sendViaWeb3Forms(payload);
    if (r.ok) {
      provider = "web3forms";
      console.log("[contact] delivered via Web3Forms");
      return NextResponse.json({ ok: true, code: "ok", provider });
    }
    errors.web3forms = r.error ?? "unknown";
    console.error("[contact] Web3Forms failed:", r.error);
  }

  const noneConfigured = !providers.resend && !providers.gmail && !providers.web3forms;
  console.warn(
    noneConfigured
      ? "[contact] NO PROVIDER CONFIGURED — client will fall back to mailto"
      : "[contact] all configured providers failed; falling back to mailto",
  );

  return NextResponse.json(
    {
      ok: false,
      code: noneConfigured ? "not_configured" : "all_providers_failed",
      message: noneConfigured
        ? "Email provider not configured. Set RESEND_API_KEY, GMAIL_USER+GMAIL_APP_PASSWORD, or WEB3FORMS_ACCESS_KEY in .env.local."
        : "All configured providers failed. Check server logs for details.",
      providers,
      errors,
    },
    { status: 503 },
  );
}
