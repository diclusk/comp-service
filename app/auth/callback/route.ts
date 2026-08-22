import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase/server';
import { getSafeRedirect } from '@/lib/safeRedirect';

// Dipanggil Supabase abis user klik link OAuth (Google) ATAU link verifikasi email
// (signup/reset password) — keduanya sama-sama kirim ?code=... yang ditukar jadi session.
export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get('code');
  const redirect = getSafeRedirect(searchParams.get('redirect'), '/my-bookings');

  if (code) {
    const supabase = await getSupabaseServer();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${redirect}`);
    }

    console.error('Auth callback error:', error);
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
