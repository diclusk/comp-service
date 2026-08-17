import { getSupabase } from '@/lib/supabase';

const MAX_FAILED_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 menit

// Disimpan di DB (bukan variabel in-memory) karena tiap invocation
// serverless/Vercel bisa jalan di instance yang beda-beda — in-memory
// counter gampang "reset" sendiri tanpa sadar dan jadi tidak reliable.
export async function isRateLimited(ip: string): Promise<{ limited: boolean; retryAfterSeconds?: number }> {
  const supabase = getSupabase();
  const since = new Date(Date.now() - WINDOW_MS).toISOString();

  const { data, error } = await supabase
    .from('admin_login_attempts')
    .select('created_at')
    .eq('ip', ip)
    .eq('success', false)
    .gte('created_at', since)
    .order('created_at', { ascending: true });

  if (error) {
    // Kalau gagal baca (mis. tabel belum ada migration-nya belum jalan),
    // jangan block login sama sekali — fail-open, bukan fail-closed,
    // supaya admin tidak terkunci total gara-gara masalah infra.
    console.error('isRateLimited: gagal cek admin_login_attempts:', error);
    return { limited: false };
  }

  if (!data || data.length < MAX_FAILED_ATTEMPTS) return { limited: false };

  const oldestInWindow = new Date(data[0].created_at).getTime();
  const retryAfterSeconds = Math.max(
    0,
    Math.ceil((oldestInWindow + WINDOW_MS - Date.now()) / 1000)
  );
  return { limited: true, retryAfterSeconds };
}

export async function recordLoginAttempt(ip: string, success: boolean): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase.from('admin_login_attempts').insert([{ ip, success }]);
  if (error) console.error('recordLoginAttempt: gagal simpan:', error);
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}