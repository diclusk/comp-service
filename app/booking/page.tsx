import type { Metadata } from 'next';
import BookingForm from '@/app/components/BookingForm';

export const metadata: Metadata = {
  title: 'Booking Servis Komputer',
  description:
    'Jadwalkan servis komputer atau laptop Anda — pilih jenis servis, ceritakan masalahnya, dan pilih waktu yang cocok.',
};

const SERVICE_HIGHLIGHTS = [
  { title: 'Diagnosa awal gratis', detail: 'Kami cek dulu sebelum kasih estimasi biaya.' },
  { title: 'Teknisi berpengalaman', detail: 'Sudah menangani ratusan kasus hardware & software.' },
  { title: 'Garansi servis', detail: '7 hari garansi untuk setiap pengerjaan.' },
];

const BUSINESS_HOURS = [
  { day: 'Senin – Jumat', hours: '09.00 – 17.00' },
  { day: 'Sabtu', hours: '09.00 – 17.00' },
  { day: 'Minggu', hours: 'Tutup' },
];

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center sm:mb-12">
          <span className="text-xs font-medium uppercase tracking-wide text-teal-700">
            Booking Servis
          </span>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">
            Jadwalkan servis komputer Anda
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            Isi form di bawah, tim kami hubungi untuk konfirmasi jadwal.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:items-start">
          <aside className="space-y-6 lg:sticky lg:top-12">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-sm font-semibold text-slate-900">Kenapa servis di sini?</h2>
              <ul className="mt-4 space-y-4">
                {SERVICE_HIGHLIGHTS.map((item) => (
                  <li key={item.title} className="flex gap-3">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-600" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-medium text-slate-800">{item.title}</p>
                      <p className="text-sm text-slate-500">{item.detail}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-sm font-semibold text-slate-900">Jam operasional</h2>
              <dl className="mt-4 space-y-2 text-sm">
                {BUSINESS_HOURS.map((row) => (
                  <div key={row.day} className="flex justify-between">
                    <dt className="text-slate-500">{row.day}</dt>
                    <dd className="font-medium text-slate-800">{row.hours}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>

          <BookingForm />
        </div>
      </div>
    </div>
  );
}