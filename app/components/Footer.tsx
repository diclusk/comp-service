'use client';

import { useSyncExternalStore } from 'react';

const NAV_LINKS = [
  { label: 'Beranda', href: '/' },
  { label: 'Layanan', href: '/services' },
  { label: 'Booking Servis', href: '/booking' },
  { label: 'Kontak', href: '#contact' },
];

const OPEN_HOUR = 9;
const CLOSE_HOUR = 18;

function getIsOpenNow(): boolean {
  const now = new Date();
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Jakarta',
    hour: 'numeric',
    hour12: false,
    weekday: 'short',
  }).formatToParts(now);

  const hour = Number(parts.find((p) => p.type === 'hour')?.value);
  const weekday = parts.find((p) => p.type === 'weekday')?.value;

  if (weekday === 'Sun') return false;
  return hour >= OPEN_HOUR && hour < CLOSE_HOUR;
}

function subscribeToClock(callback: () => void) {
  const timer = setInterval(callback, 60_000);
  return () => clearInterval(timer);
}

function getServerSnapshot() {
  return false;
}

export default function Footer() {
  const isOpen = useSyncExternalStore(subscribeToClock, getIsOpenNow, getServerSnapshot);

  return (
    <footer className="bg-navy-900 text-slate-300">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-bold text-white">Servis Komputer</h2>
            <p className="mt-2 max-w-sm text-sm text-slate-400">
              Perbaikan, upgrade, dan maintenance laptop & PC. Booking online, konsultasi lewat
              chat.
            </p>

            <span
              className={`mt-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                isOpen ? 'bg-amber-50 text-amber-700' : 'bg-white/10 text-slate-300'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${isOpen ? 'bg-amber-500' : 'bg-slate-400'}`}
              />
              {isOpen ? 'Buka sekarang' : 'Tutup'}
            </span>
          </div>

          {/* Navigasi */}
          <div>
            <h3 className="text-sm font-semibold text-white">Navigasi</h3>
            <ul className="mt-3 space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-slate-400 transition hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h3 className="text-sm font-semibold text-white">Kontak</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              <li>Jl. Contoh No. 123, Palembang</li>
              <li>0812-3456-7890</li>
              <li>halo@serviskomputer.id</li>
              <li>Senin–Sabtu, 09.00–18.00</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-navy-700 pt-6 text-xs text-slate-500">
          © {new Date().getFullYear()} Servis Komputer. Semua hak cipta dilindungi.
        </div>
      </div>
    </footer>
  );
}