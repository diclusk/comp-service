"use client";

import { useChatWidget } from "./ChatWidgetProvider";

export default function AskAiButton() {
  const { openChat } = useChatWidget();

  return (
    <button
      type="button"
      onClick={openChat}
      className="group inline-flex items-center justify-center gap-2.5 border border-dashed border-white/25 px-6 py-3 font-mono text-sm text-white transition-colors duration-150 hover:border-[#7C99B3] hover:text-[#7C99B3]"
    >
      <span className="text-[#7C99B3] group-hover:text-current">&gt;_</span>
      Tanya AI Dulu
    </button>
  );
}
