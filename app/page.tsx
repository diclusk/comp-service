import type { Metadata } from 'next';
import Link from 'next/link';
import HeroVisual from './components/HeroVisual';
import HomeSections, { type IconKey } from './components/HomeSections';
import StatusBadge from './components/StatusBadge';
import {
  IconCpu,
  IconHeadset,
  IconArrowRight,
} from './components/Icons';

export const metadata: Metadata = {
  title: 'Servis Komputer — Booking Servis Laptop & PC Online',
  description:
    'Servis komputer dan laptop terpercaya. Diagnosis awal via chat AI, booking online, tim teknisi siap bantu.',
};

const WHY_US: { title: string; description: string; icon: IconKey }[] = [
  {
    title: 'Diagnosis Instan',
    description: 'Chat dulu sama AI kami buat cek kemungkinan masalah sebelum booking.',
    icon: 'message',
  },
  {
    title: 'Booking Fleksibel',
    description: 'Pilih tanggal sendiri, konfirmasi otomatis dari tim — nggak perlu telepon-teleponan.',
    icon: 'calendar',
  },
  {
    title: 'Estimasi Transparan',
    description: 'Biaya diinfoin di awal, nggak ada biaya siluman pas ambil barang.',
    icon: 'clipboard',
  },
];

const SERVICES: { title: string; description: string; icon: IconKey }[] = [
  {
    title: 'Perbaikan Hardware',
    description: 'Diagnosa dan perbaikan komponen fisik: motherboard, keyboard, layar, hingga port yang rusak.',
    icon: 'cpu',
  },
  {
    title: 'Instalasi OS & Software',
    description: 'Install ulang OS, driver, dan software kebutuhan kuliah/kerja — bersih tanpa bloatware.',
    icon: 'code',
  },
  {
    title: 'Upgrade Komponen',
    description: 'Tambah RAM, ganti HDD ke SSD, upgrade GPU — biar laptop lama kerasa baru lagi.',
    icon: 'upload',
  },
  {
    title: 'Pembersihan & Maintenance',
    description: 'Bersihin debu, ganti thermal paste, cek kondisi baterai & kipas secara rutin.',
    icon: 'broom',
  },
  {
    title: 'Recovery Data',
    description: 'Selamatkan file penting dari HDD/SSD rusak atau ke-format nggak sengaja.',
    icon: 'hardDrive',
  },
  {
    title: 'Lainnya',
    description: 'Masalah lain? Konsultasikan dulu ke tim kami, solusi terbaik pasti ada.',
    icon: 'shieldCheck',
  },
];

const STATS = [
  { value: '⭐4.7/5', label: 'Rating pelanggan' },
  { value: '7+', label: 'Unit diservis' },
  { value: '2J-3H', label: 'Rata-rata pengerjaan' },
  { value: '2 Bulan', label: 'Garansi servis' },
];

