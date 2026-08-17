"use client";
import { useEffect, useState } from "react";
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
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-4 h-96 flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-black px-4 py-2 rounded-lg">
              <span className="inline-block animate-pulse">Mengetik...</span>
            </div>
          </div>
        )}
        {handedOff && (
          <div className="flex justify-center">
            <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
              Chat sudah diteruskan ke tim CS — Anda tetap bisa lanjut menulis di sini
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder={handedOff ? "Ketik pesan untuk tim CS..." : "Ketik pesan..."}
          className="flex-1 border rounded-lg px-3 py-2 disabled:opacity-50 disabled:bg-gray-50"
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? "..." : "Kirim"}
        </button>
      </div>
    </div>
  );
}
