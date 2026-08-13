import type { Metadata } from 'next';
import Link from 'next/link';
import ChatBot from './components/ChatBot';

export const metadata: Metadata = {
  title: 'Servis Komputer — Booking Servis Laptop & PC Online',
  description:
    'Servis komputer dan laptop terpercaya. Diagnosis awal via chat AI, booking online, tim teknisi siap bantu.',
};

const WHY_US = [
  {
    title: 'Diagnosis Instan',
    description: 'Chat dulu sama AI kami buat cek kemungkinan masalah, sebelum booking.',
  },
  {
    title: 'Booking Fleksibel',
    description: 'Pilih tanggal sendiri, konfirmasi otomatis dari tim — nggak perlu telepon-teleponan.',
  },
  {
    title: 'Estimasi Transparan',
    description: 'Biaya diinfoin di awal, nggak ada biaya siluman pas ambil barang.',
  },
];

const SERVICES = [
  {
    title: 'Perbaikan Hardware',
    description: 'Diagnosa dan perbaikan komponen fisik: motherboard, keyboard, layar, hingga port yang rusak.',
  },
  {
    title: 'Instalasi Software',
    description: 'Install ulang OS, driver, dan software kebutuhan kuliah/kerja — bersih tanpa bloatware.',
  },
  {
    title: 'Upgrade Komponen',
    description: 'Tambah RAM, ganti HDD ke SSD, upgrade GPU — biar laptop lama kerasa baru lagi.',
  },
  {
    title: 'Pembersihan & Maintenance',
    description: 'Bersihin debu, ganti thermal paste, cek kondisi baterai & kipas secara rutin.',
  },
  {
    title: 'Recovery Data',
    description: 'Selamatkan file penting dari HDD/SSD rusak atau ke-format nggak sengaja.',
  },
];

export default function Home() {
  return (
    <div className="bg-slate-100">
      {/* Hero */}
      <section className="px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Slot booking hari ini masih tersedia
          </span>

          <h1 className="mt-5 text-3xl font-bold text-navy-900 sm:text-5xl">
            Komputer atau Laptop Bermasalah?
            <br className="hidden sm:block" /> Booking Servis dalam 2 Menit.
          </h1>

          <p className="mt-4 text-base text-navy-600 sm:text-lg">
            Diagnosis awal lewat chat AI, jadwalkan servis online, tim teknisi kami yang urus
            sisanya.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/booking"
              className="rounded-lg bg-navy-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-navy-700"
            >
              Booking Servis Sekarang
            </Link>
            <a
              href="#chatbot"
              className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-navy-900 transition hover:border-navy-400"
            >
              Tanya AI Dulu
            </a>
          </div>
        </div>
      </section>

      {/* Kenapa Pilih Kami */}
      <section className="px-4 pb-16">
        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-3">
          {WHY_US.map((item) => (
            <div key={item.title} className="rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-navy-900">{item.title}</h3>
              <p className="mt-2 text-sm text-navy-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Layanan */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-navy-400">
              Layanan Kami
            </p>
            <h2 className="mt-1 text-2xl font-bold text-navy-900">Apa yang Bisa Kami Bantu</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service) => (
              <div
                key={service.title}
                className="rounded-xl border border-slate-200 bg-slate-50 p-5 transition hover:border-navy-400"
              >
                <h3 className="text-sm font-semibold text-navy-900">{service.title}</h3>
                <p className="mt-2 text-sm text-navy-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl rounded-2xl bg-navy-900 px-6 py-10 text-center">
          <h2 className="text-xl font-bold text-white sm:text-2xl">
            Masih Ragu? Konsultasi Awal Gratis.
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            Booking sekarang, jadwal bisa diatur belakangan lewat konfirmasi tim kami.
          </p>
          <Link
            href="/booking"
            className="mt-6 inline-block rounded-lg bg-white px-6 py-3 text-sm font-medium text-navy-900 transition hover:bg-slate-100"
          >
            Booking Servis Sekarang
          </Link>
        </div>
      </section>

    </div>
  );
}