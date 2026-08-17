"use client";
import { useEffect, useRef, useState } from "react";
import { PaperPlaneRight, Robot } from "@phosphor-icons/react";
import type { ChatMessage } from "@/lib/types";
import { getOrCreateChatSessionId } from "@/lib/chatSession";
import { getGuestSessionId } from "@/lib/Guestsession";
import { getSupabaseBrowser } from "@/lib/supabase/client";

type Message = ChatMessage;

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Halo! Kenalin, Aku CoVS(Cooperative Virtual Service), Asisten Virtual Anda. Ada yang bisa saya bantu hari ini?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [handedOff, setHandedOff] = useState(false);
  const [sessionId] = useState<string>(() =>
    typeof window !== "undefined" ? getOrCreateChatSessionId() : ""
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (!sessionId) return;

    const supabase = getSupabaseBrowser();
    const channel = supabase
      .channel(`chat_widget_${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          const row = payload.new as { role: string; content: string };
          if (row.role !== "admin") return;
          setMessages((prev) => [...prev, { role: "assistant", content: row.content }]);
          setHandedOff(true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          session_id: sessionId,
          guest_session_id: getGuestSessionId(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw Error(data?.error || `Request failed with status ${res.status}`);
      }

      if (data?.aiDisabled) {
        setHandedOff(true);
        return;
      }

      const botReply = data?.choices?.[0]?.message?.content;
      if (!botReply) {
        throw new Error("No response content from server");
      }

      setMessages((prev) => [...prev, { role: "assistant", content: botReply }]);

      if (data?.handedOff && data?.handoffNotice) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.handoffNotice }]);
        setHandedOff(true);
      }
    } catch (error) {
      console.error(error);
      const errorMsg =
        error instanceof Error ? error.message : "Terjadi kesalahan yang tidak diketahui";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `⚠️ Maaf, terjadi kesalahan: ${errorMsg}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full flex-col bg-transparent">
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-4 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role !== "user" && (
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-(--accent)/15 text-(--accent)">
                <Robot size={14} weight="fill" />
              </div>
            )}
            <div
              className={`max-w-[78%] px-3.5 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-(--accent) text-navy-950 font-medium rounded-2xl rounded-br-sm"
                  : "bg-white/6 text-slate-200 border border-white/10 rounded-2xl rounded-bl-sm"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-end gap-2 justify-start">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-(--accent)/15 text-(--accent)">
              <Robot size={14} weight="fill" />
            </div>
            <div className="bg-white/6 border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" />
            </div>
          </div>
        )}
        {handedOff && (
          <div className="flex justify-center py-1">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-300 bg-white/6 border border-white/10 px-3 py-1.5 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-(--status)" />
              Chat sudah diteruskan ke tim CS — Anda tetap bisa lanjut menulis di sini
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 border-t border-white/10 px-3 py-3 shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={handedOff ? "Ketik pesan untuk tim CS..." : "Ketik pesan..."}
          className="flex-1 bg-white/6 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-(--accent)/50 disabled:opacity-50 transition-colors"
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          aria-label="Kirim pesan"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--accent) text-navy-950 disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 active:scale-95 transition-all"
        >
          <PaperPlaneRight size={18} weight="fill" />
        </button>
      </div>
    </div>
  );
}