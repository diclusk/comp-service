const CHAT_SESSION_KEY = 'fixkom_chat_session_id';

export function getOrCreateChatSessionId(): string {
  if (typeof window === 'undefined') return '';
  const existing = window.sessionStorage.getItem(CHAT_SESSION_KEY);
  if (existing) return existing;
  const id = crypto.randomUUID();
  window.sessionStorage.setItem(CHAT_SESSION_KEY, id);
  return id;
}
