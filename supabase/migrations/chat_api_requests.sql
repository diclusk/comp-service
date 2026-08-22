-- Tabel rate limiting untuk /api/chat (per IP)
-- Jalankan di Supabase SQL Editor. Pola sama dengan admin_login_attempts.
-- Tanpa RLS, konsisten dengan tabel lain (customers/bookings/leads/admin_login_attempts)
-- karena akses tabel ini cuma lewat service role key di server, bukan dari client.

create table if not exists chat_api_requests (
  id uuid primary key default gen_random_uuid(),
  ip text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_chat_api_requests_ip_created
  on chat_api_requests (ip, created_at);

-- Opsional tapi disarankan: housekeeping biar tabel gak numpuk selamanya.
-- Baris cuma perlu bertahan selama window rate limit (10 menit di kode),
-- tapi Supabase gak punya native TTL — hapus manual/berkala kalau perlu:
-- delete from chat_api_requests where created_at < now() - interval '1 day';
