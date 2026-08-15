'use client';
 
import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { getOrCreateGuestSessionId } from '@/lib/Guestsession';
import { getSupabaseBrowser } from '@/lib/supabase/client';
 
type DeviceType = 'Laptop' | 'PC Desktop' | 'Printer' | 'Lainnya';
type ServiceType =
  | 'Perbaikan Hardware'
  | 'Instalasi OS & Software'
  | 'Upgrade Komponen'
  | 'Pembersihan & Maintenance'
  | 'Recovery Data'
  | 'Lainnya';
 
interface BookingFormData {
  name: string;
  phone: string;
  email: string;
  deviceType: DeviceType;
  serviceType: ServiceType;
  description: string;
  scheduledDate: string;
}
 
type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';
 
const DEVICE_TYPES: DeviceType[] = ['Laptop', 'PC Desktop', 'Printer', 'Lainnya'];
const SERVICE_TYPES: ServiceType[] = [
  'Perbaikan Hardware',
  'Instalasi OS & Software',
  'Upgrade Komponen',
  'Pembersihan & Maintenance',
  'Recovery Data',
  'Lainnya',
];
 
const initialForm: BookingFormData = {
  name: '',
  phone: '',
  email: '',
  deviceType: 'Laptop',
  serviceType: 'Perbaikan Hardware',
  description: '',
  scheduledDate: '',
};
 
export default function BookingForm() {
  const [form, setForm] = useState<BookingFormData>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof BookingFormData, string>>>({});
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    getSupabaseBrowser()
      .auth.getUser()
      .then(({ data }) => setIsLoggedIn(!!data.user))
      .catch(() => setIsLoggedIn(false));
  }, []);
 
  function update<K extends keyof BookingFormData>(key: K, value: BookingFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }
 
  function validate(): boolean {
    const next: Partial<Record<keyof BookingFormData, string>> = {};
    if (!form.name.trim()) next.name = 'Nama wajib diisi';
    if (!/^[0-9+\s-]{8,15}$/.test(form.phone)) next.phone = 'Nomor telepon tidak valid';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Email tidak valid';
    if (!form.description.trim()) next.description = 'Jelaskan keluhan/masalah perangkat';
    if (!form.scheduledDate) {
      next.scheduledDate = 'Pilih tanggal booking';
    } else if (new Date(form.scheduledDate) < new Date(new Date().toDateString())) {
      next.scheduledDate = 'Tanggal tidak boleh di masa lalu';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }
 
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
 
    setStatus('submitting');
    setErrorMessage('');
 
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          device_type: form.deviceType,
          service_type: form.serviceType,
          description: form.description,
          scheduled_date: form.scheduledDate,
          // Dipakai server HANYA kalau request ini anonymous (belum login).
          // Kalau user sedang login, server pakai user_id dari session, ini diabaikan.
          guest_session_id: getOrCreateGuestSessionId(),
        }),
      });
 
      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        throw new Error(errBody?.error || 'Gagal mengirim booking, coba lagi');
      }
 
      setStatus('success');
      setForm(initialForm);
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Terjadi kesalahan');
    }
  }
 
  const inputBase =
    'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-navy-900 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-navy-600 focus:border-navy-600 transition';
 
  return (
    <div>
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-50">
            Layanan Servis Komputer
          </p>
          <h1 className="mt-1 text-2xl font-bold text-amber-50">Booking Servis</h1>
          <p className="mt-1 text-sm text-amber-300">
            Isi data di bawah, tim kami akan menghubungi untuk konfirmasi jadwal.
          </p>
        </div>
 
        {status === 'success' ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              Menunggu Konfirmasi
            </span>
            <h2 className="mt-3 text-lg font-semibold text-navy-900">Booking berhasil dikirim</h2>
            <p className="mt-1 text-sm text-navy-600">
              Status booking kamu saat ini{' '}
              <span className="font-medium text-amber-700">pending</span>. Tim kami akan
              menghubungi via telepon/email untuk konfirmasi jadwal.
            </p>
            <button
              onClick={() => setStatus('idle')}
              className="mt-4 rounded-lg bg-navy-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-navy-700"
            >
              Buat Booking Lain
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="rounded-2xl
                border border-white/8
              bg-[#0B1629]
                p-6

                shadow-[0_12px_35px_rgba(0,0,0,0.30)]
                ring-1 ring-inset ring-white/2.5

                transition-all duration-300
                hover:-translate-y-0.5
              hover:border-white/12
                hover:shadow-[0_16px_40px_rgba(0,0,0,0.38)]
                before:pointer-events-none
                before:absolute before:inset-0
                before:rounded-2xl"
          >
            {/* Data Pelanggan */}
            <fieldset className="space-y-4">
              <legend className="text-sm font-semibold text-amber-50">Data Pelanggan</legend>
 
              <div>
                <label className="mb-1 block text-xs font-medium text-amber-100">
                  Nama Lengkap
                </label>
                <input
                  className={inputBase}
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  placeholder="cth. Budi Santoso"
                />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
              </div>
 
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-amber-100">
                    No. Telepon
                  </label>
                  <input
                    className={inputBase}
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    placeholder="08xxxxxxxxxx"
                  />
                  {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-amber-100">Email</label>
                  <input
                    className={inputBase}
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    placeholder="nama@email.com"
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                </div>
              </div>
 
              <div>
                <label className="mb-1 block text-xs font-medium text-amber-100">
                  Jenis Perangkat
                </label>
                <select
                  className={inputBase}
                  value={form.deviceType}
                  onChange={(e) => update('deviceType', e.target.value as DeviceType)}
                >
                  {DEVICE_TYPES.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </fieldset>
 
            {/* Detail Booking */}
            <fieldset className="space-y-1 mt-8 border-t border-slate-100 pt-4">
              <legend className="text-sm font-semibold text-amber-50">Detail Booking</legend>
 
              <div>
                <label className="mb-2 block text-xs font-medium text-amber-100">
                  Jenis Layanan
                </label>
                <select
                  className={inputBase}
                  value={form.serviceType}
                  onChange={(e) => update('serviceType', e.target.value as ServiceType)}
                >
                  {SERVICE_TYPES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
 
              <div>
                <label className="mb-2 mt-2.5 block text-xs font-medium text-amber-100">
                  Deskripsi Keluhan
                </label>
                <textarea
                  className={`${inputBase} min-h-22.5 resize-none`}
                  value={form.description}
                  onChange={(e) => update('description', e.target.value)}
                  placeholder="Jelaskan masalah yang dialami..."
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-red-600">{errors.description}</p>
                )}
              </div>
 
              <div>
                <label className="mb-1 block text-xs font-medium text-amber-100">
                  Tanggal Booking
                </label>
                <input
                  type="date"
                  className={inputBase}
                  value={form.scheduledDate}
                  onChange={(e) => update('scheduledDate', e.target.value)}
                />
                {errors.scheduledDate && (
                  <p className="mt-1 text-xs text-red-600">{errors.scheduledDate}</p>
                )}
              </div>
            </fieldset>
 
            {status === 'error' && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                {errorMessage}
              </div>
            )}
 
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full rounded-lg bg-navy-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-navy-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === 'submitting' ? 'Mengirim...' : 'Kirim Booking'}
            </button>
          </form>
        )}
    </div>
  );
}