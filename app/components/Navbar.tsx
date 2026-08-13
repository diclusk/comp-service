'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/', label: 'Beranda' },
  { href: '/services', label: 'Layanan' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav
        className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6"
        aria-label="Navigasi utama"
      >
        <Link href="/" className="flex items-center gap-2 text-slate-900" onClick={() => setIsOpen(false)}>
          <LogoMark />
          <span className="text-sm font-semibold tracking-tight">Servis Komputer</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 sm:flex">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.href} href={link.href} active={pathname === link.href}>
              {link.label}
            </NavLink>
          ))}
          <Link
            href="/booking"
            className="ml-2 rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white transition
              hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2
              focus-visible:outline-teal-700"
          >
            Booking Sekarang
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-controls="mobile-nav"
          aria-label={isOpen ? 'Tutup menu' : 'Buka menu'}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 sm:hidden"
        >
          {isOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div id="mobile-nav" className="border-t border-slate-200 bg-white px-4 pb-4 sm:hidden">
          <div className="flex flex-col gap-1 pt-2">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                active={pathname === link.href}
                onClick={() => setIsOpen(false)}
                mobile
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              href="/booking"
              onClick={() => setIsOpen(false)}
              className="mt-2 rounded-lg bg-teal-700 px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-teal-800"
            >
              Booking Sekarang
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function NavLink({
  href,
  active,
  children,
  onClick,
  mobile,
}: {
  href: string;
  active: boolean;
  children: ReactNode;
  onClick?: () => void;
  mobile?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={[
        'rounded-lg px-3 py-2 text-sm font-medium transition focus-visible:outline-2',
        'focus-visible:outline-offset-2 focus-visible:outline-teal-700',
        mobile ? 'block' : '',
        active ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
      ].join(' ')}
    >
      {children}
    </Link>
  );
}

function LogoMark() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-teal-700"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <line x1="8" y1="20" x2="16" y2="20" />
      <line x1="12" y1="16" x2="12" y2="20" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}