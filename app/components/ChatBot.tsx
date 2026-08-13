"use client";
import { useState } from "react";
import type { ChatMessage } from "@/lib/types";

type Message = ChatMessage;

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Halo! 👋 Saya di sini bantu diagnose masalah komputer Anda. Apa yang bermasalah hari ini?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw Error(data?.error || `Request failed with status ${res.status}`);
      }

      const botReply = data?.choices?.[0]?.message?.content;
      if (!botReply) {
        throw new Error("No response content from server");
      }

      setMessages([...newMessages, { role: "assistant", content: botReply }]);
    } catch (error) {
      console.error(error);
      const errorMsg =
        error instanceof Error ? error.message : "Terjadi kesalahan yang tidak diketahui";
      setMessages([
        ...newMessages,
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
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ketik pesan..."
          className="flex-1 border rounded-lg px-3 py-2"
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

