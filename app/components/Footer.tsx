'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  IconMapPin,
  IconPhone,
  IconMail,
  IconClock,
  IconFacebook,
  IconInstagram,
  IconWhatsapp,
  IconYoutube,
} from './Icons';

const NAV_LINKS = [
  { label: 'Beranda', href: '/' },
  { label: 'Layanan', href: '/services' },
  { label: 'Booking', href: '/booking' },
  { label: 'Kontak', href: '/#kontak' },
];

const SERVICE_LINKS = [
  'Perbaikan Hardware',
  'Instalasi OS & Software',
  'Upgrade Komponen',
  'Pembersihan & Maintenance',
  'Recovery Data',
];

const SOCIALS = [
  { label: 'Facebook', icon: IconFacebook, href: '#' },
  { label: 'Instagram', icon: IconInstagram, href: '#' },
  { label: 'WhatsApp', icon: IconWhatsapp, href: '#' },
  { label: 'YouTube', icon: IconYoutube, href: '#' },
];

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900 text-white">
                <Image src="/favicon.svg" alt="Logo" width={60} height={60} />
              </div>
              <div className="leading-tight">
                <div className="flex items-baseline gap-1">
                  <span className="text-base font-bold text-white">Servis</span>
                  <span className="text-base font-bold text-blue-400">Komputer</span>
                </div>
                <p className="text-[11px] text-slate-400">Cepat &middot; Profesional &middot; Terpercaya</p>
              </div>
            </Link>

            <p className="mt-4 max-w-sm text-sm text-slate-400">
              Perbaikan, upgrade, dan maintenance laptop & PC. Booking online, konsultasi lewat
              chat.
            </p>

            <div className="mt-5 flex items-center gap-2">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigasi */}
          <div>
            <h3 className="text-sm font-semibold text-white">Navigasi</h3>
            <ul className="mt-3 space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-slate-400 transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Layanan */}
          <div>
            <h3 className="text-sm font-semibold text-white">Layanan</h3>
            <ul className="mt-3 space-y-2">
              {SERVICE_LINKS.map((service) => (
                <li key={service}>
                  <Link href="/services" className="text-sm text-slate-400 transition hover:text-white">
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div id="kontak">
            <h3 className="text-sm font-semibold text-white">Kontak</h3>
            <ul className="mt-3 space-y-2.5 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <IconMapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                Jl. Sersan Sani No.1019, Pipa Jaya, Kec. Kemuning, Kota Palembang, Sumatera Selatan
              </li>
              <li className="flex items-center gap-2">
                <IconPhone className="h-4 w-4 shrink-0 text-slate-500" />
                0882-8771-1618
              </li>
              <li className="flex items-center gap-2">
                <IconMail className="h-4 w-4 shrink-0 text-slate-500" />
                zenithops78@gmail.com
              </li>
              <li className="flex items-center gap-2">
                <IconClock className="h-4 w-4 shrink-0 text-slate-500" />
                Senin&ndash;Sabtu, 09.00&ndash;18.00
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Servis Komputer. Semua hak cipta dilindungi.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="transition hover:text-slate-300">Privasi</a>
            <span>&middot;</span>
            <a href="#" className="transition hover:text-slate-300">Syarat & Ketentuan</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
