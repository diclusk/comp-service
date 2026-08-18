import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase/server';
import { getSafeRedirect } from '@/lib/safeRedirect';

// Dipanggil Supabase abis user selesai login di Google (redirectTo diarahkan kesini).
// Supabase kirim ?code=... yang perlu ditukar jadi session (set cookie).
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

    console.error('OAuth callback error:', error);
  }

  return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
}
