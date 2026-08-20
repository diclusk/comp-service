'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { BorderBeam } from '@/app/components/border-beam';
import { getOrCreateGuestSessionId } from '@/lib/Guestsession';
import { compressImage } from '@/lib/compressImage';
import { getSupabaseBrowser } from '@/lib/supabase/client';

const MAX_PHOTO_BYTES = 5 * 1024 * 1024; // 5MB, sebelum dikompres

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

type SubmitStatus = 'idle' | 'success';

function todayISO() {
  return new Date().toISOString().split('T')[0];
}

export default function BookingPage() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [deviceType, setDeviceType] = useState(DEVICE_TYPES[0]);
  const [serviceType, setServiceType] = useState(SERVICE_TYPES[0]);
  const [description, setDescription] = useState('');
  const [bookingDate, setBookingDate] = useState(todayISO);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [compressing, setCompressing] = useState(false);

  async function handlePhotoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ''; // biar bisa pilih file yang sama lagi kalau mau ganti
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('File foto harus berupa gambar');
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setError('Ukuran foto maksimal 5MB');
      return;
    }

    setError('');
    setCompressing(true);
    try {
      const compressed = await compressImage(file);
      setPhotoFile(compressed);
      setPhotoPreview(URL.createObjectURL(compressed));
    } catch {
      setError('Gagal memproses foto, coba foto lain');
    } finally {
      setCompressing(false);
    }
  }

  function removePhoto() {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoFile(null);
    setPhotoPreview('');
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let photoUrl: string | null = null;
      if (photoFile) {
        const supabase = getSupabaseBrowser();
        const path = `${getOrCreateGuestSessionId() || 'guest'}-${Date.now()}.jpg`;
        const { error: uploadError } = await supabase.storage
          .from('booking-photos')
          .upload(path, photoFile, { contentType: 'image/jpeg' });

        if (uploadError) {
          throw new Error('Gagal upload foto: ' + uploadError.message);
        }

        const { data: publicUrlData } = supabase.storage.from('booking-photos').getPublicUrl(path);
        photoUrl = publicUrlData.publicUrl;
      }

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          phone,
          email,
          device_type: deviceType,
          service_type: serviceType,
          description,
          scheduled_date: bookingDate,
          guest_session_id: getOrCreateGuestSessionId(),
          photo_url: photoUrl,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || 'Gagal mengirim booking');
      }

      // Reset form ke kondisi awal biar siap dipakai lagi kalau user mau booking lagi
      setFullName('');
      setPhone('');
      setEmail('');
      setDeviceType(DEVICE_TYPES[0]);
      setServiceType(SERVICE_TYPES[0]);
      setDescription('');
      setBookingDate(todayISO());
      removePhoto();
      setStatus('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  }

  if (status === 'success') {
    return (
      <div className="relative rounded-2xl p-0.5 [bg-gradient-to-b_from-[#0B1629]_to-[#060A13]] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_20px_45px_-15px_rgba(0,0,0,0.85)] scheme:dark">
        <BorderBeam size={500} duration={8} colorFrom="#2dd4bf" colorTo="#22d3ee" borderWidth={2} ambientIntensity={0.14} />

        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-linear-to-b from-[#131d30] to-[#080c14] p-6 sm:p-8 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_20px_45px_-15px_rgba(0,0,0,0.85)] scheme:dark">
          <div className="flex flex-col items-center py-6 text-center sm:py-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-teal-400/30 bg-teal-400/10">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-7 w-7 text-teal-400"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>

            <h2 className="mt-4 text-lg font-semibold text-white">Booking berhasil dikirim</h2>
            <p className="mt-2 max-w-sm text-sm text-slate-400">
              Terima kasih! Tim kami akan menghubungi kamu untuk konfirmasi jadwal servis.
            </p>

            <button
              type="button"
              onClick={() => setStatus('idle')}
              className="mt-6 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Buat Booking Baru
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl p-0.5 [bg-gradient-to-b_from-[#0B1629]_to-[#060A13]] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_20px_45px_-15px_rgba(0,0,0,0.85)] scheme:dark">
      <BorderBeam size={300} duration={10} colorFrom="#2dd4bf" colorTo="#22d3ee" borderWidth={2} ambientIntensity={0.14} />

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
            placeholder="cth. Nick Hermawan"
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
            min={new Date().toISOString().split('T')[0]}
            className={inputClass}
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-300">
            Foto Perangkat <span className="text-slate-500">(opsional)</span>
          </label>

          {photoPreview ? (
            <div className="mt-1.5 flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoPreview}
                alt="Preview foto perangkat"
                className="h-16 w-16 rounded-lg border border-white/10 object-cover"
              />
              <button
                type="button"
                onClick={removePhoto}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white transition hover:bg-white/10"
              >
                Hapus Foto
              </button>
            </div>
          ) : (
            <label
              htmlFor="photo"
              className="mt-1.5 flex w-full cursor-pointer items-center justify-center rounded-lg border border-dashed border-white/15 bg-[#0f1826] px-3.5 py-4 text-sm text-slate-400 transition hover:border-teal-400/40 hover:text-slate-300"
            >
              {compressing ? 'Memproses foto...' : 'Klik untuk pilih foto (maks. 5MB)'}
              <input
                id="photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                disabled={compressing}
                className="hidden"
              />
            </label>
          )}
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-red-400/20 bg-red-400/10 px-3.5 py-2.5 text-sm text-red-300">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || compressing}
          className="mt-6 w-full rounded-lg bg-teal-400 py-2.5 text-sm font-semibold text-[#06110f] transition hover:bg-teal-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Mengirim...' : 'Kirim Booking'}
        </button>
      </form>
    </div>
  );
}