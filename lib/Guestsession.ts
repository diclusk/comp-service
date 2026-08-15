// Identitas booking anonymous, disimpan di sessionStorage (BUKAN localStorage) supaya
// otomatis hilang begitu tab ditutup — sesuai requirement dashboard anon.
const GUEST_SESSION_KEY = 'fixkom_guest_session_id';

/** Ambil guest_session_id yang sudah ada, atau buat baru kalau belum ada di tab ini. */
export function getOrCreateGuestSessionId(): string {
  if (typeof window === 'undefined') return '';
  const existing = window.sessionStorage.getItem(GUEST_SESSION_KEY);
  if (existing) return existing;
  const id = crypto.randomUUID();
  window.sessionStorage.setItem(GUEST_SESSION_KEY, id);
  return id;
}

/** Baca guest_session_id kalau ada, tanpa bikin baru (dipakai di halaman riwayat). */
export function getGuestSessionId(): string | null {
  if (typeof window === 'undefined') return null;
  return window.sessionStorage.getItem(GUEST_SESSION_KEY);
}