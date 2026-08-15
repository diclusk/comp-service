import type { Metadata } from 'next';
import Link from 'next/link';
import HeroVisual from './components/HeroVisual';
import HomeSections, { type IconKey } from './components/HomeSections';
import StatusBadge from './components/StatusBadge';
import {
  IconMessage,
  IconCalendar,
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
        <div className="pointer-events-none absolute inset-0 background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0) background-size:32px_32px opacity-40" />
        <div className="pointer-events-none absolute -top-32 right-[-10%] h-28rem w-28rem rounded-full bg-blue-600/25 blur-[110px]" />
        <div className="pointer-events-none absolute top-1/2 left-[-10%] h-80 w-80 rounded-full bg-cyan-500/10 blur-[100px]" />
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

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/booking"
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-blue-600/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-500/30 active:translate-y-0"
              >
                <IconCalendar className="h-4 w-4" />
                Booking Servis Sekarang
                <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </Link>
              <Link
                href="/#chatbot"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10"
              >
                <IconMessage className="h-4 w-4" />
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
            <div className="pointer-events-none absolute inset-0 background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0) background-size:28px_28px" />
            <div className="pointer-events-none absolute -top-10 right-10 h-64 w-64 rounded-full bg-blue-500/20 blur-[100px]" />

            <div className="relative grid gap-8 p-8 sm:p-10 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-0">
              <div>
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-blue-400/30 bg-blue-500/10 text-blue-300 shadow-[0_0_30px_-6px_rgba(59,130,246,0.6)]">
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
                  className="group mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-navy-900 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-xl hover:shadow-white/10"
                >
                  <IconCalendar className="h-4 w-4" />
                  Booking Servis Sekarang
                  <IconArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
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
