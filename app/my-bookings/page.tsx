import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSupabaseServer } from '@/lib/supabase/server';
import { getSupabase } from '@/lib/supabase';
import { formatDate } from '@/lib/utils';
import type { Booking } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Riwayat Booking Saya',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Menunggu Konfirmasi',
  confirmed: 'Dikonfirmasi',
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700',
  confirmed: 'bg-blue-50 text-blue-700',
  completed: 'bg-emerald-50 text-emerald-700',
  cancelled: 'bg-red-50 text-red-700',
};

export default async function MyBookingsPage() {
  // proxy.ts sudah redirect ke /login kalau belum login; guard ini jaga-jaga
  // kalau page diakses lewat jalur lain (mis. prefetch) sebelum proxy jalan.
  const supabaseAuth = await getSupabaseServer();
  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/my-bookings');
  }

  const supabase = getSupabase();

  const { data: customers, error: customersError } = await supabase
    .from('customers')
    .select('id')
    .eq('user_id', user.id);

  let bookings: Booking[] = [];
  let loadError = '';

  if (customersError) {
    loadError = customersError.message;
  } else {
    const customerIds = (customers || []).map((c) => c.id);
    if (customerIds.length > 0) {
      const { data, error } = await supabase
        .from('bookings')
        .select('*, customers(name, phone)')
        .in('customer_id', customerIds)
        .order('scheduled_date', { ascending: false });

      if (error) {
        loadError = error.message;
      } else {
        bookings = (data || []) as Booking[];
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium uppercase tracking-wide text-teal-700">
              Akun Saya
            </span>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">Riwayat Booking</h1>
            <p className="mt-1 text-sm text-slate-500">
              Masuk sebagai <span className="font-medium">{user.email}</span>
            </p>
          </div>
          <form action="/api/auth/logout" method="post">
            <button
              type="submit"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-100"
            >
              Keluar
            </button>
          </form>
        </div>

        {loadError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {loadError}
          </div>
        )}

        {!loadError && bookings.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <p className="text-sm text-slate-600">Belum ada booking di akun ini.</p>
            <Link
              href="/booking"
              className="mt-4 inline-block rounded-lg bg-navy-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-navy-700"
            >
              Buat Booking
            </Link>
          </div>
        )}

        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b.id} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{b.service_type}</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Jadwal: {formatDate(b.scheduled_date)}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                    STATUS_COLORS[b.status] || 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {STATUS_LABELS[b.status] || b.status}
                </span>
              </div>
              {b.description && (
                <p className="mt-3 text-sm text-slate-600">{b.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}