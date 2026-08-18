export const ADMIN_COOKIE_NAME = 'admin_session';
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 jam

export type AdminSession = { adminId: string; username: string };

// Catatan: file ini sengaja TIDAK import bcryptjs — proxy.ts (Edge runtime)
// import verifySessionToken dari sini, dan cuma boleh pakai Web Crypto API
// (edge-compatible). Hash/verify password (butuh bcrypt, Node-only) ada di
// lib/adminPassword.ts, dipakai terpisah cuma dari API route login (Node runtime).

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error('ADMIN_SESSION_SECRET belum di-set di .env.local');
  }
  return secret;
}

function toBase64Url(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function sign(payload: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(payload));
  return toBase64Url(sig);
}

// Payload sekarang bawa identitas admin (bukan cuma expiry) — supaya dashboard
// bisa nunjukin "login sebagai siapa", dan kalau nanti butuh revoke akses satu
// admin spesifik, infonya udah ada di token.
export async function createSessionToken(
  session: AdminSession
): Promise<{ token: string; maxAgeSeconds: number }> {
  const secret = getSecret();
  const expiry = Date.now() + SESSION_TTL_MS;
  const payload = JSON.stringify({ ...session, exp: expiry });
  const payloadB64 = toBase64Url(new TextEncoder().encode(payload).buffer as ArrayBuffer);
  const sig = await sign(payloadB64, secret);
  return { token: `${payloadB64}.${sig}`, maxAgeSeconds: SESSION_TTL_MS / 1000 };
}

export async function verifySessionToken(
  token: string | undefined | null
): Promise<AdminSession | null> {
  if (!token) return null;
  const [payloadB64, sig] = token.split('.');
  if (!payloadB64 || !sig) return null;

  try {
    const secret = getSecret();
    const expectedSig = await sign(payloadB64, secret);
    if (!constantTimeEqual(expectedSig, sig)) return null;

    const binary = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'));
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const payload = JSON.parse(new TextDecoder().decode(bytes));

    if (!payload.exp || Date.now() > payload.exp) return null;
    if (typeof payload.adminId !== 'string' || typeof payload.username !== 'string') return null;

    return { adminId: payload.adminId, username: payload.username };
  } catch {
    return null;
  }
}

// Bandingkan dua string tanpa exit lebih cepat kalau ketemu karakter beda
// duluan (mitigasi timing attack). Panjang beda juga tidak langsung expose
// lewat waktu eksekusi (tetap loop sepanjang string terpanjang).
export function constantTimeEqual(a: string, b: string): boolean {
  const len = Math.max(a.length, b.length);
  let diff = a.length === b.length ? 0 : 1;
  for (let i = 0; i < len; i++) {
    const charA = a.charCodeAt(i) || 0;
    const charB = b.charCodeAt(i) || 0;
    diff |= charA ^ charB;
  }
  return diff === 0;
}
