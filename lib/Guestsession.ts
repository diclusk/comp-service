const GUEST_SESSION_KEY = 'fixkom_guest_session_id';

export function getOrCreateGuestSessionId(): string {
  if (typeof window === 'undefined') return '';
  const existing = window.sessionStorage.getItem(GUEST_SESSION_KEY);
  if (existing) return existing;
  const id = crypto.randomUUID();
  window.sessionStorage.setItem(GUEST_SESSION_KEY, id);
  return id;
}

export function getGuestSessionId(): string | null {
  if (typeof window === 'undefined') return null;
  return window.sessionStorage.getItem(GUEST_SESSION_KEY);
}