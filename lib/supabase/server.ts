import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Dipakai di Server Component & Route Handler. Di Server Component, set()/delete()
// akan gagal diam-diam (Next.js tidak izinkan tulis cookie saat render) — itu wajar,
// karena refresh token tetap ditangani oleh proxy.ts di setiap request.
export async function getSupabaseServer() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // dipanggil dari Server Component — abaikan, proxy.ts yang refresh session
          }
        },
      },
    }
  );
}