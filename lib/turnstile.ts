const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

// Verifikasi token Turnstile di server (jangan pernah percaya token dari client
// begitu saja). Dipakai buat admin login, yang tidak lewat Supabase Auth
// (Supabase Auth punya verifikasi captcha bawaan sendiri; ini untuk alur
// custom kita — admin login pakai cookie HMAC, bukan Supabase Auth).
export async function verifyTurnstileToken(token: string, remoteIp?: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.error('TURNSTILE_SECRET_KEY belum diset di .env.local — captcha tidak bisa diverifikasi.');
    return false;
  }
  if (!token) return false;

  try {
    const body = new URLSearchParams({ secret, response: token });
    if (remoteIp) body.set('remoteip', remoteIp);

    const res = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    const data = await res.json();
    return data?.success === true;
  } catch (err) {
    console.error('Turnstile verify error:', err);
    return false;
  }
}