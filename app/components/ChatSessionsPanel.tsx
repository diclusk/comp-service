'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChatCircleDots, PaperPlaneRight, CircleNotch, Robot, Headset } from '@phosphor-icons/react';
import type { ChatSession, ChatSessionMessage } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { getSupabaseBrowser } from '@/lib/supabase/client';

type SessionWithPreview = ChatSession & {
  last_message: string | null;
  last_message_role: 'user' | 'assistant' | 'admin' | null;
};

const STATUS_STYLES: Record<string, string> = {
  bot: 'border-teal-400/20 bg-teal-400/10 text-teal-300',
  handed_off: 'border-amber-400/20 bg-amber-400/10 text-amber-300',
};

export const ChatSessionsPanel = () => {
  const [sessions, setSessions] = useState<SessionWithPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatSessionMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const loadSessions = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/chats');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSessions(data.sessions || []);
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal memuat sesi chat');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMessages = useCallback(async (id: string) => {
    setMessagesLoading(true);
    try {
      const res = await fetch(`/api/admin/chats/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessages(data.messages || []);
    } catch (e) {
      console.error(e);
    } finally {
      setMessagesLoading(false);
    }
  }, []);

  useEffect(() => {
    const run = async () => {
      await loadSessions();
    };
    run();
  }, [loadSessions]);

  useEffect(() => {
    if (!activeId) return;
    const run = async () => {
      await loadMessages(activeId);
    };
    run();
  }, [activeId, loadMessages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  // Realtime: update list sesi (posisi & preview) tiap ada pesan baru dari mana
  // pun, dan kalau lagi buka thread yang sama, tempel pesan baru itu langsung.
  useEffect(() => {
    const supabase = getSupabaseBrowser();
    const channel = supabase
      .channel('admin_chat_overview')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages' },
        (payload) => {
          const row = payload.new as ChatSessionMessage;
          loadSessions();
          setActiveId((current) => {
            if (current === row.session_id) {
              setMessages((prev) => [...prev, row]);
            }
            return current;
          });
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'chat_sessions' },
        () => loadSessions()
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_sessions' },
        () => loadSessions()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadSessions]);

  const sendReply = async () => {
    if (!reply.trim() || !activeId || sending) return;
    setSending(true);
    try {
      const res = await fetch(`/api/admin/chats/${activeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: reply }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setReply('');
      // Optimis: tempel langsung, realtime insert nanti jadi no-op ganda? Tidak —
      // kita filter dobel di bawah lewat id kalau perlu, tapi karena admin cuma
      // 1 tab pada umumnya, cukup andalkan realtime saja untuk konsistensi.
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'Gagal mengirim balasan');
    } finally {
      setSending(false);
    }
  };

  const activeSession = sessions.find((s) => s.id === activeId);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
      {/* Daftar sesi */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02]">
        <div className="border-b border-white/10 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Sesi Chat ({sessions.length})
        </div>
        <div className="max-h-[520px] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-10 text-slate-500">
              <CircleNotch className="animate-spin" size={20} />
            </div>
          ) : sessions.length === 0 ? (
            <p className="px-4 py-6 text-sm text-slate-500">Belum ada chat masuk.</p>
          ) : (
            sessions.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveId(s.id)}
                className={`block w-full border-b border-white/5 px-4 py-3 text-left transition hover:bg-white/[0.03] ${
                  activeId === s.id ? 'bg-white/[0.05]' : ''
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-medium text-white">
                    {s.customer_name || s.customer_phone || 'Pengunjung anonim'}
                  </span>
                  <span
                    className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium ${STATUS_STYLES[s.status]}`}
                  >
                    {s.status === 'bot' ? 'AI' : 'CS'}
                  </span>
                </div>
                <p className="mt-1 truncate text-xs text-slate-500">
                  {s.last_message || 'Belum ada pesan'}
                </p>
                <p className="mt-1 text-[10px] text-slate-600">{formatDate(s.last_message_at)}</p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Thread */}
      <div className="flex min-h-[400px] flex-col rounded-xl border border-white/10 bg-white/[0.02]">
        {!activeSession ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-slate-600">
            <ChatCircleDots size={28} />
            <p className="text-sm">Pilih sesi chat di sebelah kiri</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-white">
                  {activeSession.customer_name || activeSession.customer_phone || 'Pengunjung anonim'}
                </p>
                {activeSession.customer_phone && (
                  <p className="text-xs text-slate-500">{activeSession.customer_phone}</p>
                )}
              </div>
              <span
                className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${STATUS_STYLES[activeSession.status]}`}
              >
                {activeSession.status === 'bot' ? <Robot size={12} /> : <Headset size={12} />}
                {activeSession.status === 'bot' ? 'Ditangani AI' : 'Ditangani CS'}
              </span>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-2 overflow-y-auto px-4 py-3">
              {messagesLoading ? (
                <div className="flex justify-center py-6 text-slate-500">
                  <CircleNotch className="animate-spin" size={18} />
                </div>
              ) : (
                messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[80%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm ${
                        m.role === 'user'
                          ? 'bg-white/10 text-slate-200'
                          : m.role === 'admin'
                            ? 'bg-teal-500/20 text-teal-100'
                            : 'bg-blue-500/20 text-blue-100'
                      }`}
                    >
                      <p>{m.content}</p>
                      <p className="mt-1 text-[10px] opacity-60">
                        {m.role === 'admin' ? 'Anda (CS)' : m.role === 'assistant' ? 'AI' : 'Customer'}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex gap-2 border-t border-white/10 p-3">
              <input
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendReply()}
                placeholder="Balas sebagai CS..."
                className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-teal-400"
              />
              <button
                onClick={sendReply}
                disabled={sending || !reply.trim()}
                className="flex items-center gap-1 rounded-lg bg-teal-500 px-3 py-2 text-sm font-medium text-black disabled:opacity-50"
              >
                <PaperPlaneRight size={16} />
              </button>
            </div>
          </>
        )}
      </div>

      {error && <p className="lg:col-span-2 text-sm text-red-400">{error}</p>}
    </div>
  );
};
