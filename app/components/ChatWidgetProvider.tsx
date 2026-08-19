"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type ChatWidgetContextValue = {
  /** Becomes true the first time the chat is summoned; the widget stays unmounted until then. */
  hasOpenedOnce: boolean;
  isOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
};

const ChatWidgetContext = createContext<ChatWidgetContextValue | null>(null);

export function ChatWidgetProvider({ children }: { children: React.ReactNode }) {
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const openChat = useCallback(() => {
    setHasOpenedOnce(true);
    setIsOpen(true);
  }, []);

  const closeChat = useCallback(() => setIsOpen(false), []);

  const toggleChat = useCallback(() => {
    setHasOpenedOnce(true);
    setIsOpen((v) => !v);
  }, []);

  const value = useMemo(
    () => ({ hasOpenedOnce, isOpen, openChat, closeChat, toggleChat }),
    [hasOpenedOnce, isOpen, openChat, closeChat, toggleChat]
  );

  return <ChatWidgetContext.Provider value={value}>{children}</ChatWidgetContext.Provider>;
}

export function useChatWidget() {
  const ctx = useContext(ChatWidgetContext);
  if (!ctx) {
    throw new Error("useChatWidget must be used within a ChatWidgetProvider");
  }
  return ctx;
}
