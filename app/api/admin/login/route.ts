import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, createSessionToken } from '@/lib/adminAuth';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json(
        { error: 'ADMIN_PASSWORD belum di-set di .env.local' },
        { status: 500 }
      );
    }

    if (typeof password !== 'string' || password !== adminPassword) {
      return NextResponse.json({ error: 'Password salah' }, { status: 401 });
    }

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