export default function Home() {
  return (
    <div className="bg-navy-50">
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-linear-to-b from-[#050B18] via-navy-900 to-navy-900">
        {/* Ambient background layers */}
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{ backgroundImage: 'radial-gradient(#7C99B355 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-navy-900 to-transparent" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 pt-16 pb-28 sm:pt-20 lg:grid-cols-2 lg:items-center lg:gap-8 lg:pt-24 lg:pb-36">
          {/* Text column */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge />
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-slate-300 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                Servis semua tipe komputer &amp; laptop
              </span>
            </div>

            <h1 className="mt-5 text-4xl leading-[1.1] font-bold tracking-tight text-white sm:text-5xl lg:text-[3.25rem]">
              Komputer atau Laptop Bermasalah?{' '}
              <span className="bg-linear-to-r from-blue-400 via-sky-300 to-cyan-300 bg-clip-text text-transparent">
                Booking Servis dalam 2 Menit.
              </span>
            </h1>

            <p className="mt-6 max-w-md text-base leading-relaxed text-slate-400">
              Diagnosis awal lewat chat AI, jadwalkan servis online, teknisi kami yang urus
              sisanya.
            </p>

            <div className="relative mt-6 flex flex-col gap-4 p-2 sm:flex-row">
              {/* Corner ticks */}
              <span className="pointer-events-none absolute -left-0.5 -top-0.5 h-2 w-2 border-l border-t border-white/20" />
              <span className="pointer-events-none absolute -right-0.5 -top-0.5 h-2 w-2 border-r border-t border-white/20" />
              <span className="pointer-events-none absolute -bottom-0.5 -left-0.5 h-2 w-2 border-b border-l border-white/20" />
              <span className="pointer-events-none absolute -bottom-0.5 -right-0.5 h-2 w-2 border-b border-r border-white/20" />

              {/* Solid border = tindakan final (booking). Dashed = tindakan awal/eksploratif (tanya dulu). */}
              <Link
                href="/booking"
                className="group inline-flex items-center justify-center gap-2.5 border border-[#7C99B3] bg-[#7C99B3] px-6 py-3 font-mono text-sm font-semibold tracking-wide text-navy-900 transition-colors duration-150 hover:border-white hover:bg-white"
              >
                <span className="opacity-50"></span>
                Booking Servis Sekarang
                <IconArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/#chatbot"
                className="group inline-flex items-center justify-center gap-2.5 border border-dashed border-white/25 px-6 py-3 font-mono text-sm text-white transition-colors duration-150 hover:border-[#7C99B3] hover:text-[#7C99B3]"
              >
                <span className="text-[#7C99B3] group-hover:text-current">&gt;_</span>
                Tanya AI Dulu
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-2 text-sm text-slate-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Slot booking hari ini masih tersedia
            </div>

            {/* Trust stats */}
            <div className="mt-10 grid max-w-md grid-cols-2 gap-x-6 gap-y-5 border-t border-white/10 pt-8 sm:grid-cols-4 sm:gap-x-4">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <p className="text-lg font-bold text-white sm:text-xl">{stat.value}</p>
                  <p className="mt-0.5 text-[11px] leading-tight text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Illustration column */}
          <div className="hidden lg:block">
            <HeroVisual />
          </div>
        </div>
      </section>

      <HomeSections whyUs={WHY_US} services={SERVICES}>
        {/* CTA Banner */}
        <section className="px-6 pb-20">
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-navy-900">
            <div
              className="pointer-events-none absolute inset-0"
              style={{ backgroundImage: 'radial-gradient(#7C99B340 1px, transparent 1px)', backgroundSize: '28px 28px' }}
            />

            <div className="relative grid gap-8 p-8 sm:p-10 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-0">
              <div>
                <div className="flex h-14 w-14 items-center justify-center border border-[#7C99B3]/40 text-[#7C99B3]">
                  <IconHeadset className="h-6 w-6" />
                </div>
                <h2 className="mt-5 text-xl font-bold text-white sm:text-2xl">
                  Masih Ragu? Konsultasi Awal Gratis.
                </h2>
                <p className="mt-2 max-w-sm text-sm text-slate-400">
                  Booking sekarang, jadwal bisa diatur belakangan lewat konfirmasi tim kami.
                </p>
                <Link
                  href="/booking"
                  className="group mt-6 inline-flex items-center gap-2.5 border border-[#7C99B3] bg-[#7C99B3] px-6 py-3 font-mono text-sm font-semibold tracking-wide text-navy-900 transition-colors duration-150 hover:border-white hover:bg-white"
                >
                  <span className="opacity-50"></span>
                  Booking Servis Sekarang
                  <IconArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-1" />
                </Link>
              </div>

              <div className="relative hidden h-full min-h-55 items-center justify-center rounded-2xl bg-linear-to-br from-navy-700 via-navy-900 to-[#050B18] lg:flex">
                <div className="absolute h-40 w-40 rounded-full bg-blue-500/20 blur-2xl" />
                <IconCpu className="relative h-24 w-24 text-blue-400/40" />
              </div>
            </div>
          </div>
        </section>
      </HomeSections>
    </div>
  );
}