import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'Email dan password wajib diisi' }, { status: 400 });
    }

    const supabase = await getSupabaseServer();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Gagal login' }, { status: 500 });
  }
}