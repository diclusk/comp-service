import { getSupabase } from '@/lib/supabase';

const MAX_REQUESTS = 10;
const WINDOW_MS = 10 * 60 * 1000; // 10 menit

export async function isChatRateLimited(
  ip: string
): Promise<{ limited: boolean; retryAfterSeconds?: number }> {
  const supabase = getSupabase();
  const since = new Date(Date.now() - WINDOW_MS).toISOString();

  const { data, error } = await supabase
    .from('chat_api_requests')
    .select('created_at')
    .eq('ip', ip)
    .gte('created_at', since)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('isChatRateLimited: gagal cek chat_api_requests:', error);
    return { limited: false };
  }

  if (!data || data.length < MAX_REQUESTS) return { limited: false };

  const oldestInWindow = new Date(data[0].created_at).getTime();
  const retryAfterSeconds = Math.max(
    0,
    Math.ceil((oldestInWindow + WINDOW_MS - Date.now()) / 1000)
  );
  return { limited: true, retryAfterSeconds };
}

export async function recordChatRequest(ip: string): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase.from('chat_api_requests').insert([{ ip }]);
  if (error) console.error('recordChatRequest: gagal simpan:', error);
}

export { getClientIp } from '@/lib/adminRateLimit';
