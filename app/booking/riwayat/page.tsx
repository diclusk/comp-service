'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getGuestSessionId } from '@/lib/Guestsession';
import { formatDate } from '@/lib/utils';
import type { Booking } from '@/lib/types';

const STATUS_LABELS: Record<string, string> = {
  pending: 'Menunggu Konfirmasi',
  confirmed: 'Dikonfirmasi',
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-500/10 text-amber-300',
  confirmed: 'bg-blue-500/10 text-blue-300',
  completed: 'bg-emerald-500/10 text-emerald-300',
  cancelled: 'bg-red-500/10 text-red-300',
};

export default function GuestBookingHistoryPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasSession, setHasSession] = useState(true);

  useEffect(() => {
    const sessionId = getGuestSessionId();
    if (!sessionId) {
      setTimeout(() => {
        setHasSession(false);
        setLoading(false);
      }, 0);
        return;  
    }

    fetch(`/api/bookings/guest?session_id=${sessionId}`)
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body.error || 'Gagal memuat data');
        setBookings(body.bookings || []);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Terjadi kesalahan'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-bg px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <span className="text-xs font-medium uppercase tracking-wide text-teal-300">
            Booking Tanpa Akun
          </span>
          <h1 className="mt-2 text-2xl font-semibold text-navy-50">Riwayat Booking Sesi Ini</h1>
          <p className="mt-1 text-sm text-blue-200">
            Riwayat ini hanya berlaku selama tab ini terbuka. Ingin riwayat tersimpan permanen?{' '}
            <Link href="/signup" className="font-medium text-teal-300 hover:underline">
              Buat akun
            </Link>
            .
          </p>
        </div>

        {loading && <p className="text-sm text-blue-200">Memuat...</p>}

        {!loading && !hasSession && (
          <div
            className={`relative overflow-hidden rounded-2xl border border-white/10 bg-linear-to-b from-[#131d30] to-[#080c14] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_20px_45px_-15px_rgba(0,0,0,0.75)] transition-all duration-300 hover:-translate-y-0.5 hover:border-white/15 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_24px_50px_-15px_rgba(0,0,0,0.85)]`}
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-teal-400/40 to-transparent" />
            <div className="text-center">
              <p className="text-sm text-blue-200">Belum ada booking di sesi ini. Tab baru = riwayat kosong.</p>
              <Link
                href="/booking"
                className="mt-4 inline-block rounded-lg bg-teal-500 px-4 py-2.5 text-sm font-medium text-navy-900 transition hover:bg-teal-400"
              >
                Buat Booking
              </Link>
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {!loading && hasSession && !error && bookings.length === 0 && (
          <div className={`relative overflow-hidden rounded-2xl border border-white/10 bg-linear-to-b from-[#131d30] to-[#080c14] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_20px_45px_-15px_rgba(0,0,0,0.75)] transition-all duration-300 hover:-translate-y-0.5 hover:border-white/15 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_24px_50px_-15px_rgba(0,0,0,0.85)]`}>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-cyan-400/30 to-transparent" />
            <div className="text-center">
              <p className="text-sm text-blue-200">Belum ada booking di sesi ini.</p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b.id}
              className={`relative overflow-hidden rounded-2xl border border-white/10 bg-linear-to-b from-[#131d30] to-[#080c14] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_20px_45px_-15px_rgba(0,0,0,0.75)] transition-all duration-300 hover:-translate-y-0.5 hover:border-white/15 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_24px_50px_-15px_rgba(0,0,0,0.85)]`}
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-teal-400/30 to-transparent" />

              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-navy-50">{b.service_type}</p>
                  <p className="mt-0.5 text-xs text-blue-200">Jadwal: {formatDate(b.scheduled_date)}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                    STATUS_COLORS[b.status] || 'bg-white/10 text-blue-200'
                  }`}
                >
                  {STATUS_LABELS[b.status] || b.status}
                </span>
              </div>
              {b.description && <p className="mt-3 text-sm text-blue-200">{b.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}