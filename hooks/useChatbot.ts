"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  getReply,
  isClearCommand,
  type BotReply,
} from "@/lib/chatbot/intents";

export type ChatRole = "user" | "bot";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  /** Plain text for user messages, structured reply for bot messages. */
  text?: string;
  reply?: BotReply;
  createdAt: number;
}

const STORAGE_KEY = "rkm.chatbot.history.v2";
const MAX_PERSISTED = 40;

function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function greetingMessage(): ChatMessage {
  return {
    id: uid(),
    role: "bot",
    reply: getReply("hi"),
    createdAt: Date.now(),
  };
}

interface PersistedState {
  messages: ChatMessage[];
}

function loadPersisted(): ChatMessage[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedState;
    if (!Array.isArray(parsed.messages)) return null;
    return parsed.messages;
  } catch {
    return null;
  }
}

function persist(messages: ChatMessage[]) {
  if (typeof window === "undefined") return;
  try {
    const trimmed = messages.slice(-MAX_PERSISTED);
    window.sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ messages: trimmed } satisfies PersistedState),
    );
  } catch {
    // ignore quota errors
  }
}

export function useChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const persisted = loadPersisted();
    setMessages(persisted && persisted.length > 0 ? persisted : [greetingMessage()]);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    persist(messages);
  }, [messages, hydrated]);

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    };
  }, []);

  const reset = useCallback(() => {
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    setIsTyping(false);
    setMessages([greetingMessage()]);
  }, []);

  const send = useCallback(
    (rawInput: string) => {
      const input = rawInput.trim();
      if (!input) return;

      // /clear is special — it wipes history without showing user/bot exchange.
      if (isClearCommand(input)) {
        reset();
        return;
      }

      const userMessage: ChatMessage = {
        id: uid(),
        role: "user",
        text: input,
        createdAt: Date.now(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);

      const delay = Math.min(900, 300 + input.length * 12);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => {
        const reply = getReply(input);
        const botMessage: ChatMessage = {
          id: uid(),
          role: "bot",
          reply,
          createdAt: Date.now(),
        };
        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);
        setUnreadCount((c) => c + 1);
      }, delay);
    },
    [reset],
  );

  const markRead = useCallback(() => setUnreadCount(0), []);

  const lastBotFollowups = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const m = messages[i];
      if (m.role === "bot" && m.reply?.followups?.length) {
        return m.reply.followups;
      }
    }
    return [];
  }, [messages]);

  return {
    messages,
    isTyping,
    hydrated,
    send,
    reset,
    markRead,
    unreadCount,
    suggestions: lastBotFollowups,
  };
}
