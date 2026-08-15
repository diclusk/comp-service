"use client";

import { useState } from "react";
import { ChatCircleDots, X } from "@phosphor-icons/react";
import ChatBot from "./ChatBot";

export default function ChatBubble() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {open && (
        <div
          className="
            mb-3 w-[92vw] max-w-sm h-[70vh] max-h-150
            rounded-2xl border border-neutral-200 bg-white shadow-2xl
            overflow-hidden flex flex-col
            transition-all duration-200 ease-out
            opacity-100 translate-y-0
          "
        >
          <div className="flex items-center justify-between px-4 py-3 bg-neutral-900 text-white shrink-0">
            <span className="font-semibold text-sm tracking-wide">CoVs Assistant</span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Tutup chat"
              className="rounded-full p-1 hover:bg-white/10 transition-colors"
            >
              <X size={18} weight="bold" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <ChatBot />
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Tutup chat" : "Buka chat"}
        className="
          w-14 h-14 rounded-full bg-neutral-900 text-white
          shadow-lg hover:scale-105 active:scale-95
          transition-transform flex items-center justify-center
        "
      >
        {open ? <X size={26} weight="bold" /> : <ChatCircleDots size={28} weight="fill" />}
      </button>
    </div>
  );
}