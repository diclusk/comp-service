// Identitas chat session widget, disimpan di sessionStorage (BUKAN localStorage)
// — pola sama persis dengan lib/Guestsession.ts, tapi key beda karena ini
// konsepnya independen dari guest booking (satu tab bisa punya keduanya).
const CHAT_SESSION_KEY = 'fixkom_chat_session_id';

/** Ambil chat_session_id yang sudah ada, atau buat baru kalau belum ada di tab ini. */
export function getOrCreateChatSessionId(): string {
  if (typeof window === 'undefined') return '';
  const existing = window.sessionStorage.getItem(CHAT_SESSION_KEY);
  if (existing) return existing;
  const id = crypto.randomUUID();
  window.sessionStorage.setItem(CHAT_SESSION_KEY, id);
  return id;
}
