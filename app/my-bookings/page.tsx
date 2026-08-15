'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import type { Booking } from '@/lib/types';

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

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/bookings/mine')
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body.error || 'Gagal memuat data');
        setBookings(body.bookings || []);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Terjadi kesalahan'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <span className="text-xs font-medium uppercase tracking-wide text-teal-700">
            Riwayat Akun
          </span>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">Riwayat Booking Saya</h1>
          <p className="mt-1 text-sm text-slate-500">
            Riwayat ini tersimpan permanen selama akun kamu masih ada.
          </p>
        </div>

        {loading && <p className="text-sm text-slate-500">Memuat...</p>}

        {!loading && error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && bookings.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <p className="text-sm text-slate-600">Kamu belum punya booking.</p>
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
