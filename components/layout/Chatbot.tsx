"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  Briefcase,
  Calendar,
  Code2,
  ExternalLink,
  FileText,
  Folder,
  Globe,
  Mail,
  MessageCircle,
  RefreshCw,
  Rocket,
  Send,
  Sparkles,
  User,
  X,
} from "lucide-react";
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { SITE } from "@/constants/personal";
import { useChatbot, type ChatMessage } from "@/hooks/useChatbot";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { scrollToSection } from "@/lib/utils";
import type {
  BotLink,
  BotQuickAction,
  BotReply,
  QuickActionIcon,
} from "@/lib/chatbot/intents";

const PANEL_ID = "rkm-chatbot-panel";

const QUICK_ICONS: Record<QuickActionIcon, typeof User> = {
  user: User,
  code: Code2,
  briefcase: Briefcase,
  folder: Folder,
  rocket: Rocket,
  mail: Mail,
  file: FileText,
  sparkles: Sparkles,
  calendar: Calendar,
  globe: Globe,
};

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [hasInteracted, setHasInteracted] = useState(false);
  const {
    messages,
    isTyping,
    hydrated,
    send,
    reset,
    markRead,
    unreadCount,
    suggestions,
  } = useChatbot();

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const fabRef = useRef<HTMLButtonElement | null>(null);

  const isMobile = useMediaQuery("(max-width: 640px)");

  useEffect(() => {
    if (!open) return;
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping, open]);

  useEffect(() => {
    if (open) {
      markRead();
      const t = setTimeout(() => inputRef.current?.focus(), 200);
      return () => clearTimeout(t);
    }
  }, [open, markRead]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        fabRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Global "/" shortcut: open the chat and focus its input (Slack/GitHub style).
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== "/") return;
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || target?.isContentEditable) return;
      e.preventDefault();
      setOpen(true);
      setHasInteracted(true);
      setTimeout(() => inputRef.current?.focus(), 220);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Body scroll lock on mobile while the panel is open.
  useEffect(() => {
    if (!open || !isMobile) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open, isMobile]);

  const toggle = useCallback(() => {
    setOpen((v) => !v);
    setHasInteracted(true);
  }, []);

  const handleSubmit = useCallback(
    (e?: FormEvent) => {
      e?.preventDefault();
      const value = input.trim();
      if (!value) return;
      send(value);
      setInput("");
    },
    [input, send],
  );

  const onSuggestion = useCallback(
    (text: string) => {
      send(text);
      setInput("");
    },
    [send],
  );

  const onLinkClick = useCallback((link: BotLink) => {
    if (!link.external && link.href.startsWith("#")) {
      setOpen(false);
      setTimeout(() => scrollToSection(link.href.slice(1)), 250);
    }
  }, []);

  const onInputKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  const hasMessages = hydrated && messages.length > 0;
  const showUnread = !open && unreadCount > 0;

  return (
    <>
      {/* Floating action button */}
      <motion.button
        ref={fabRef}
        type="button"
        onClick={toggle}
        aria-label={open ? "Close chat" : "Open chat with portfolio assistant"}
        aria-expanded={open}
        aria-controls={PANEL_ID}
        initial={{ opacity: 0, scale: 0.6, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 260, damping: 22 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-6 right-6 z-[60] inline-flex h-14 w-14 items-center justify-center rounded-full border border-primary/30 bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-glow transition-shadow hover:shadow-glow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {!hasInteracted && !open && (
          <span className="pointer-events-none absolute inset-0 rounded-full bg-primary/40 motion-safe:animate-ping" />
        )}
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="inline-flex"
            >
              <X className="h-6 w-6" aria-hidden />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="inline-flex"
            >
              <MessageCircle className="h-6 w-6" aria-hidden />
            </motion.span>
          )}
        </AnimatePresence>

        {showUnread && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="pointer-events-none absolute -right-1 -top-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full border-2 border-background bg-destructive px-1 text-[10px] font-bold text-destructive-foreground"
            aria-label={`${unreadCount} unread message${unreadCount === 1 ? "" : "s"}`}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            id={PANEL_ID}
            role="dialog"
            aria-modal="false"
            aria-label="Portfolio assistant chat"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="fixed inset-x-4 bottom-24 z-[55] flex max-h-[min(640px,calc(100vh-7.5rem))] flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/90 shadow-glow-lg backdrop-blur-xl sm:inset-x-auto sm:right-6 sm:w-[min(28rem,calc(100vw-3rem))]"
          >
            <ChatHeader onReset={reset} onClose={() => setOpen(false)} />

            <div
              ref={scrollRef}
              className="flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-5"
            >
              {hasMessages &&
                messages.map((m) => (
                  <MessageBubble
                    key={m.id}
                    message={m}
                    onLinkClick={onLinkClick}
                    onQuickAction={onSuggestion}
                  />
                ))}
              {isTyping && <TypingBubble />}
            </div>

            {/* Suggestions */}
            {suggestions.length > 0 && !isTyping && (
              <div className="flex flex-wrap gap-2 border-t border-border/60 bg-background/40 px-4 py-3 sm:px-5">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => onSuggestion(s)}
                    className="rounded-full border border-border/60 bg-secondary/60 px-3 py-1.5 text-xs font-medium text-foreground/80 transition-colors hover:border-primary/50 hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Composer */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 border-t border-border/60 bg-background/60 px-3 py-3 sm:px-4"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder="Ask anything · try /help"
                aria-label="Chat message"
                className="flex-1 rounded-full border border-border/60 bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              />
              <button
                type="submit"
                aria-label="Send message"
                disabled={!input.trim()}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-glow transition-all hover:shadow-glow-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
              >
                <Send className="h-4 w-4" aria-hidden />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ChatHeader({ onReset, onClose }: { onReset: () => void; onClose: () => void }) {
  return (
    <div className="flex items-center gap-3 border-b border-border/60 bg-gradient-to-br from-primary/10 via-card/40 to-accent/10 px-4 py-3 sm:px-5">
      <div className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-glow">
        <Bot className="h-5 w-5" aria-hidden />
        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-emerald-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">
          Ask about {SITE.shortName}
        </p>
        <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
          <Sparkles className="h-3 w-3 text-primary" aria-hidden />
          Portfolio assistant · Online
        </p>
      </div>
      <button
        type="button"
        onClick={onReset}
        aria-label="Reset conversation"
        title="Reset conversation"
        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        <RefreshCw className="h-4 w-4" aria-hidden />
      </button>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close chat"
        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        <X className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}

function MessageBubble({
  message,
  onLinkClick,
  onQuickAction,
}: {
  message: ChatMessage;
  onLinkClick: (link: BotLink) => void;
  onQuickAction: (query: string) => void;
}) {
  const isUser = message.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-soft ${
          isUser
            ? "rounded-br-sm bg-gradient-to-br from-primary to-accent text-primary-foreground"
            : "rounded-bl-sm border border-border/60 bg-background/80 text-foreground"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap break-words">{message.text}</p>
        ) : (
          message.reply && (
            <BotReplyContent
              reply={message.reply}
              onLinkClick={onLinkClick}
              onQuickAction={onQuickAction}
            />
          )
        )}
      </div>
    </motion.div>
  );
}

function BotReplyContent({
  reply,
  onLinkClick,
  onQuickAction,
}: {
  reply: BotReply;
  onLinkClick: (link: BotLink) => void;
  onQuickAction: (query: string) => void;
}) {
  const hasBody = useMemo(
    () =>
      Boolean(
        reply.intro ||
          reply.outro ||
          reply.bullets?.length ||
          reply.links?.length ||
          reply.quickActions?.length,
      ),
    [reply],
  );
  if (!hasBody) return null;

  return (
    <div className="space-y-2.5">
      {reply.intro && (
        <p className="whitespace-pre-wrap break-words">
          {renderInlineMarkdown(reply.intro)}
        </p>
      )}

      {reply.quickActions && reply.quickActions.length > 0 && (
        <QuickActionGrid actions={reply.quickActions} onPick={onQuickAction} />
      )}

      {reply.bullets && reply.bullets.length > 0 && (
        <ul className="space-y-1.5 pl-4">
          {reply.bullets.map((b, i) => (
            <li
              key={i}
              className="relative break-words text-foreground/90 before:absolute before:-left-3.5 before:top-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-primary"
            >
              {renderInlineMarkdown(b)}
            </li>
          ))}
        </ul>
      )}

      {reply.outro && (
        <p className="whitespace-pre-wrap break-words text-foreground/90">
          {renderInlineMarkdown(reply.outro)}
        </p>
      )}

      {reply.links && reply.links.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {reply.links.map((link) => {
            const isExternal = link.external || /^(https?:|mailto:)/.test(link.href);
            const baseClass =
              "inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary transition-colors hover:border-primary/60 hover:bg-primary/15";
            if (isExternal) {
              return (
                <a
                  key={link.href + link.label}
                  href={link.href}
                  target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className={baseClass}
                >
                  {link.label}
                  <ExternalLink className="h-3 w-3" aria-hidden />
                </a>
              );
            }
            return (
              <a
                key={link.href + link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  onLinkClick(link);
                }}
                className={baseClass}
              >
                {link.label}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

function QuickActionGrid({
  actions,
  onPick,
}: {
  actions: BotQuickAction[];
  onPick: (query: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 pt-1">
      {actions.map((a) => {
        const Icon = QUICK_ICONS[a.icon] ?? Sparkles;
        return (
          <button
            key={a.label + a.query}
            type="button"
            onClick={() => onPick(a.query)}
            className="group relative flex items-center gap-2.5 overflow-hidden rounded-xl border border-border/60 bg-background/60 p-2.5 text-left transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft"
          >
            <span
              className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white shadow-soft ${a.accent ?? "from-primary to-accent"}`}
            >
              <Icon className="h-4 w-4" aria-hidden />
            </span>
            <span className="min-w-0 flex-1 text-xs font-medium text-foreground">
              {a.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function TypingBubble() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex w-full justify-start"
    >
      <div className="rounded-2xl rounded-bl-sm border border-border/60 bg-background/80 px-3.5 py-2.5 text-sm text-muted-foreground shadow-soft">
        <span className="inline-flex items-center gap-1" aria-label="Assistant is typing">
          <Dot delay={0} />
          <Dot delay={0.15} />
          <Dot delay={0.3} />
        </span>
      </div>
    </motion.div>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <motion.span
      className="inline-block h-1.5 w-1.5 rounded-full bg-primary"
      animate={{ y: [0, -3, 0], opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 0.9, repeat: Infinity, delay }}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Inline markdown renderer (safe, dependency-free)                           */
/*  Supported: **bold**, *italic*, `code`, [label](url)                       */
/* -------------------------------------------------------------------------- */

const INLINE_TOKEN_RE =
  /(\*\*[^*\n]+\*\*)|(\*[^*\n]+\*)|(`[^`\n]+`)|(\[[^\]\n]+\]\([^)\n]+\))/g;

function renderInlineMarkdown(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let cursor = 0;
  let key = 0;

  for (const match of text.matchAll(INLINE_TOKEN_RE)) {
    const idx = match.index ?? 0;
    if (idx > cursor) out.push(text.slice(cursor, idx));
    const tok = match[0];

    if (tok.startsWith("**") && tok.endsWith("**")) {
      out.push(
        <strong key={key++} className="font-semibold">
          {tok.slice(2, -2)}
        </strong>,
      );
    } else if (tok.startsWith("`") && tok.endsWith("`")) {
      out.push(
        <code
          key={key++}
          className="rounded bg-secondary/70 px-1.5 py-0.5 font-mono text-[0.78rem] text-foreground"
        >
          {tok.slice(1, -1)}
        </code>,
      );
    } else if (tok.startsWith("*") && tok.endsWith("*")) {
      out.push(
        <em key={key++} className="text-foreground/90">
          {tok.slice(1, -1)}
        </em>,
      );
    } else if (tok.startsWith("[") && tok.includes("](")) {
      const labelEnd = tok.indexOf("]");
      const label = tok.slice(1, labelEnd);
      const url = tok.slice(labelEnd + 2, -1);
      const external = /^(https?:|mailto:)/.test(url);
      out.push(
        <a
          key={key++}
          href={url}
          target={external && !url.startsWith("mailto:") ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className="text-primary underline-offset-2 hover:underline"
        >
          {label}
        </a>,
      );
    }
    cursor = idx + tok.length;
  }

  if (cursor < text.length) out.push(text.slice(cursor));
  return out.map((node, i) =>
    typeof node === "string" ? <Fragment key={`t-${i}`}>{node}</Fragment> : node,
  );
}
