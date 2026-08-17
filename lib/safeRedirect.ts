// Cegah open-redirect: parameter ?redirect= datang dari URL yang bisa
// dikontrol siapa saja (mis. link phishing "login dulu ya" yang ngarahin
// abis sukses login ke situs luar). Cuma izinkan path relatif internal.
export function getSafeRedirect(raw: string | null, fallback: string): string {
  if (!raw) return fallback;
  // Harus mulai dengan satu '/' — tolak URL absolut ("https://...") dan
  // protocol-relative ("//evil.com", yang dianggap browser sebagai host baru).
  if (!raw.startsWith('/') || raw.startsWith('//')) return fallback;
  // Tolak juga kalau ada "://" nyempil di tengah (mis. "/\evil.com" style trick).
  if (raw.includes('://')) return fallback;
  return raw;
}