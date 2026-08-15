'use client';

import { useState, FormEvent } from 'react';
import { BorderBeam } from '@/app/components/border-beam';

const DEVICE_TYPES = ['Laptop', 'PC / Desktop', 'Printer', 'Lainnya'];
const SERVICE_TYPES = [
  'Perbaikan Hardware',
  'Instalasi Software',
  'Upgrade Komponen',
  'Cleaning & Maintenance',
  'Lainnya',
];

const inputClass =
  'mt-1.5 w-full rounded-lg border border-white/10 bg-[#0f1826] px-3.5 py-2.5 text-sm text-white ' +
  'placeholder:text-slate-500 outline-none transition focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/20';

const selectClass =
  inputClass +
  ' appearance-none bg-[url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%2394a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>\')] bg-no-repeat bg-[right_0.9rem_center] pr-9';

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <h3 className="shrink-0 text-sm font-semibold text-white">{children}</h3>
      <span className="h-px flex-1 bg-white/10" />
    </div>
  );
}

export default function BookingPage() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [deviceType, setDeviceType] = useState(DEVICE_TYPES[0]);
  const [serviceType, setServiceType] = useState(SERVICE_TYPES[0]);
  const [description, setDescription] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          phone,
          email,
          deviceType,
          serviceType,
          description,
          bookingDate,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || 'Gagal mengirim booking');
      }

      // TODO: redirect / tampilkan konfirmasi sesuai flow booking kamu
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative rounded-2xl p-0.5 [bg-gradient-to-b_from-[#0B1629]_to-[#060A13]] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_20px_45px_-15px_rgba(0,0,0,0.85)] scheme:dark">
      <BorderBeam size={70} duration={7} colorFrom="#2dd4bf" colorTo="#22d3ee" borderWidth={2} ambientIntensity={0.14} />

      <form
        onSubmit={handleSubmit}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-linear-to-b from-[#131d30] to-[#080c14] p-6 sm:p-8 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_20px_45px_-15px_rgba(0,0,0,0.85)] scheme:dark"
      >
        <SectionLabel>Data Pelanggan</SectionLabel>

        <div className="mt-5">
          <label htmlFor="fullName" className="block text-sm font-medium text-slate-300">
            Nama Lengkap
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            placeholder="cth. Budi Santoso"
            className={inputClass}
          />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-300">
              No. Telepon
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="08xxxxxxxxxx"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="nama@email.com"
              className={inputClass}
            />
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="deviceType" className="block text-sm font-medium text-slate-300">
            Jenis Perangkat
          </label>
          <select
            id="deviceType"
            value={deviceType}
            onChange={(e) => setDeviceType(e.target.value)}
            className={selectClass}
          >
            {DEVICE_TYPES.map((type) => (
              <option key={type} value={type} className="bg-[#0f1826] text-white">
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-8">
          <SectionLabel>Detail Booking</SectionLabel>
        </div>

        <div className="mt-5">
          <label htmlFor="serviceType" className="block text-sm font-medium text-slate-300">
            Jenis Layanan
          </label>
          <select
            id="serviceType"
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            className={selectClass}
          >
            {SERVICE_TYPES.map((type) => (
              <option key={type} value={type} className="bg-[#0f1826] text-white">
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4">
          <label htmlFor="description" className="block text-sm font-medium text-slate-300">
            Deskripsi Keluhan
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            placeholder="Jelaskan masalah yang dialami..."
            className={inputClass + ' resize-none'}
          />
        </div>

        <div className="mt-4">
          <label htmlFor="bookingDate" className="block text-sm font-medium text-slate-300">
            Tanggal Booking
          </label>
          <input
            id="bookingDate"
            type="date"
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
            required
            className={inputClass}
          />
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-red-400/20 bg-red-400/10 px-3.5 py-2.5 text-sm text-red-300">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-teal-400 py-2.5 text-sm font-semibold text-[#06110f] transition hover:bg-teal-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Mengirim...' : 'Kirim Booking'}
        </button>
      </form>
    </div>
  );
}