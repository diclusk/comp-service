import type { Metadata } from 'next';
import BookingForm from '@/app/components/BookingForm';

export const metadata: Metadata = {
  title: 'Booking Servis Komputer',
  description:
    'Jadwalkan servis komputer atau laptop Anda — pilih jenis servis, ceritakan masalahnya, dan pilih waktu yang cocok.',
};

const SERVICE_HIGHLIGHTS = [
  {
    title: 'Diagnosa awal gratis',
    detail: 'Kami cek dulu sebelum kasih estimasi biaya.',
  },
  {
    title: 'Teknisi berpengalaman',
    detail: 'Sudah menangani ratusan kasus hardware & software.',
  },
  {
    title: 'Garansi servis',
    detail: '7 hari garansi untuk setiap pengerjaan.',
  },
];

const BUSINESS_HOURS = [
  { day: 'Senin – Jumat', hours: '09.00 – 17.00' },
  { day: 'Sabtu', hours: '09.00 – 17.00' },
  { day: 'Minggu', hours: 'Tutup' },
];

export default function BookingPage() {
  return (
    <main className="min-h-screen bg-[#060A13] px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">

        {/* Page Header */}
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
          <span
            className="
              inline-flex items-center rounded-full
              border border-teal-400/20
              bg-teal-400/5
              px-3 py-1
              text-xs font-medium
              tracking-wide text-teal-300
            "
          >
            Booking Servis
          </span>

          <h1
            className="
              mt-4
              text-3xl font-semibold tracking-tight
              text-white
              sm:text-4xl
            "
          >
            Jadwalkan servis komputer Anda
          </h1>

          <p
            className="
              mx-auto mt-3 max-w-xl
              text-sm leading-6
              text-slate-400
              sm:text-base
            "
          >
            Isi form di bawah dan tim kami akan menghubungi Anda
            untuk mengonfirmasi jadwal servis.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)] lg:items-start">

          {/* Sidebar */}
          <aside className="space-y-6 lg:top-28">

            {/* Why Us */}
            <div
              className="
                relative overflow-hidden
                rounded-2xl
                border border-white/10
                bg-linear-to-b from-[#131d30] to-[#080c14]
                p-6

                shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_20px_45px_-15px_rgba(0,0,0,0.75)]

                transition-all duration-300
                hover:-translate-y-0.5
                hover:border-white/15
                hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_24px_50px_-15px_rgba(0,0,0,0.85)]
              "
            >
              {/* Subtle top glow */}
              <div
                className="
                  pointer-events-none absolute
                  inset-x-0 top-0 h-px
                  bg-linear-to-r
                  from-transparent
                  via-teal-400/40
                  to-transparent
                "
              />

              <div className="flex items-center gap-3">
                <h2 className="shrink-0 text-sm font-semibold text-white">
                  Kenapa servis di sini?
                </h2>

                <span className="h-px flex-1 bg-white/10" />
              </div>

              <ul className="mt-5 space-y-5">
                {SERVICE_HIGHLIGHTS.map((item) => (
                  <li key={item.title} className="flex gap-3.5">
                    <span
                      className="
                        mt-1.5
                        flex h-2 w-2 shrink-0
                        rounded-full
                        bg-teal-400
                        shadow-[0_0_10px_rgba(45,212,191,0.5)]
                      "
                      aria-hidden="true"
                    />

                    <div>
                      <p className="text-sm font-medium text-slate-200">
                        {item.title}
                      </p>

                      <p className="mt-1 text-sm leading-5 text-slate-500">
                        {item.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Business Hours */}
            <div
              className="
                relative overflow-hidden
                rounded-2xl
                border border-white/10
                bg-linear-to-b from-[#131d30] to-[#080c14]
                p-6

                shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_20px_45px_-15px_rgba(0,0,0,0.75)]

                transition-all duration-300
                hover:-translate-y-0.5
                hover:border-white/15
                hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_24px_50px_-15px_rgba(0,0,0,0.85)]
              "
            >
              {/* Subtle top glow */}
              <div
                className="
                  pointer-events-none absolute
                  inset-x-0 top-0 h-px
                  bg-linear-to-r
                  from-transparent
                  via-cyan-400/30
                  to-transparent
                "
              />

              <div className="flex items-center gap-3">
                <h2 className="shrink-0 text-sm font-semibold text-white">
                  Jam operasional
                </h2>

                <span className="h-px flex-1 bg-white/10" />
              </div>

              <dl className="mt-5 space-y-3 text-sm">
                {BUSINESS_HOURS.map((row) => (
                  <div
                    key={row.day}
                    className="
                      flex items-center justify-between
                      rounded-lg
                      border border-white/5
                      bg-white/2
                      px-3 py-2.5
                    "
                  >
                    <dt className="text-slate-400">
                      {row.day}
                    </dt>

                    <dd
                      className={
                        row.hours === 'Tutup'
                          ? 'font-medium text-slate-500'
                          : 'font-medium text-teal-300'
                      }
                    >
                      {row.hours}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Small reassurance */}
            <div
              className="
                rounded-2xl
                border border-teal-400/10
                bg-teal-400/5
                px-5 py-4
              "
            >
              <p className="text-xs leading-5 text-slate-400">
                <span className="font-medium text-teal-300">
                  💡 Catatan:
                </span>{' '}
                Jadwal booking akan dikonfirmasi kembali oleh tim
                sebelum servis dilakukan.
              </p>
            </div>
          </aside>

          {/* Booking Form */}
          <BookingForm />
        </div>
      </div>
    </main>
  );
}