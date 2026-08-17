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
            rounded-2xl border border-white/10 bg-navy-950/95 shadow-2xl
            overflow-hidden flex flex-col backdrop-blur-xl
            transition-all duration-200 ease-out
            opacity-100 translate-y-0
          "
        >
          <div className="flex items-center gap-3 px-4 py-3 bg-navy-900/80 border-b border-white/10 shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-(--accent)/15 text-(--accent)">
              <ChatCircleDots size={18} weight="fill" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm tracking-wide text-white leading-tight">
                CoVS Assistant
              </p>
              <p className="text-[11px] text-slate-400 leading-tight">
                Biasanya balas dalam beberapa detik
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Tutup chat"
              className="ml-auto rounded-full p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X size={18} weight="bold" />
            </button>
          </div>

          <div className="flex-1 min-h-0">
            <ChatBot />
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Tutup chat" : "Buka chat"}
        className="
          w-14 h-14 rounded-full bg-navy-900 text-(--accent)
          border border-white/10 shadow-lg shadow-black/40
          hover:scale-105 active:scale-95 hover:border-(--accent)/40
          transition-all flex items-center justify-center
        "
      >
        {open ? (
          <X size={26} weight="bold" className="text-white" />
        ) : (
          <ChatCircleDots size={28} weight="fill" />
        )}
      </button>
    </div>
  );
}