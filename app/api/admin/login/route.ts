import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, constantTimeEqual, createSessionToken } from '@/lib/adminAuth';
import { getClientIp, isRateLimited, recordLoginAttempt } from '@/lib/adminRateLimit';
import { verifyTurnstileToken } from '@/lib/turnstile';

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  try {
    const { password, captchaToken } = await req.json();

    // 1. Rate limit dulu, sebelum sentuh password/captcha sama sekali —
    //    kalau IP ini udah kebanyakan gagal, jangan proses apa-apa lagi.
    const { limited, retryAfterSeconds } = await isRateLimited(ip);
    if (limited) {
      return NextResponse.json(
        {
          error: `Terlalu banyak percobaan gagal. Coba lagi dalam ${Math.ceil(
            (retryAfterSeconds || 0) / 60
          )} menit.`,
        },
        { status: 429 }
      );
    }

    // 2. Captcha wajib valid sebelum cek password.
    if (typeof captchaToken !== 'string' || !captchaToken) {
      await recordLoginAttempt(ip, false);
      return NextResponse.json({ error: 'Selesaikan verifikasi captcha dulu' }, { status: 400 });
    }
    const captchaOk = await verifyTurnstileToken(captchaToken, ip);
    if (!captchaOk) {
      await recordLoginAttempt(ip, false);
      return NextResponse.json({ error: 'Verifikasi captcha gagal, coba lagi' }, { status: 400 });
    }

    // 3. Cek password (constant-time, hindari timing attack).
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      return NextResponse.json(
        { error: 'ADMIN_PASSWORD belum di-set di .env.local' },
        { status: 500 }
      );
    }

    const passwordOk =
      typeof password === 'string' && constantTimeEqual(password, adminPassword);

    if (!passwordOk) {
      await recordLoginAttempt(ip, false);
      return NextResponse.json({ error: 'Password salah' }, { status: 401 });
    }

    await recordLoginAttempt(ip, true);

    const { token, maxAgeSeconds } = await createSessionToken();
    const res = NextResponse.json({ ok: true });
    res.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: maxAgeSeconds,
    });
    return res;
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({ error: 'Gagal login' }, { status: 500 });
  }
}