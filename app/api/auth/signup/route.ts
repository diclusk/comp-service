import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'Email dan password wajib diisi' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password minimal 8 karakter' }, { status: 400 });
    }

    const supabase = await getSupabaseServer();
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Kalau email confirmation aktif di project Supabase, session di sini masih null
    // sampai user klik link verifikasi.
    return NextResponse.json({
      user: data.user,
      needsEmailConfirmation: !data.session,
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Gagal mendaftar' }, { status: 500 });
  }
}