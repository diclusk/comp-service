import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, createSessionToken } from '@/lib/adminAuth';
import { verifyPassword } from '@/lib/adminPassword';
import { getClientIp, isRateLimited, recordLoginAttempt } from '@/lib/adminRateLimit';
import { verifyTurnstileToken } from '@/lib/turnstile';
import { getSupabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  try {
    const { username, password, captchaToken } = await req.json();

    // 1. Rate limit dulu, sebelum sentuh apapun lainnya — kalau IP ini udah
    //    kebanyakan gagal, jangan proses apa-apa lagi.
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

    // 2. Captcha wajib valid sebelum cek kredensial.
    if (typeof captchaToken !== 'string' || !captchaToken) {
      await recordLoginAttempt(ip, false);
      return NextResponse.json({ error: 'Selesaikan verifikasi captcha dulu' }, { status: 400 });
    }
    const captchaOk = await verifyTurnstileToken(captchaToken, ip);
    if (!captchaOk) {
      await recordLoginAttempt(ip, false);
      return NextResponse.json({ error: 'Verifikasi captcha gagal, coba lagi' }, { status: 400 });
    }

    if (typeof username !== 'string' || !username || typeof password !== 'string' || !password) {
      await recordLoginAttempt(ip, false);
      return NextResponse.json({ error: 'Username dan password wajib diisi' }, { status: 400 });
    }

    // 3. Cek kredensial ke tabel admins (password di-hash bcrypt, bukan
    //    dibandingkan plaintext lagi). Pesan error digeneralisir (gak bilang
    //    "username gak ada" vs "password salah") biar gak bocorin username valid.
    const supabase = getSupabase();
    const { data: admin, error: lookupError } = await supabase
      .from('admins')
      .select('id, username, password_hash')
      .eq('username', username)
      .maybeSingle();

    if (lookupError) {
      console.error('Admin lookup error:', lookupError);
      return NextResponse.json({ error: 'Gagal login' }, { status: 500 });
    }

    const passwordOk = admin ? await verifyPassword(password, admin.password_hash) : false;

    if (!admin || !passwordOk) {
      await recordLoginAttempt(ip, false);
      return NextResponse.json({ error: 'Username atau password salah' }, { status: 401 });
    }

    await recordLoginAttempt(ip, true);

    const { token, maxAgeSeconds } = await createSessionToken({
      adminId: admin.id,
      username: admin.username,
    });
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
