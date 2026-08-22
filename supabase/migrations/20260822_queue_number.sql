-- Sistem nomor antrian: global increment, di-assign saat admin konfirmasi booking (status -> 'confirmed')
create sequence if not exists queue_number_seq;

alter table bookings
  add column if not exists queue_number integer unique;

-- wrapper krn nextval() gak bisa dipanggil langsung lewat PostgREST/supabase-js
create or replace function nextval_queue_number()
returns integer
language sql
as $$
  select nextval('queue_number_seq')::integer;
$$;
