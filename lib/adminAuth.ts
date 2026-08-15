export const ADMIN_COOKIE_NAME = 'admin_session';
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 jam

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

export async function createSessionToken(): Promise<{ token: string; maxAgeSeconds: number }> {
  const secret = getSecret();
  const expiry = Date.now() + SESSION_TTL_MS;
  const payload = `${expiry}`;
  const sig = await sign(payload, secret);
  return { token: `${payload}.${sig}`, maxAgeSeconds: SESSION_TTL_MS / 1000 };
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return false;

  const expiry = Number(payload);
  if (!expiry || Number.isNaN(expiry) || Date.now() > expiry) return false;

  try {
    const secret = getSecret();
    const expectedSig = await sign(payload, secret);
    return expectedSig === sig;
  } catch {
    return false;
  }
}